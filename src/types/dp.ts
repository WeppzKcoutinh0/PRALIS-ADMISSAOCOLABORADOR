export interface DpInternalData {
  jobFunction: string
  contractType: string
  workSchedule: string
  transportVoucherSchedule: string
  admissionDate: string
  firstPeriodDays: number | null
  secondPeriodDays: number | null
  isTrustPosition: boolean | null
  isFirstJob: boolean | null
  notes?: string | null
}

export function createEmptyDpInternalData(): DpInternalData {
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

export function validateDpInternalData(data: DpInternalData): string[] {
  const errors: string[] = []

  if (!data.jobFunction.trim()) {
    errors.push('A função é obrigatória.')
  }

  if (!data.contractType) {
    errors.push('O tipo de contrato é obrigatório.')
  }

  if (!data.workSchedule.trim()) {
    errors.push('A escala de trabalho é obrigatória.')
  }

  if (!data.transportVoucherSchedule.trim()) {
    errors.push('A escala de VT é obrigatória.')
  }

  if (!data.admissionDate) {
    errors.push('A data de admissão é obrigatória.')
  }

  if (
    data.firstPeriodDays === null ||
    !Number.isInteger(data.firstPeriodDays) ||
    data.firstPeriodDays < 0
  ) {
    errors.push('Os dias do primeiro período são obrigatórios.')
  }

  if (
    data.secondPeriodDays === null ||
    !Number.isInteger(data.secondPeriodDays) ||
    data.secondPeriodDays < 0
  ) {
    errors.push('Os dias do segundo período são obrigatórios.')
  }

  if (data.isTrustPosition === null) {
    errors.push('Informe se é cargo de confiança.')
  }

  if (data.isFirstJob === null) {
    errors.push('Informe se é o primeiro emprego.')
  }

  return errors
}
