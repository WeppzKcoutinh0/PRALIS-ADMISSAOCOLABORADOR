// Define como os campos oficiais (employeeFields.ts) sao organizados nas
// 8 etapas do formulario publico, conforme o fluxo definido para o portal.
// Mantido separado de "section" (usada no mapeamento para a contabilidade)
// para nao acoplar a navegacao da UI ao agrupamento de dados.

export type EmployeeStepId =
  | 'identification'
  | 'personal-documents'
  | 'address'
  | 'personal-info'
  | 'parents'
  | 'contact'
  | 'documents-upload'
  | 'review'

export interface EmployeeFormStep {
  id: EmployeeStepId
  order: number
  title: string
  shortTitle: string
  description: string
  fields: string[]
}

export const employeeFormSteps: EmployeeFormStep[] = [
  {
    id: 'identification',
    order: 1,
    title: 'Identificação',
    shortTitle: 'Identificação',
    description: 'Vamos começar com o seu nome completo.',
    fields: ['fullName']
  },
  {
    id: 'personal-documents',
    order: 2,
    title: 'Documentos pessoais',
    shortTitle: 'Documentos',
    description: 'Informe os dados do seu CPF e RG.',
    fields: ['cpf', 'birthDate', 'rgIssueDate']
  },
  {
    id: 'address',
    order: 3,
    title: 'Endereço',
    shortTitle: 'Endereço',
    description: 'Informe seu CEP para preenchermos o endereço automaticamente.',
    fields: ['postalCode', 'street', 'addressNumber', 'addressComplement', 'district', 'city', 'state']
  },
  {
    id: 'personal-info',
    order: 4,
    title: 'Informações pessoais',
    shortTitle: 'Pessoais',
    description: 'Algumas informações pessoais exigidas no processo de admissão.',
    fields: ['sex', 'raceColor', 'maritalStatus', 'educationLevel', 'birthplace', 'nationality']
  },
  {
    id: 'parents',
    order: 5,
    title: 'Filiação',
    shortTitle: 'Filiação',
    description: 'Nome dos seus pais, conforme documento oficial.',
    fields: ['motherName', 'fatherName']
  },
  {
    id: 'contact',
    order: 6,
    title: 'Contato',
    shortTitle: 'Contato',
    description: 'Para conseguirmos falar com você, se necessário.',
    fields: ['mobilePhone', 'email']
  },
  {
    id: 'documents-upload',
    order: 7,
    title: 'Envio de documentos',
    shortTitle: 'Anexos',
    description: 'Envie fotos ou PDFs legíveis dos documentos solicitados.',
    fields: []
  },
  {
    id: 'review',
    order: 8,
    title: 'Revisão e confirmação',
    shortTitle: 'Revisão',
    description: 'Confira tudo com calma antes de enviar para o Departamento Pessoal.',
    fields: []
  }
]
