import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },
  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/node_modules/**',
      // Roda em Deno (Edge Functions), fora do projeto Vite/Vue.
      'supabase/functions/**'
    ]
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  // Desliga as regras de formatacao do eslint-plugin-vue (quebras de linha,
  // atributos por linha etc.) — quem cuida de formatacao aqui e o Prettier,
  // nao o ESLint. Precisa vir depois dos presets acima para sobrescreve-los.
  eslintConfigPrettier,
  {
    rules: {
      // Vue 3 + <script setup> ja cobre a maior parte disso; relaxa a
      // exigencia de nome multi-palavra para paginas/rotas.
      'vue/multi-word-component-names': 'off',

      // Decisao arquitetural, nao descuido: o wizard de cadastro e o
      // formulario interno do DP passam um objeto reativo unico (`draft` /
      // `form`) como prop entre os componentes de etapa, e cada etapa
      // escreve diretamente nos proprios campos desse objeto. E o padrao
      // "composable/model compartilhado via prop", usado de forma
      // consistente no projeto — nao uma mutacao acidental.
      'vue/no-mutating-props': 'off',

      // Projeto usa TypeScript: a opcionalidade de cada prop ja e expressa
      // pelo tipo (`prop?: T`), entao exigir um valor padrao explicito para
      // toda prop opcional e redundante aqui.
      'vue/require-default-prop': 'off'
    }
  }
)
