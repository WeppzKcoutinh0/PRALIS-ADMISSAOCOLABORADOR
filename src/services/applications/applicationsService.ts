import { supabase } from '@/services/supabase/client'
import { mapApplicationRow, mapDpRow } from './mappers'
import type { EmployeeApplication } from '@/types/employee'
import type { DpInternalData } from '@/types/dp'
import type { ApplicationStatus } from '@/types/status'

export interface ApplicationListFilters {
  search?: string
  status?: ApplicationStatus | 'all'
  dateFrom?: string
  dateTo?: string
  page: number
  pageSize: number
  sortBy?: 'created_at' | 'submitted_at' | 'full_name'
  sortDirection?: 'asc' | 'desc'
}

export interface ApplicationListItem {
  id: string
  protocolNumber: string
  fullName: string
  cpf: string
  status: ApplicationStatus
  submittedAt: string | null
  assignedTo: string | null
  updatedAt: string
  internalDataPending: boolean
}

function isInternalDataPending(row: { dp_internal_data: unknown }): boolean {
  const dp = row.dp_internal_data as { completed_at: string | null } | { completed_at: string | null }[] | null
  const record = Array.isArray(dp) ? dp[0] : dp
  return !record?.completed_at
}

export async function listApplications(filters: ApplicationListFilters) {
  const { search, status, dateFrom, dateTo, page, pageSize, sortBy = 'created_at', sortDirection = 'desc' } = filters

  let query = supabase
    .from('employee_applications')
    .select(
      'id, protocol_number, full_name, cpf, status, submitted_at, assigned_to, updated_at, dp_internal_data(completed_at)',
      { count: 'exact' }
    )
    .neq('status', 'draft')

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }
  if (search) {
    const digits = search.replace(/\D/g, '')
    if (digits.length >= 3) {
      query = query.ilike('cpf', `%${digits}%`)
    } else {
      query = query.ilike('full_name', `%${search}%`)
    }
  }
  if (dateFrom) query = query.gte('submitted_at', dateFrom)
  if (dateTo) query = query.lte('submitted_at', dateTo)

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .order(sortBy, { ascending: sortDirection === 'asc' })
    .range(from, to)

  if (error) throw error

  const items: ApplicationListItem[] = (data ?? []).map((row) => ({
    id: row.id,
    protocolNumber: row.protocol_number,
    fullName: row.full_name,
    cpf: row.cpf,
    status: row.status as ApplicationStatus,
    submittedAt: row.submitted_at,
    assignedTo: row.assigned_to,
    updatedAt: row.updated_at,
    internalDataPending: isInternalDataPending(row)
  }))

  return { items, total: count ?? 0 }
}

export async function getApplicationById(id: string): Promise<{
  application: EmployeeApplication
  dpData: DpInternalData
  internalDataPending: boolean
}> {
  const { data: app, error: appError } = await supabase
    .from('employee_applications')
    .select('*')
    .eq('id', id)
    .single()
  if (appError) throw appError

  const { data: address } = await supabase
    .from('employee_addresses')
    .select('*')
    .eq('application_id', id)
    .maybeSingle()

  const { data: dp } = await supabase
    .from('dp_internal_data')
    .select('*')
    .eq('application_id', id)
    .maybeSingle()

  return {
    internalDataPending: !dp?.completed_at,
    application: mapApplicationRow(app, address ?? null),
    dpData: mapDpRow(dp ?? null)
  }
}

export async function saveDpInternalData(applicationId: string, data: DpInternalData, userId: string) {
  const { error } = await supabase.from('dp_internal_data').upsert(
    {
      application_id: applicationId,
      job_function: data.jobFunction || null,
      contract_type: data.contractType || null,
      work_schedule: data.workSchedule || null,
      transport_voucher_schedule: data.transportVoucherSchedule || null,
      admission_date: data.admissionDate || null,
      first_period_days: data.firstPeriodDays,
      second_period_days: data.secondPeriodDays,
      is_trust_position: data.isTrustPosition,
      is_first_job: data.isFirstJob,
      notes: data.notes || null,
      completed_by: userId,
      updated_at: new Date().toISOString()
    },
    { onConflict: 'application_id' }
  )
  if (error) throw error
}

export async function markDpDataCompleted(applicationId: string, userId: string) {
  const { error } = await supabase
    .from('dp_internal_data')
    .update({ completed_by: userId, completed_at: new Date().toISOString() })
    .eq('application_id', applicationId)
  if (error) throw error
}

export async function changeApplicationStatus(
  applicationId: string,
  newStatus: ApplicationStatus,
  previousStatus: ApplicationStatus,
  userId: string,
  reason?: string
) {
  const { error } = await supabase
    .from('employee_applications')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', applicationId)
  if (error) throw error

  await supabase.from('application_status_history').insert({
    application_id: applicationId,
    previous_status: previousStatus,
    new_status: newStatus,
    changed_by: userId,
    change_reason: reason ?? null
  })
}

export async function countByStatuses(statuses: ApplicationStatus[]): Promise<number> {
  const { count, error } = await supabase
    .from('employee_applications')
    .select('id', { count: 'exact', head: true })
    .in('status', statuses)
  if (error) throw error
  return count ?? 0
}

export async function assignApplication(applicationId: string, userId: string) {
  const { error } = await supabase
    .from('employee_applications')
    .update({ assigned_to: userId, updated_at: new Date().toISOString() })
    .eq('id', applicationId)
  if (error) throw error
}

export interface DailySubmissionCount {
  date: string
  count: number
}

export async function getSubmissionsByDay(days: number): Promise<DailySubmissionCount[]> {
  const since = new Date()
  since.setHours(0, 0, 0, 0)
  since.setDate(since.getDate() - (days - 1))

  const { data, error } = await supabase
    .from('employee_applications')
    .select('submitted_at')
    .neq('status', 'draft')
    .gte('submitted_at', since.toISOString())
  if (error) throw error

  const counts = new Map<string, number>()
  for (let i = 0; i < days; i++) {
    const day = new Date(since)
    day.setDate(day.getDate() + i)
    counts.set(day.toISOString().slice(0, 10), 0)
  }

  for (const row of data ?? []) {
    if (!row.submitted_at) continue
    const key = row.submitted_at.slice(0, 10)
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return Array.from(counts.entries()).map(([date, count]) => ({ date, count }))
}
