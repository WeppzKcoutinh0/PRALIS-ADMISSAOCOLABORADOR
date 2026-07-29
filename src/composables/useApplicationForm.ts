import { reactive, ref, computed } from 'vue'
import { employeeFormSteps } from '@/config/employeeFormSteps'
import { employeeFormFields, getFieldConfig } from '@/config/employeeFields'
import type { EmployeeApplicationDraft } from '@/types/employee'
import type { EmployeeDocument } from '@/types/documents'
import {
  isValidCpf,
  isValidEmail,
  isValidCep,
  isValidMobilePhone,
  isPlausibleBirthDate,
  isNotFutureDate,
  isAfterOrEqualDate,
  collapseSpaces
} from '@/utils/validators'
import { onlyDigits } from '@/utils/masks'
import {
  getApplicationByToken,
  saveApplicationDraft,
  submitApplication
} from '@/services/publicApplicationService'

function emptyDraft(): EmployeeApplicationDraft {
  return {
    fullName: '',
    cpf: '',
    birthDate: '',
    rgIssueDate: null,
    postalCode: '',
    street: '',
    addressNumber: '',
    addressComplement: null,
    district: null,
    city: null,
    state: '',
    sex: '',
    raceColor: '',
    maritalStatus: '',
    educationLevel: '',
    birthplace: '',
    nationality: 'Brasileira',
    mobilePhone: null,
    email: null,
    motherName: '',
    fatherName: null,
    privacyAccepted: false
  }
}

export function useApplicationForm(token: string) {
  const draft = reactive<EmployeeApplicationDraft>(emptyDraft())
  const errors = reactive<Record<string, string>>({})
  const documents = ref<EmployeeDocument[]>([])
  const status = ref<string>('draft')
  const protocolNumber = ref<string | null>(null)

  const currentStepIndex = ref(0)
  const isLoading = ref(true)
  const isSaving = ref(false)
  const loadError = ref<string | null>(null)
  const submitError = ref<string | null>(null)

  const steps = employeeFormSteps
  const currentStep = computed(() => steps[currentStepIndex.value])
  const progressPercent = computed(() => Math.round(((currentStepIndex.value + 1) / steps.length) * 100))
  const isLastStep = computed(() => currentStepIndex.value === steps.length - 1)
  const isFirstStep = computed(() => currentStepIndex.value === 0)

  async function loadDraft() {
    isLoading.value = true
    loadError.value = null
    try {
      const result = await getApplicationByToken(token)
      Object.assign(draft, emptyDraft(), result.draft)
      status.value = result.status
      protocolNumber.value = result.protocolNumber
      documents.value = result.documents
    } catch (err) {
      loadError.value =
        err instanceof Error
          ? err.message
          : 'Não foi possível carregar seu cadastro. O link pode ter expirado.'
    } finally {
      isLoading.value = false
    }
  }

  function validateField(name: string, value: unknown): string | null {
    const field = getFieldConfig(name)
    const strValue = typeof value === 'string' ? value : value == null ? '' : String(value)

    if (field.required && !strValue.trim()) {
      return `${field.label} é obrigatório.`
    }
    if (!field.required && !strValue.trim()) {
      return null
    }

    if (field.validation?.minLength && strValue.trim().length < field.validation.minLength) {
      return `${field.label} deve ter pelo menos ${field.validation.minLength} caracteres.`
    }
    if (field.validation?.maxLength && strValue.trim().length > field.validation.maxLength) {
      return `${field.label} deve ter no máximo ${field.validation.maxLength} caracteres.`
    }

    switch (name) {
      case 'cpf':
        if (!isValidCpf(strValue)) return 'Digite um CPF válido.'
        break
      case 'birthDate':
        if (!isPlausibleBirthDate(strValue)) return 'Digite uma data de nascimento válida (não pode ser no futuro).'
        break
      case 'rgIssueDate':
        if (strValue) {
          if (!isNotFutureDate(strValue)) return 'A data de emissão do RG não pode ser no futuro.'
          if (draft.birthDate && !isAfterOrEqualDate(strValue, draft.birthDate)) {
            return 'A data de emissão do RG não pode ser anterior ao nascimento.'
          }
        }
        break
      case 'postalCode':
        if (!isValidCep(strValue)) return 'Digite um CEP válido com 8 dígitos.'
        break
      case 'email':
        if (!isValidEmail(strValue)) return 'Digite um e-mail válido.'
        break
      case 'mobilePhone':
        if (!isValidMobilePhone(strValue)) return 'Digite um celular válido com DDD.'
        break
      default:
        break
    }

    return null
  }

  function validateStep(stepId: string): boolean {
    const step = steps.find((s) => s.id === stepId)
    if (!step) return true

    let valid = true
    for (const fieldName of step.fields) {
      const value = (draft as unknown as Record<string, unknown>)[fieldName]
      const error = validateField(fieldName, value)
      if (error) {
        errors[fieldName] = error
        valid = false
      } else {
        delete errors[fieldName]
      }
    }
    return valid
  }

  function validateAll(): boolean {
    let valid = true
    for (const field of employeeFormFields) {
      const value = (draft as unknown as Record<string, unknown>)[field.name]
      const error = validateField(field.name, value)
      if (error) {
        errors[field.name] = error
        valid = false
      } else {
        delete errors[field.name]
      }
    }
    return valid
  }

  function normalizeDraft() {
    draft.fullName = collapseSpaces(draft.fullName)
    draft.motherName = collapseSpaces(draft.motherName)
    if (draft.fatherName) draft.fatherName = collapseSpaces(draft.fatherName)
    draft.cpf = onlyDigits(draft.cpf)
    draft.postalCode = onlyDigits(draft.postalCode)
    if (draft.mobilePhone) draft.mobilePhone = onlyDigits(draft.mobilePhone)
    if (draft.email) draft.email = draft.email.trim().toLowerCase()
  }

  async function persistDraft() {
    isSaving.value = true
    try {
      normalizeDraft()
      await saveApplicationDraft(token, { ...draft })
    } finally {
      isSaving.value = false
    }
  }

  async function goNext() {
    if (!validateStep(currentStep.value.id)) return false
    await persistDraft()
    if (!isLastStep.value) currentStepIndex.value += 1
    return true
  }

  function goBack() {
    if (!isFirstStep.value) currentStepIndex.value -= 1
  }

  function goToStep(index: number) {
    if (index >= 0 && index < steps.length) currentStepIndex.value = index
  }

  async function finalSubmit(): Promise<boolean> {
    submitError.value = null
    if (!validateAll()) {
      submitError.value = 'Existem campos obrigatórios pendentes. Revise as etapas destacadas.'
      return false
    }
    if (!draft.privacyAccepted) {
      submitError.value = 'É necessário aceitar o aviso de privacidade para enviar o cadastro.'
      return false
    }
    try {
      isSaving.value = true
      await persistDraft()
      const result = await submitApplication(token)
      protocolNumber.value = result.protocolNumber
      status.value = 'submitted'
      return true
    } catch (err) {
      submitError.value = err instanceof Error ? err.message : 'Não foi possível enviar o cadastro.'
      return false
    } finally {
      isSaving.value = false
    }
  }

  return {
    draft,
    errors,
    documents,
    status,
    protocolNumber,
    steps,
    currentStepIndex,
    currentStep,
    progressPercent,
    isLastStep,
    isFirstStep,
    isLoading,
    isSaving,
    loadError,
    submitError,
    loadDraft,
    validateField,
    validateStep,
    validateAll,
    goNext,
    goBack,
    goToStep,
    persistDraft,
    finalSubmit
  }
}
