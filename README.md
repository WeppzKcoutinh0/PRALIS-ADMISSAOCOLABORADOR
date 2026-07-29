# Portal de Admissão — Padaria Pralís

Aplicação provisória para cadastro de novos colaboradores e preparação das
informações de admissão para o Departamento Pessoal e para a contabilidade
(Questor X-Zen). Construída com Vue 3 + Vite + TypeScript + Supabase.

Este é um "quebra-galho" operacional: cobre exatamente o fluxo abaixo, sem
tentar ser um sistema completo de Departamento Pessoal.

```
Colaborador recebe o link
  -> Preenche dados e envia documentos
  -> DP acessa o cadastro
  -> DP completa os dados internos
  -> Sistema monta a ficha no padrão da contabilidade
  -> DP copia e cola no Questor X-Zen
```

## Identidade visual

Os ativos oficiais da marca (logotipo, paleta de cores, fontes Montserrat e
MADE Dillan, símbolo e pattern) foram extraídos da pasta
`Pralis_Identidade_Visual` enviada e organizados em `src/assets/brand`. As
cores em `src/assets/styles/tokens.css` vêm diretamente da paleta oficial:

- Dourado/Bege `#B3810B`
- Laranja `#EE7435`
- Bordô `#5E3731`

> A fonte **MADE Dillan** está incluída apenas como referência de exibição
> (títulos). Confirme com quem forneceu os arquivos se a licença cobre uso
> web/produção antes de publicar publicamente. Se não cobrir, troque a
> variável `--pralis-font-display` em `tokens.css` por uma fonte de
> licença compatível.

## Stack

- Vue 3 (Composition API, `<script setup lang="ts">`)
- Vite + TypeScript
- Supabase (Postgres, Auth, Storage, Edge Functions)
- Vue Router + Pinia
- CSS próprio (sem framework visual), com design tokens da marca

## Estrutura do projeto

```
src/
├── assets/brand        # logos, ícones, pattern e fontes oficiais
├── assets/styles        # tokens.css, fonts.css, global.css
├── components/base       # componentes de UI reutilizáveis
├── components/employee-form
├── components/documents
├── components/dp
├── components/accounting
├── composables           # useApplicationForm, useAuth, useDpApplications...
├── config                # campos, opções, status, mapeamento contábil
├── layouts               # PublicLayout, AuthLayout, DpLayout
├── pages/public|auth|dp
├── router
├── services/supabase|applications|documents|accounting
├── stores                # Pinia (auth)
├── types
└── utils                 # máscaras, validadores, formatadores

supabase/
├── migrations/           # schema completo + RLS + storage (SQL)
└── functions/public-application/  # Edge Function do fluxo público
```

## 1. Criar o projeto no Supabase

1. Crie uma conta e um projeto em https://supabase.com.
2. Em **Project Settings → API**, copie a `Project URL` e a `anon public key`.
3. Em **Project Settings → API → service_role**, copie a `service_role key`
   (fica só no servidor — nunca no frontend).

## 2. Rodar as migrations

Usando a Supabase CLI (`npm install -g supabase`):

```bash
supabase login
supabase link --project-ref <seu-project-ref>
supabase db push
```

Isso cria todas as tabelas, funções, triggers, RLS e o bucket privado
`employee-documents` (as migrations estão em `supabase/migrations`, em
ordem numerada). Alternativamente, copie e execute cada arquivo `.sql`
manualmente pelo SQL Editor do painel do Supabase, na ordem dos números.

## 3. Publicar a Edge Function pública

```bash
supabase functions deploy public-application --no-verify-jwt
```

A flag `--no-verify-jwt` é necessária porque esta função atende o
colaborador **sem login** (ela mesma valida o token do cadastro
internamente). Nenhuma outra rota da aplicação usa a service_role — apenas
esta função, rodando no servidor do Supabase.

Se quiser restringir o domínio que pode chamar a função, defina o secret:

```bash
supabase secrets set ALLOWED_ORIGIN=https://seu-dominio-na-vercel.com
```

## 4. Criar o primeiro usuário do Departamento Pessoal

Não existe cadastro público de contas internas (por segurança). Crie o
primeiro usuário manualmente:

1. No painel Supabase, vá em **Authentication → Users → Add user** e crie
   um usuário com e-mail e senha (real, do responsável pelo DP).
2. Copie o `UID` gerado.
3. No SQL Editor, rode (substituindo os valores reais):

```sql
insert into public.profiles (id, full_name, email, role, is_active)
values ('COLE-O-UID-AQUI', 'Nome da pessoa responsável', 'email@pralis.com.br', 'admin', true);
```

Use `role = 'admin'` para o primeiro usuário (acesso completo). Usuários
seguintes podem ser `dp` (preenchimento) ou `viewer` (somente leitura), e
podem ser cadastrados pelo próprio admin repetindo o passo acima.

## 5. Configurar variáveis de ambiente do frontend

Copie `.env.example` para `.env` e preencha:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_ANON_KEY
VITE_APP_NAME=Portal de Admissão Pralis
VITE_APP_ENV=development
VITE_PUBLIC_APPLICATION_FUNCTION_URL=https://SEU-PROJETO.supabase.co/functions/v1/public-application
VITE_CEP_LOOKUP_URL=https://viacep.com.br/ws
```

Nunca coloque a `service_role key` neste arquivo — ela não é usada pelo
frontend em nenhum momento.

## 6. Rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`. Para acessar a área do DP, use
`/login` com o usuário criado no passo 4.

## 7. Publicar na Vercel

1. Suba o repositório para o GitHub/GitLab.
2. Na Vercel, importe o projeto (framework detectado automaticamente como
   Vite, usando o `vercel.json` incluso).
3. Configure as mesmas variáveis de ambiente do passo 5 em
   **Project Settings → Environment Variables**.
4. Deploy. O `vercel.json` já cuida do rewrite de SPA (`/* → /index.html`).

## Fluxo do colaborador

`/` → `/cadastro/iniciar` (gera um token público) → `/cadastro/:token`
(formulário em 7 etapas: identificação, documentos pessoais, endereço,
informações pessoais, filiação, contato, envio de documentos) →
`/cadastro/:token/revisao` (8ª etapa: revisão + aceite de privacidade +
envio) → `/cadastro/:token/sucesso` (protocolo gerado).

Todo esse fluxo público passa exclusivamente pela Edge Function
`public-application`, nunca pelas tabelas diretamente — por isso não há
nenhuma policy de `insert`/`update` para `anon` nas migrations.

## Fluxo do DP

`/login` → `/dp` (painel com contagem por status) → `/dp/cadastros`
(lista com busca, filtros, paginação) → `/dp/cadastros/:id` (dados do
colaborador + documentos + transição de status) →
`/dp/cadastros/:id/interno` (os 9 campos obrigatórios internos, com
rascunho e finalização) → `/dp/cadastros/:id/questor` (ficha consolidada
com botão "Copiar tudo" e cópia por campo, registrando quem copiou e
quando).

## Documentos solicitados

A lista de documentos fica centralizada em `src/config/documentTypes.ts` —
ajuste ali sem precisar tocar em nenhum componente.

## Segurança

- Row Level Security ativo em todas as tabelas (`supabase/migrations/0012_rls_policies.sql`).
- `viewer` só lê; `dp`/`admin` leem e editam dados internos e a ficha
  contábil; só `admin` gerencia perfis e apaga documentos.
- Bucket de documentos é privado; o DP só visualiza por meio de URLs
  assinadas temporárias (5 minutos).
- O upload público usa *Signed Upload URLs* geradas pela Edge Function
  (nunca há policy de escrita para `anon` no Storage).
- CPF é armazenado só com dígitos, com índice único parcial que impede
  duplicidade de cadastro ativo (`status <> 'cancelled'`).

## O que este projeto não faz (por design)

Férias, rescisão, folha de pagamento, ponto, holerites ou qualquer módulo
completo de Departamento Pessoal. O objetivo é só juntar e organizar os
dados de admissão para agilizar o lançamento manual no Questor X-Zen.
