import { onlyDigits } from './masks'

export function isRequiredFilled(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (typeof value === 'boolean') return true
  return true
}

export function isValidCpf(rawCpf: string): boolean {
  const cpf = onlyDigits(rawCpf)
  if (cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false

  const calcCheckDigit = (base: string): number => {
    let sum = 0
    let weight = base.length + 1
    for (const char of base) {
      sum += Number(char) * weight
      weight -= 1
    }
    const remainder = sum % 11
    return remainder < 2 ? 0 : 11 - remainder
  }

  const digit1 = calcCheckDigit(cpf.slice(0, 9))
  const digit2 = calcCheckDigit(cpf.slice(0, 9) + digit1)

  return cpf === cpf.slice(0, 9) + String(digit1) + String(digit2)
}

export function isValidEmail(email: string): boolean {
  if (!email) return true // opcional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function isValidCep(cep: string): boolean {
  return onlyDigits(cep).length === 8
}

export function isValidMobilePhone(phone: string): boolean {
  if (!phone) return true // opcional
  const digits = onlyDigits(phone)
  return digits.length === 10 || digits.length === 11
}

export function isNotFutureDate(isoDate: string): boolean {
  if (!isoDate) return true
  const date = new Date(`${isoDate}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date.getTime() <= today.getTime()
}

export function isAfterOrEqualDate(isoDate: string, referenceIsoDate: string): boolean {
  if (!isoDate || !referenceIsoDate) return true
  return new Date(isoDate).getTime() >= new Date(referenceIsoDate).getTime()
}

export function isPlausibleBirthDate(isoDate: string): boolean {
  if (!isoDate) return false
  const date = new Date(`${isoDate}T00:00:00`)
  const minYear = new Date().getFullYear() - 120
  return date.getFullYear() >= minYear && isNotFutureDate(isoDate)
}

export function collapseSpaces(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}
