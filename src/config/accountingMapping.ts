import type { AccountingFieldMapping } from '@/types/accounting'

// Camada de mapeamento entre os dados coletados e a ficha exibida para a
// contabilidade / Questor X-Zen. Mantida separada da interface para que a
// ordem e os rotulos possam ser ajustados sem tocar nos componentes.
export const accountingFieldMapping: AccountingFieldMapping[] = [
  { key: 'full_name', label: 'NOME', source: 'employee', sourceField: 'fullName', order: 1, required: true },
  { key: 'cpf', label: 'CPF', source: 'employee', sourceField: 'cpf', formatter: 'cpf', order: 2, required: true },
  { key: 'birth_date', label: 'DATA DE NASCIMENTO', source: 'employee', sourceField: 'birthDate', formatter: 'date', order: 3, required: true },
  { key: 'rg_issue_date', label: 'DATA DE EMISSÃO DO RG', source: 'employee', sourceField: 'rgIssueDate', formatter: 'date', order: 4, required: false },
  { key: 'postal_code', label: 'CEP', source: 'address', sourceField: 'postalCode', formatter: 'cep', order: 5, required: true },
  { key: 'street', label: 'ENDEREÇO', source: 'address', sourceField: 'street', order: 6, required: true },
  { key: 'address_number', label: 'NÚMERO', source: 'address', sourceField: 'addressNumber', order: 7, required: true },
  { key: 'address_complement', label: 'COMPLEMENTO', source: 'address', sourceField: 'addressComplement', order: 8, required: false },
  { key: 'district', label: 'BAIRRO', source: 'address', sourceField: 'district', order: 9, required: false },
  { key: 'city', label: 'CIDADE', source: 'address', sourceField: 'city', order: 10, required: false },
  { key: 'state', label: 'ESTADO', source: 'address', sourceField: 'state', order: 11, required: true },
  { key: 'sex', label: 'SEXO', source: 'employee', sourceField: 'sex', formatter: 'select-label', order: 12, required: true },
  { key: 'race_color', label: 'RAÇA/COR', source: 'employee', sourceField: 'raceColor', formatter: 'select-label', order: 13, required: true },
  { key: 'marital_status', label: 'ESTADO CIVIL', source: 'employee', sourceField: 'maritalStatus', formatter: 'select-label', order: 14, required: true },
  { key: 'education_level', label: 'GRAU DE INSTRUÇÃO', source: 'employee', sourceField: 'educationLevel', formatter: 'select-label', order: 15, required: true },
  { key: 'birthplace', label: 'NATURALIDADE', source: 'employee', sourceField: 'birthplace', formatter: 'select-label', order: 16, required: true },
  { key: 'nationality', label: 'NACIONALIDADE', source: 'employee', sourceField: 'nationality', order: 17, required: true },
  { key: 'mobile_phone', label: 'CELULAR', source: 'employee', sourceField: 'mobilePhone', formatter: 'phone', order: 18, required: false },
  { key: 'email', label: 'E-MAIL', source: 'employee', sourceField: 'email', order: 19, required: false },
  { key: 'mother_name', label: 'NOME DA MÃE', source: 'employee', sourceField: 'motherName', order: 20, required: true },
  { key: 'father_name', label: 'NOME DO PAI', source: 'employee', sourceField: 'fatherName', order: 21, required: false },
  { key: 'job_function', label: 'FUNÇÃO', source: 'dp', sourceField: 'jobFunction', order: 22, required: true },
  { key: 'contract_type', label: 'TIPO DE CONTRATO', source: 'dp', sourceField: 'contractType', formatter: 'select-label', order: 23, required: true },
  { key: 'work_schedule', label: 'ESCALA DE TRABALHO', source: 'dp', sourceField: 'workSchedule', order: 24, required: true },
  { key: 'transport_voucher_schedule', label: 'ESCALA DE VT', source: 'dp', sourceField: 'transportVoucherSchedule', order: 25, required: true },
  { key: 'admission_date', label: 'DATA DE ADMISSÃO', source: 'dp', sourceField: 'admissionDate', formatter: 'date', order: 26, required: true },
  { key: 'first_period_days', label: 'DIAS DO 1º PERÍODO', source: 'dp', sourceField: 'firstPeriodDays', order: 27, required: true },
  { key: 'second_period_days', label: 'DIAS DO 2º PERÍODO', source: 'dp', sourceField: 'secondPeriodDays', order: 28, required: true },
  { key: 'is_trust_position', label: 'CARGO DE CONFIANÇA?', source: 'dp', sourceField: 'isTrustPosition', formatter: 'boolean-yes-no', order: 29, required: true },
  { key: 'is_first_job', label: 'PRIMEIRO EMPREGO?', source: 'dp', sourceField: 'isFirstJob', formatter: 'boolean-yes-no', order: 30, required: true }
]

export const accountingSectionBreaks: { afterOrder: number; heading: string }[] = [
  { afterOrder: 0, heading: 'DADOS DO COLABORADOR' },
  { afterOrder: 21, heading: 'DADOS DO DEPARTAMENTO PESSOAL' }
]
