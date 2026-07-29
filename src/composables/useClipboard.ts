import { ref } from 'vue'

export function useClipboard() {
  const copied = ref(false)
  const error = ref<string | null>(null)
  let timeout: ReturnType<typeof setTimeout> | null = null

  async function copy(text: string) {
    error.value = null
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      copied.value = true
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch (err) {
      error.value = 'Não foi possível copiar automaticamente. Selecione o texto manualmente.'
      console.error(err)
    }
  }

  return { copied, error, copy }
}
