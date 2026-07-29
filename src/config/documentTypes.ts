export interface DocumentTypeConfig {
  value: string
  label: string
  required: boolean
  helpText?: string
  acceptedMimeTypes: string[]
  maxSizeMb: number
}

// Lista inicial dos documentos solicitados no cadastro.
// Pode ser ajustada livremente pelo Departamento Pessoal sem alterar o
// restante da aplicação — este é o único lugar que precisa mudar.
export const documentTypes: DocumentTypeConfig[] = [
  {
    value: 'rg_cpf',
    label: 'RG e CPF (frente e verso)',
    required: true,
    helpText: 'Envie uma foto de cada lado (use "+ Adicionar mais um arquivo") ou um PDF único.',
    acceptedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSizeMb: 10
  },
  {
    value: 'proof_of_address',
    label: 'Comprovante de residência',
    required: true,
    helpText: 'Conta de luz, água ou telefone dos últimos 3 meses.',
    acceptedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSizeMb: 10
  },
  {
    value: 'work_card',
    label: 'Carteira de Trabalho (CTPS)',
    required: false,
    helpText: 'Página com foto e página de qualificação civil.',
    acceptedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSizeMb: 10
  },
  {
    value: 'voter_title',
    label: 'Título de eleitor',
    required: false,
    acceptedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSizeMb: 10
  },
  {
    value: 'school_certificate',
    label: 'Comprovante de escolaridade',
    required: false,
    acceptedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSizeMb: 10
  },
  {
    value: 'photo_3x4',
    label: 'Foto 3x4',
    required: false,
    acceptedMimeTypes: ['image/jpeg', 'image/png'],
    maxSizeMb: 5
  }
]
