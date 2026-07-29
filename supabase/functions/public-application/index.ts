// Edge Function: public-application
//
// Unico ponto de entrada do fluxo publico (sem autenticacao) do cadastro de
// admissao. Roda com a service_role do Supabase (nunca exposta ao
// navegador) e e responsavel por:
//   - iniciar um cadastro e gerar um token publico de acesso;
//   - validar o token em toda operacao subsequente;
//   - salvar o rascunho preenchido pelo colaborador;
//   - emitir Signed Upload URLs para o bucket privado de documentos;
//   - registrar os documentos enviados;
//   - concluir (submeter) o cadastro, gerando o protocolo.
//
// Nenhuma tabela publica e exposta diretamente ao anon key para este fluxo.
//
// Rotas (relativas a /functions/v1/public-application):
//   POST   /start
//   GET    /:token
//   PATCH  /:token
//   POST   /:token/documents/upload-url
//   POST   /:token/documents
//   DELETE /:token/documents/:documentId
//   POST   /:token/submit

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const BUCKET = 'employee-documents'
const TOKEN_TTL_DAYS = 30
const PRIVACY_NOTICE_VERSION = '2026-01'

// Ajuste para o dominio do seu frontend em producao.
const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') ?? '*'

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS'
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
})

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

function errorResponse(message: string, status = 400): Response {
  return json({ error: message }, status)
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function generateToken(): string {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

interface AppRow {
  id: string
  protocol_number: string
  status: string
  public_token_expires_at: string | null
  full_name: string
  cpf: string
  birth_date: string | null
  rg_issue_date: string | null
  sex: string
  race_color: string
  marital_status: string
  education_level: string
  birthplace: string
  nationality: string
  mobile_phone: string | null
  email: string | null
  mother_name: string
  father_name: string | null
}

async function findApplicationByToken(token: string): Promise<AppRow | null> {
  const tokenHash = await sha256Hex(token)
  const { data, error } = await admin
    .from('employee_applications')
    .select('*')
    .eq('public_token_hash', tokenHash)
    .maybeSingle()

  if (error || !data) return null

  if (data.public_token_expires_at && new Date(data.public_token_expires_at).getTime() < Date.now()) {
    return null
  }

  return data as AppRow
}

function onlyDigits(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\D/g, '') : ''
}

// ---------- handlers ----------

async function handleStart(): Promise<Response> {
  const token = generateToken()
  const tokenHash = await sha256Hex(token)
  const expiresAt = new Date(Date.now() + TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { error } = await admin.from('employee_applications').insert({
    status: 'draft',
    public_token_hash: tokenHash,
    public_token_expires_at: expiresAt,
    nationality: 'Brasileira'
  })

  if (error) {
    console.error('start error', error)
    return errorResponse('Não foi possível iniciar o cadastro. Tente novamente.', 500)
  }

  return json({ token })
}

async function handleGet(token: string): Promise<Response> {
  const app = await findApplicationByToken(token)
  if (!app) return errorResponse('Cadastro não encontrado ou link expirado.', 404)

  const { data: address } = await admin
    .from('employee_addresses')
    .select('*')
    .eq('application_id', app.id)
    .maybeSingle()

  const { data: documents } = await admin
    .from('employee_documents')
    .select('*')
    .eq('application_id', app.id)
    .order('uploaded_at', { ascending: true })

  const draft = {
    fullName: app.full_name,
    cpf: app.cpf,
    birthDate: app.birth_date,
    rgIssueDate: app.rg_issue_date,
    postalCode: address?.postal_code ?? '',
    street: address?.street ?? '',
    addressNumber: address?.address_number ?? '',
    addressComplement: address?.complement ?? null,
    district: address?.district ?? null,
    city: address?.city ?? null,
    state: address?.state ?? '',
    sex: app.sex,
    raceColor: app.race_color,
    maritalStatus: app.marital_status,
    educationLevel: app.education_level,
    birthplace: app.birthplace,
    nationality: app.nationality,
    mobilePhone: app.mobile_phone,
    email: app.email,
    motherName: app.mother_name,
    fatherName: app.father_name
  }

  const mappedDocuments = (documents ?? []).map((d) => ({
    id: d.id,
    applicationId: d.application_id,
    documentType: d.document_type,
    originalFileName: d.original_file_name,
    storagePath: d.storage_path,
    mimeType: d.mime_type,
    fileSize: d.file_size,
    uploadedAt: d.uploaded_at
  }))

  return json({
    draft,
    status: app.status,
    protocolNumber: app.status === 'draft' ? null : app.protocol_number,
    documents: mappedDocuments
  })
}

async function handlePatch(token: string, req: Request): Promise<Response> {
  const app = await findApplicationByToken(token)
  if (!app) return errorResponse('Cadastro não encontrado ou link expirado.', 404)
  if (app.status !== 'draft') {
    return errorResponse('Este cadastro já foi enviado e não pode mais ser editado por aqui.', 409)
  }

  const body = await req.json().catch(() => ({}))

  const appPatch: Record<string, unknown> = {}
  if ('fullName' in body) appPatch.full_name = String(body.fullName ?? '').trim()
  if ('cpf' in body) appPatch.cpf = onlyDigits(body.cpf)
  if ('birthDate' in body) appPatch.birth_date = body.birthDate || null
  if ('rgIssueDate' in body) appPatch.rg_issue_date = body.rgIssueDate || null
  if ('sex' in body) appPatch.sex = body.sex ?? ''
  if ('raceColor' in body) appPatch.race_color = body.raceColor ?? ''
  if ('maritalStatus' in body) appPatch.marital_status = body.maritalStatus ?? ''
  if ('educationLevel' in body) appPatch.education_level = body.educationLevel ?? ''
  if ('birthplace' in body) appPatch.birthplace = body.birthplace ?? ''
  if ('nationality' in body) appPatch.nationality = body.nationality ?? ''
  if ('mobilePhone' in body) appPatch.mobile_phone = body.mobilePhone ? onlyDigits(body.mobilePhone) : null
  if ('email' in body) appPatch.email = body.email ? String(body.email).trim().toLowerCase() : null
  if ('motherName' in body) appPatch.mother_name = String(body.motherName ?? '').trim()
  if ('fatherName' in body) appPatch.father_name = body.fatherName ? String(body.fatherName).trim() : null
  if (body.privacyAccepted === true) {
    appPatch.privacy_accepted_at = new Date().toISOString()
    appPatch.privacy_notice_version = PRIVACY_NOTICE_VERSION
  }

  if (Object.keys(appPatch).length > 0) {
    const { error } = await admin.from('employee_applications').update(appPatch).eq('id', app.id)
    if (error) {
      if (error.code === '23505') {
        return errorResponse(
          'Já existe um cadastro em andamento ou concluído com este CPF. Entre em contato com o Departamento Pessoal.',
          409
        )
      }
      console.error('patch application error', error)
      return errorResponse('Não foi possível salvar seus dados. Tente novamente.', 500)
    }
  }

  const hasAddressFields = ['postalCode', 'street', 'addressNumber', 'addressComplement', 'district', 'city', 'state'].some(
    (key) => key in body
  )

  if (hasAddressFields) {
    const addressPatch: Record<string, unknown> = { application_id: app.id }
    if ('postalCode' in body) addressPatch.postal_code = onlyDigits(body.postalCode)
    if ('street' in body) addressPatch.street = body.street ?? ''
    if ('addressNumber' in body) addressPatch.address_number = body.addressNumber ?? ''
    if ('addressComplement' in body) addressPatch.complement = body.addressComplement || null
    if ('district' in body) addressPatch.district = body.district || null
    if ('city' in body) addressPatch.city = body.city || null
    if ('state' in body) addressPatch.state = body.state || null

    const { error } = await admin
      .from('employee_addresses')
      .upsert(addressPatch, { onConflict: 'application_id' })
    if (error) {
      console.error('patch address error', error)
      return errorResponse('Não foi possível salvar seu endereço. Tente novamente.', 500)
    }
  }

  return json({ ok: true })
}

async function handleUploadUrl(token: string, req: Request): Promise<Response> {
  const app = await findApplicationByToken(token)
  if (!app) return errorResponse('Cadastro não encontrado ou link expirado.', 404)
  if (app.status !== 'draft') {
    return errorResponse('Este cadastro já foi enviado. Não é mais possível anexar documentos.', 409)
  }

  const body = await req.json().catch(() => ({}))
  const documentType = String(body.documentType ?? '')
  const fileName = String(body.fileName ?? 'documento')
  if (!documentType) return errorResponse('Tipo de documento não informado.', 422)

  const extension = fileName.includes('.') ? fileName.split('.').pop() : 'bin'
  const path = `${app.id}/${documentType}/${crypto.randomUUID()}.${extension}`

  const { data, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(path)
  if (error || !data) {
    console.error('signed upload url error', error)
    return errorResponse('Não foi possível preparar o envio do arquivo. Tente novamente.', 500)
  }

  return json({ signedUrl: data.signedUrl, path: data.path, storageToken: data.token })
}

async function handleRegisterDocument(token: string, req: Request): Promise<Response> {
  const app = await findApplicationByToken(token)
  if (!app) return errorResponse('Cadastro não encontrado ou link expirado.', 404)
  if (app.status !== 'draft') {
    return errorResponse('Este cadastro já foi enviado.', 409)
  }

  const body = await req.json().catch(() => ({}))
  const { documentType, originalFileName, storagePath, mimeType, fileSize } = body

  if (!documentType || !storagePath || !mimeType || !fileSize) {
    return errorResponse('Dados do documento incompletos.', 422)
  }

  const { data, error } = await admin
    .from('employee_documents')
    .insert({
      application_id: app.id,
      document_type: documentType,
      original_file_name: originalFileName ?? 'documento',
      storage_path: storagePath,
      mime_type: mimeType,
      file_size: fileSize
    })
    .select('*')
    .single()

  if (error) {
    console.error('register document error', error)
    return errorResponse('Não foi possível registrar o documento enviado.', 500)
  }

  return json({
    document: {
      id: data.id,
      applicationId: data.application_id,
      documentType: data.document_type,
      originalFileName: data.original_file_name,
      storagePath: data.storage_path,
      mimeType: data.mime_type,
      fileSize: data.file_size,
      uploadedAt: data.uploaded_at
    }
  })
}

async function handleDeleteDocument(token: string, documentId: string): Promise<Response> {
  const app = await findApplicationByToken(token)
  if (!app) return errorResponse('Cadastro não encontrado ou link expirado.', 404)
  if (app.status !== 'draft') {
    return errorResponse('Este cadastro já foi enviado.', 409)
  }

  const { data: doc } = await admin
    .from('employee_documents')
    .select('storage_path, application_id')
    .eq('id', documentId)
    .maybeSingle()

  if (!doc || doc.application_id !== app.id) {
    return errorResponse('Documento não encontrado.', 404)
  }

  await admin.storage.from(BUCKET).remove([doc.storage_path])
  const { error } = await admin.from('employee_documents').delete().eq('id', documentId)
  if (error) {
    console.error('delete document error', error)
    return errorResponse('Não foi possível remover o documento.', 500)
  }

  return json({ ok: true })
}

const REQUIRED_FIELDS = [
  'full_name',
  'cpf',
  'birth_date',
  'sex',
  'race_color',
  'marital_status',
  'education_level',
  'birthplace',
  'nationality',
  'mother_name'
] as const

async function handleSubmit(token: string): Promise<Response> {
  const app = await findApplicationByToken(token)
  if (!app) return errorResponse('Cadastro não encontrado ou link expirado.', 404)
  if (app.status !== 'draft') {
    return json({ protocolNumber: app.protocol_number })
  }

  for (const field of REQUIRED_FIELDS) {
    const value = (app as unknown as Record<string, unknown>)[field]
    if (!value || String(value).trim() === '') {
      return errorResponse('Existem campos obrigatórios pendentes. Volte e revise o formulário.', 422)
    }
  }

  const { data: address } = await admin
    .from('employee_addresses')
    .select('*')
    .eq('application_id', app.id)
    .maybeSingle()

  if (!address || !address.postal_code || !address.street || !address.address_number || !address.state) {
    return errorResponse('O endereço está incompleto. Volte e revise o formulário.', 422)
  }

  const { data: privacyRow } = await admin
    .from('employee_applications')
    .select('privacy_accepted_at')
    .eq('id', app.id)
    .single()

  if (!privacyRow?.privacy_accepted_at) {
    return errorResponse('É necessário aceitar o aviso de privacidade.', 422)
  }

  const { error } = await admin
    .from('employee_applications')
    .update({ status: 'dp_review', submitted_at: new Date().toISOString() })
    .eq('id', app.id)

  if (error) {
    console.error('submit error', error)
    return errorResponse('Não foi possível enviar o cadastro. Tente novamente.', 500)
  }

  await admin.from('application_status_history').insert({
    application_id: app.id,
    previous_status: 'draft',
    new_status: 'dp_review',
    changed_by: null,
    change_reason: 'Enviado pelo colaborador — encaminhado automaticamente para análise do DP'
  })

  return json({ protocolNumber: app.protocol_number })
}

// ---------- router ----------

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const allParts = url.pathname.split('/').filter(Boolean)
  const fnIndex = allParts.indexOf('public-application')
  const parts = fnIndex >= 0 ? allParts.slice(fnIndex + 1) : allParts

  try {
    if (req.method === 'POST' && parts.length === 1 && parts[0] === 'start') {
      return await handleStart()
    }

    if (parts.length === 1) {
      const [token] = parts
      if (req.method === 'GET') return await handleGet(token)
      if (req.method === 'PATCH') return await handlePatch(token, req)
    }

    if (parts.length === 2 && parts[1] === 'submit' && req.method === 'POST') {
      return await handleSubmit(parts[0])
    }

    if (parts.length === 3 && parts[1] === 'documents' && parts[2] === 'upload-url' && req.method === 'POST') {
      return await handleUploadUrl(parts[0], req)
    }

    if (parts.length === 2 && parts[1] === 'documents' && req.method === 'POST') {
      return await handleRegisterDocument(parts[0], req)
    }

    if (parts.length === 3 && parts[1] === 'documents' && req.method === 'DELETE') {
      return await handleDeleteDocument(parts[0], parts[2])
    }

    return errorResponse('Rota não encontrada.', 404)
  } catch (err) {
    console.error('unhandled error', err)
    return errorResponse('Erro inesperado. Tente novamente em instantes.', 500)
  }
})
