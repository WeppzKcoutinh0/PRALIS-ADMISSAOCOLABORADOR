// Mascaras de exibicao e normalizacao. Os valores sao sempre armazenados
// sem pontuacao e formatados apenas na exibicao.

export function onlyDigits(value: string): string {
  return (value ?? '').replace(/\D/g, '')
}

export function maskCpfInput(value: string): string {
  const digits = onlyDigits(value).slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function formatCpfDisplay(cpf: string): string {
  const digits = onlyDigits(cpf)
  if (digits.length !== 11) return cpf
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
}

export function maskCepInput(value: string): string {
  const digits = onlyDigits(value).slice(0, 8)
  return digits.replace(/(\d{5})(\d)/, '$1-$2')
}

export function formatCepDisplay(cep: string): string {
  const digits = onlyDigits(cep)
  if (digits.length !== 8) return cep
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`
}

export function maskPhoneInput(value: string): string {
  const digits = onlyDigits(value).slice(0, 11)
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

export function formatPhoneDisplay(phone: string): string {
  return maskPhoneInput(phone)
}

export function maskDateInput(value: string): string {
  const digits = onlyDigits(value).slice(0, 8)
  return digits
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
}

// Converte DD/MM/AAAA (exibicao) para AAAA-MM-DD (armazenamento/input date)
export function brDateToIso(value: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim())
  if (!match) return null
  const [, dd, mm, yyyy] = match
  return `${yyyy}-${mm}-${dd}`
}

// Converte AAAA-MM-DD (armazenamento) para DD/MM/AAAA (exibicao)
export function isoDateToBr(value: string | null | undefined): string {
  if (!value) return ''
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (!match) return value
  const [, yyyy, mm, dd] = match
  return `${dd}/${mm}/${yyyy}`
}
