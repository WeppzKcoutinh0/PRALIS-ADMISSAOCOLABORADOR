import { supabase } from '@/services/supabase/client'
import { accountingFieldMapping, accountingSectionBreaks } from '@/config/accountingMapping'
import { findOptionLabel, sexOptions, raceColorOptions, maritalStatusOptions, educationLevelOptions, contractTypeOptions, stateOptions } from '@/config/options'
import { formatDateBr } from '@/utils/formatters'
import { formatCpfDisplay, formatCepDisplay, formatPhoneDisplay } from '@/utils/masks'
import type { EmployeeApplication } from '@/types/employee'
import type { DpInternalData } from '@/types/dp'

const selectLabelSources: Record<string, { label: string; value: string }[]> = {
  sex: sexOptions,
  raceColor: raceColorOptions,
  maritalStatus: maritalStatusOptions,
  educationLevel: educationLevelOptions,
  contractType: contractTypeOptions,
  birthplace: stateOptions
}

function getRawValue(
  sourceField: string,
  source: 'employee' | 'address' | 'dp',
  employee: EmployeeApplication,
  dp: DpInternalData
): unknown {
  if (source === 'dp') {
    return (dp as unknown as Record<string, unknown>)[sourceField]
  }
  return (employee as unknown as Record<string, unknown>)[sourceField]
}

function formatValue(
  value: unknown,
  formatter: string | undefined,
  sourceField: string
): string {
  if (value === null || value === undefined || value === '') return ''

  switch (formatter) {
    case 'date':
      return formatDateBr(String(value))
    case 'cpf':
      return formatCpfDisplay(String(value))
    case 'cep':
      return formatCepDisplay(String(value))
    case 'phone':
      return formatPhoneDisplay(String(value))
    case 'boolean-yes-no':
      return value === true ? 'Sim' : value === false ? 'Não' : ''
    case 'select-label': {
      const options = selectLabelSources[sourceField]
      return options ? findOptionLabel(options, String(value)) : String(value)
    }
    case 'upper':
      return String(value).toUpperCase()
    default:
      return String(value)
  }
}

export interface AccountingRow {
  key: string
  label: string
  value: string
  required: boolean
  missing: boolean
}

export function buildAccountingRows(employee: EmployeeApplication, dp: DpInternalData): AccountingRow[] {
  return [...accountingFieldMapping]
    .sort((a, b) => a.order - b.order)
    .map((mapping) => {
      const raw = getRawValue(mapping.sourceField, mapping.source as 'employee' | 'address' | 'dp', employee, dp)
      const value = formatValue(raw, mapping.formatter, mapping.sourceField)
      return {
        key: mapping.key,
        label: mapping.label,
        value,
        required: mapping.required,
        missing: mapping.required && value === ''
      }
    })
}

export function buildFormattedText(rows: AccountingRow[]): string {
  const lines: string[] = []
  for (const brk of accountingSectionBreaks) {
    const sectionRows = rows.filter((_, index) => {
      const order = index + 1
      const nextBreak = accountingSectionBreaks.find((b) => b.afterOrder > brk.afterOrder)
      const upperBound = nextBreak ? nextBreak.afterOrder : rows.length
      return order > brk.afterOrder && order <= upperBound
    })
    lines.push(brk.heading)
    lines.push('')
    for (const row of sectionRows) {
      lines.push(`${row.label}: ${row.value || '—'}`)
    }
    lines.push('')
  }
  return lines.join('\n').trim()
}

export function hasMissingRequiredFields(rows: AccountingRow[]): boolean {
  return rows.some((row) => row.missing)
}

export async function saveAccountingOutput(
  applicationId: string,
  rows: AccountingRow[],
  formattedContent: string,
  generatedBy: string
) {
  const { data: existing } = await supabase
    .from('accounting_outputs')
    .select('output_version')
    .eq('application_id', applicationId)
    .order('output_version', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextVersion = (existing?.output_version ?? 0) + 1
  const structuredData = Object.fromEntries(rows.map((row) => [row.key, row.value]))

  const { data, error } = await supabase
    .from('accounting_outputs')
    .insert({
      application_id: applicationId,
      output_version: nextVersion,
      formatted_content: formattedContent,
      structured_data: structuredData,
      generated_by: generatedBy
    })
    .select('id')
    .single()

  if (error) throw error
  return data.id as string
}

export async function registerCopy(outputId: string, userId: string) {
  const { error } = await supabase
    .from('accounting_outputs')
    .update({ copied_by: userId, copied_at: new Date().toISOString() })
    .eq('id', outputId)
  if (error) throw error
}
