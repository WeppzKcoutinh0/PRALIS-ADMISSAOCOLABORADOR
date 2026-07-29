import type { FormFieldConfig } from '@/types/form'
import { contractTypeOptions } from '@/config/options'

// Os 9 campos internos que o Departamento Pessoal preenche apos o envio do
// colaborador. Todos sao obrigatorios para liberar o status
// "Pronto para contabilidade".
export const dpInternalFields: FormFieldConfig[] = [
  {
    id: 'job-function',
    name: 'jobFunction',
    label: 'Função',
    type: 'text',
    required: true,
    placeholder: 'Ex: Padeiro, Atendente, Auxiliar de produção',
    section: 'personal',
    validation: { maxLength: 120 }
  },
  {
    id: 'contract-type',
    name: 'contractType',
    label: 'Tipo de contrato',
    type: 'select',
    required: true,
    options: contractTypeOptions,
    section: 'personal'
  },
  {
    id: 'work-schedule',
    name: 'workSchedule',
    label: 'Escala de trabalho',
    type: 'text',
    required: true,
    placeholder: 'Ex: 6x1, 5x2, 12x36',
    helpText: 'Descreva a escala combinada com o colaborador.',
    section: 'personal',
    validation: { maxLength: 120 }
  },
  {
    id: 'transport-voucher-schedule',
    name: 'transportVoucherSchedule',
    label: 'Escala de VT',
    type: 'text',
    required: true,
    helpText: 'Escala usada para cálculo/concessão do vale-transporte. Pode ser igual ou diferente da escala de trabalho.',
    section: 'personal',
    validation: { maxLength: 120 }
  },
  {
    id: 'admission-date',
    name: 'admissionDate',
    label: 'Data de admissão',
    type: 'date',
    required: true,
    mask: 'date',
    section: 'personal'
  },
  {
    id: 'first-period-days',
    name: 'firstPeriodDays',
    label: 'Dias do 1º período',
    type: 'number',
    required: true,
    helpText: 'Refere-se ao primeiro período contratual ou de experiência.',
    section: 'personal',
    validation: { pattern: '^[0-9]+$' }
  },
  {
    id: 'second-period-days',
    name: 'secondPeriodDays',
    label: 'Dias do 2º período',
    type: 'number',
    required: true,
    helpText: 'Refere-se ao segundo período contratual ou de experiência.',
    section: 'personal',
    validation: { pattern: '^[0-9]+$' }
  },
  {
    id: 'is-trust-position',
    name: 'isTrustPosition',
    label: 'Cargo de confiança?',
    type: 'radio',
    required: true,
    options: [
      { label: 'Sim', value: 'true' },
      { label: 'Não', value: 'false' }
    ],
    section: 'personal'
  },
  {
    id: 'is-first-job',
    name: 'isFirstJob',
    label: 'Primeiro emprego?',
    type: 'radio',
    required: true,
    options: [
      { label: 'Sim', value: 'true' },
      { label: 'Não', value: 'false' }
    ],
    section: 'personal'
  }
]
