export interface FormFieldOption {
  label: string
  value: string
}

export interface FormFieldValidation {
  minLength?: number
  maxLength?: number
  pattern?: string
  customValidator?: string
}

export type FormFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'date'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'file'

export interface FormFieldConfig {
  id: string
  name: string
  label: string
  type: FormFieldType
  required: boolean
  placeholder?: string
  helpText?: string
  mask?: 'cpf' | 'cep' | 'phone' | 'date'
  options?: FormFieldOption[]
  validation?: FormFieldValidation
  autocomplete?: string
  section: 'identification' | 'address' | 'personal' | 'contact' | 'parents'
}
