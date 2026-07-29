import { ref } from 'vue'
import { onlyDigits } from '@/utils/masks'

interface ViaCepResponse {
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export interface AddressLookupResult {
  street: string
  district: string
  city: string
  state: string
}

const CEP_LOOKUP_URL = (import.meta.env.VITE_CEP_LOOKUP_URL as string | undefined) ?? 'https://viacep.com.br/ws'

export function useAddressLookup() {
  const isLoading = ref(false)
  const notFound = ref(false)
  const errorMessage = ref<string | null>(null)

  async function lookup(cep: string): Promise<AddressLookupResult | null> {
    const digits = onlyDigits(cep)
    notFound.value = false
    errorMessage.value = null

    if (digits.length !== 8) {
      return null
    }

    isLoading.value = true
    try {
      const response = await fetch(`${CEP_LOOKUP_URL}/${digits}/json/`)
      if (!response.ok) {
        throw new Error('Falha na consulta')
      }
      const data = (await response.json()) as ViaCepResponse
      if (data.erro) {
        notFound.value = true
        return null
      }
      return {
        street: data.logradouro ?? '',
        district: data.bairro ?? '',
        city: data.localidade ?? '',
        state: data.uf ?? ''
      }
    } catch (err) {
      errorMessage.value = 'Não foi possível consultar o CEP agora. Você pode preencher o endereço manualmente.'
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, notFound, errorMessage, lookup }
}
