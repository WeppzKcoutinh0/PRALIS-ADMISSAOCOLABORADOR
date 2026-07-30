// Edge Function: dp-internal-sync
//
// Chamada pelo frontend do Departamento Pessoal (autenticado) quando os
// dados internos de um colaborador sao finalizados. Sincroniza esses dados
// com a planilha do Google, atualizando a MESMA linha do colaborador
// (localizada pelo numero de protocolo), em vez de criar uma linha nova.
//
// Ao contrario da funcao public-application, esta roda com verificacao de
// JWT habilitada (padrao do Supabase) — so usuarios do DP autenticados
// conseguem chama-la. As consultas usam o token do proprio usuario, entao
// as politicas de RLS (is_staff()) se aplicam normalmente.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const SHEETS_WEBHOOK_URL = Deno.env.get('GOOGLE_SHEETS_WEBHOOK_URL')
const SHEETS_WEBHOOK_SECRET = Deno.env.get('GOOGLE_SHEETS_WEBHOOK_SECRET')

const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') ?? '*'

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

function formatDateForSheet(isoDate: string | null | undefined): string {
  if (!isoDate) return ''
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(isoDate)
  if (!match) return isoDate
  const [, yyyy, mm, dd] = match
  return `${dd}/${mm}/${yyyy}`
}

function yesNo(value: boolean | null): string {
  if (value === null) return ''
  return value ? 'Sim' : 'Não'
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return json({ error: 'Método não permitido.' }, 405)
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return json({ error: 'Não autenticado.' }, 401)
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false }
    })

    const body = await req.json().catch(() => ({}))
    const applicationId = body.applicationId
    if (!applicationId) {
      return json({ error: 'applicationId é obrigatório.' }, 422)
    }

    const { data: app, error: appError } = await supabase
      .from('employee_applications')
      .select('protocol_number')
      .eq('id', applicationId)
      .single()

    if (appError || !app) {
      return json({ error: 'Cadastro não encontrado.' }, 404)
    }

    const { data: dp, error: dpError } = await supabase
      .from('dp_internal_data')
      .select('*')
      .eq('application_id', applicationId)
      .maybeSingle()

    if (dpError || !dp) {
      return json({ error: 'Dados internos não encontrados para este cadastro.' }, 404)
    }

    if (!SHEETS_WEBHOOK_URL) {
      return json({ ok: true, skipped: true })
    }

    const firstHop = await fetch(SHEETS_WEBHOOK_URL, {
      method: 'POST',
      redirect: 'manual',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: SHEETS_WEBHOOK_SECRET,
        action: 'updateInternalData',
        protocolNumber: app.protocol_number,
        jobFunction: dp.job_function ?? '',
        contractType: dp.contract_type ?? '',
        workSchedule: dp.work_schedule ?? '',
        transportVoucherSchedule: dp.transport_voucher_schedule ?? '',
        admissionDate: formatDateForSheet(dp.admission_date),
        firstPeriodDays: dp.first_period_days ?? '',
        secondPeriodDays: dp.second_period_days ?? '',
        isTrustPosition: yesNo(dp.is_trust_position),
        isFirstJob: yesNo(dp.is_first_job),
        notes: dp.notes ?? ''
      })
    })

    const redirectLocation = firstHop.headers.get('location')
    if (redirectLocation) {
      await fetch(redirectLocation)
    }

    return json({ ok: true })
  } catch (err) {
    console.error('dp-internal-sync error', err)
    return json({ error: 'Erro inesperado ao sincronizar com a planilha.' }, 500)
  }
})
