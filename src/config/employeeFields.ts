import type { FormFieldConfig } from '@/types/form'
import {
  stateOptions,
  sexOptions,
  raceColorOptions,
  maritalStatusOptions,
  educationLevelOptions
} from '@/config/options'

// Configuracao oficial dos campos do cadastro do colaborador.
// Fonte da verdade para labels, obrigatoriedade, mascaras e agrupamento.
export const employeeFormFields: FormFieldConfig[] = [
  {
    id: 'full-name',
    name: 'fullName',
    label: 'Nome completo',
    type: 'text',
    required: true,
    placeholder: 'Digite seu nome completo',
    autocomplete: 'name',
    section: 'identification',
    validation: { minLength: 3, maxLength: 150 }
  },
  {
    id: 'cpf',
    name: 'cpf',
    label: 'CPF',
    type: 'text',
    required: true,
    placeholder: '000.000.000-00',
    mask: 'cpf',
    section: 'identification',
    validation: { customValidator: 'cpf' }
  },
  {
    id: 'birth-date',
    name: 'birthDate',
    label: 'Data de nascimento',
    type: 'date',
    required: true,
    mask: 'date',
    section: 'identification'
  },
  {
    id: 'rg-issue-date',
    name: 'rgIssueDate',
    label: 'Data de emissão do RG',
    type: 'date',
    required: false,
    mask: 'date',
    helpText: 'Opcional. Preencha se tiver essa informação em mãos.',
    section: 'identification'
  },
  {
    id: 'postal-code',
    name: 'postalCode',
    label: 'CEP',
    type: 'text',
    required: true,
    placeholder: '00000-000',
    mask: 'cep',
    autocomplete: 'postal-code',
    section: 'address'
  },
  {
    id: 'street',
    name: 'street',
    label: 'Endereço',
    type: 'text',
    required: true,
    autocomplete: 'street-address',
    section: 'address',
    validation: { maxLength: 200 }
  },
  {
    id: 'address-number',
    name: 'addressNumber',
    label: 'Número',
    type: 'text',
    required: true,
    placeholder: 'Ex: 123 ou S/N',
    section: 'address',
    validation: { maxLength: 20 }
  },
  {
    id: 'address-complement',
    name: 'addressComplement',
    label: 'Complemento',
    type: 'text',
    required: false,
    placeholder: 'Apto, bloco, casa, referência...',
    section: 'address',
    validation: { maxLength: 120 }
  },
  {
    id: 'district',
    name: 'district',
    label: 'Bairro',
    type: 'text',
    required: false,
    section: 'address',
    validation: { maxLength: 120 }
  },
  {
    id: 'city',
    name: 'city',
    label: 'Cidade',
    type: 'text',
    required: false,
    autocomplete: 'address-level2',
    section: 'address',
    validation: { maxLength: 120 }
  },
  {
    id: 'state',
    name: 'state',
    label: 'Estado',
    type: 'select',
    required: true,
    autocomplete: 'address-level1',
    options: stateOptions,
    section: 'address'
  },
  {
    id: 'sex',
    name: 'sex',
    label: 'Sexo',
    type: 'select',
    required: true,
    options: sexOptions,
    section: 'personal'
  },
  {
    id: 'race-color',
    name: 'raceColor',
    label: 'Raça/Cor',
    type: 'select',
    required: true,
    options: raceColorOptions,
    section: 'personal'
  },
  {
    id: 'marital-status',
    name: 'maritalStatus',
    label: 'Estado civil',
    type: 'select',
    required: true,
    options: maritalStatusOptions,
    section: 'personal'
  },
  {
    id: 'education-level',
    name: 'educationLevel',
    label: 'Grau de instrução',
    type: 'select',
    required: true,
    options: educationLevelOptions,
    section: 'personal'
  },
  {
    id: 'birthplace',
    name: 'birthplace',
    label: 'Naturalidade',
    type: 'select',
    required: true,
    helpText: 'Estado onde você nasceu.',
    options: stateOptions,
    section: 'personal'
  },
  {
    id: 'nationality',
    name: 'nationality',
    label: 'Nacionalidade',
    type: 'text',
    required: true,
    placeholder: 'Brasileira',
    section: 'personal',
    validation: { maxLength: 80 }
  },
  {
    id: 'mobile-phone',
    name: 'mobilePhone',
    label: 'Celular',
    type: 'tel',
    required: false,
    placeholder: '(00) 00000-0000',
    mask: 'phone',
    autocomplete: 'tel',
    section: 'contact'
  },
  {
    id: 'email',
    name: 'email',
    label: 'E-mail',
    type: 'email',
    required: false,
    placeholder: 'nome@exemplo.com',
    autocomplete: 'email',
    section: 'contact'
  },
  {
    id: 'mother-name',
    name: 'motherName',
    label: 'Nome da mãe',
    type: 'text',
    required: true,
    section: 'parents',
    validation: { minLength: 3, maxLength: 150 }
  },
  {
    id: 'father-name',
    name: 'fatherName',
    label: 'Nome do pai',
    type: 'text',
    required: false,
    section: 'parents',
    validation: { maxLength: 150 }
  }
]

export function getFieldConfig(name: string): FormFieldConfig {
  const field = employeeFormFields.find((item) => item.name === name)
  if (!field) {
    throw new Error(`Campo de configuração não encontrado: ${name}`)
  }
  return field
}
