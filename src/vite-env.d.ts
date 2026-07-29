/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_ENV: string
  readonly VITE_PUBLIC_APPLICATION_FUNCTION_URL: string
  readonly VITE_CEP_LOOKUP_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
