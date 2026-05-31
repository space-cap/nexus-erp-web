export function useToast() {
  const message = useState('toast-message', () => '')
  const visible = useState('toast-visible', () => false)
  let timer: ReturnType<typeof setTimeout> | undefined

  function showToast(nextMessage: string) {
    message.value = nextMessage
    visible.value = true

    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      visible.value = false
    }, 2200)
  }

  return {
    message,
    visible,
    showToast
  }
}
