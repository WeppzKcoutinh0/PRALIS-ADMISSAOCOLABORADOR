import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Configuração do Supabase ausente. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env (veja .env.example).'
  )
}

// Cliente publico do Supabase. Usa somente a chave anonima — nunca a
// service_role, que deve permanecer restrita as Edge Functions.
//
// OBS: propositalmente não usamos o generic `createClient<Database>` aqui.
// As linhas retornadas pelo Supabase já são convertidas para os tipos da
// aplicação pelas funções em `services/*/mappers.ts`, então preferimos
// manter o cliente simples em vez de manter um schema generated-like em
// paralelo. Se o projeto crescer, troque por
// `supabase gen types typescript` e reative a tipagem forte aqui.
export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
})
