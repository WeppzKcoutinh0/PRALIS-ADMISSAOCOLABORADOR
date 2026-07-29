import type { Database } from '@/services/supabase/databaseTypes'
import type { EmployeeApplication } from '@/types/employee'
import type { ApplicationStatus } from '@/types/status'
import type { DpInternalData } from '@/types/dp'

type AppRow = Database['public']['Tables']['employee_applications']['Row']
type AddressRow = Database['public']['Tables']['employee_addresses']['Row']
type DpRow = Database['public']['Tables']['dp_internal_data']['Row']

export function mapApplicationRow(app: AppRow, address: AddressRow | null): EmployeeApplication {
  return {
    id: app.id,
    protocolNumber: app.protocol_number,
    status: app.status as ApplicationStatus,
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
    fatherName: app.father_name,
    privacyAccepted: Boolean(app.privacy_accepted_at),
    submittedAt: app.submitted_at,
    assignedTo: app.assigned_to,
    createdAt: app.created_at,
    updatedAt: app.updated_at,
    completedAt: app.completed_at
  }
}

export function mapDpRow(row: DpRow | null): DpInternalData {
  if (!row) {
    return {
      jobFunction: '',
      contractType: '',
      workSchedule: '',
      transportVoucherSchedule: '',
      admissionDate: '',
      firstPeriodDays: null,
      secondPeriodDays: null,
      isTrustPosition: null,
      isFirstJob: null,
      notes: ''
    }
  }
  return {
    jobFunction: row.job_function ?? '',
    contractType: row.contract_type ?? '',
    workSchedule: row.work_schedule ?? '',
    transportVoucherSchedule: row.transport_voucher_schedule ?? '',
    admissionDate: row.admission_date ?? '',
    firstPeriodDays: row.first_period_days,
    secondPeriodDays: row.second_period_days,
    isTrustPosition: row.is_trust_position,
    isFirstJob: row.is_first_job,
    notes: row.notes ?? ''
  }
}

export function maskCpf(cpf: string): string {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11) return cpf
  return `${digits.slice(0, 3)}.***.***-${digits.slice(9, 11)}`
}
