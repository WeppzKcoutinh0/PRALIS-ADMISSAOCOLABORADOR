import type { FormFieldOption } from '@/types/form'

// Todas as listas de opcoes usadas nos formularios ficam centralizadas aqui.
// Isso evita espalhar valores "magicos" pelos componentes e facilita ajustar
// rotulos/codigos para bater com o padrao exigido pela contabilidade e pelo
// Questor X-Zen, sem precisar mexer na interface.

export const stateOptions: FormFieldOption[] = [
  { label: 'Acre', value: 'AC' },
  { label: 'Alagoas', value: 'AL' },
  { label: 'Amapá', value: 'AP' },
  { label: 'Amazonas', value: 'AM' },
  { label: 'Bahia', value: 'BA' },
  { label: 'Ceará', value: 'CE' },
  { label: 'Distrito Federal', value: 'DF' },
  { label: 'Espírito Santo', value: 'ES' },
  { label: 'Goiás', value: 'GO' },
  { label: 'Maranhão', value: 'MA' },
  { label: 'Mato Grosso', value: 'MT' },
  { label: 'Mato Grosso do Sul', value: 'MS' },
  { label: 'Minas Gerais', value: 'MG' },
  { label: 'Pará', value: 'PA' },
  { label: 'Paraíba', value: 'PB' },
  { label: 'Paraná', value: 'PR' },
  { label: 'Pernambuco', value: 'PE' },
  { label: 'Piauí', value: 'PI' },
  { label: 'Rio de Janeiro', value: 'RJ' },
  { label: 'Rio Grande do Norte', value: 'RN' },
  { label: 'Rio Grande do Sul', value: 'RS' },
  { label: 'Rondônia', value: 'RO' },
  { label: 'Roraima', value: 'RR' },
  { label: 'Santa Catarina', value: 'SC' },
  { label: 'São Paulo', value: 'SP' },
  { label: 'Sergipe', value: 'SE' },
  { label: 'Tocantins', value: 'TO' }
]

export const sexOptions: FormFieldOption[] = [
  { label: 'Masculino', value: 'male' },
  { label: 'Feminino', value: 'female' }
]

export const raceColorOptions: FormFieldOption[] = [
  { label: 'Branca', value: 'white' },
  { label: 'Preta', value: 'black' },
  { label: 'Parda', value: 'brown' },
  { label: 'Amarela', value: 'yellow' },
  { label: 'Indígena', value: 'indigenous' },
  { label: 'Não informada', value: 'not_informed' }
]

export const maritalStatusOptions: FormFieldOption[] = [
  { label: 'Solteiro(a)', value: 'single' },
  { label: 'Casado(a)', value: 'married' },
  { label: 'Divorciado(a)', value: 'divorced' },
  { label: 'Separado(a)', value: 'separated' },
  { label: 'Viúvo(a)', value: 'widowed' },
  { label: 'União estável', value: 'domestic_partnership' }
]

export const educationLevelOptions: FormFieldOption[] = [
  { label: 'Analfabeto', value: 'illiterate' },
  { label: 'Ensino Fundamental Incompleto', value: 'elementary_incomplete' },
  { label: 'Ensino Fundamental Completo', value: 'elementary_complete' },
  { label: 'Ensino Médio Incompleto', value: 'high_school_incomplete' },
  { label: 'Ensino Médio Completo', value: 'high_school_complete' },
  { label: 'Ensino Superior Incompleto', value: 'higher_education_incomplete' },
  { label: 'Ensino Superior Completo', value: 'higher_education_complete' },
  { label: 'Pós-graduação', value: 'postgraduate' },
  { label: 'Mestrado', value: 'masters' },
  { label: 'Doutorado', value: 'doctorate' }
]

export const contractTypeOptions: FormFieldOption[] = [
  { label: 'Prazo indeterminado', value: 'indefinite' },
  { label: 'Prazo determinado', value: 'fixed_term' },
  { label: 'Experiência', value: 'probation' },
  { label: 'Temporário', value: 'temporary' },
  { label: 'Aprendiz', value: 'apprentice' }
]

export const yesNoOptions: { label: string; value: boolean }[] = [
  { label: 'Sim', value: true },
  { label: 'Não', value: false }
]

export function findOptionLabel(options: FormFieldOption[], value: string | null | undefined): string {
  if (!value) return '—'
  return options.find((option) => option.value === value)?.label ?? value
}
