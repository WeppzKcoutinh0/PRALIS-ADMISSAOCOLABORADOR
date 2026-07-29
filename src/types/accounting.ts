export interface AccountingFieldMapping {
  key: string
  label: string
  source: 'employee' | 'address' | 'dp' | 'computed'
  sourceField: string
  formatter?: 'date' | 'cpf' | 'cep' | 'phone' | 'boolean-yes-no' | 'upper' | 'select-label'
  order: number
  required: boolean
}

export interface AccountingOutput {
  id: string
  applicationId: string
  outputVersion: number
  formattedContent: string
  structuredData: Record<string, string>
  generatedBy: string
  generatedAt: string
  copiedBy: string | null
  copiedAt: string | null
}
