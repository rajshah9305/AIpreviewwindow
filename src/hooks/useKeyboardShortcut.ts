import { useEffect, useCallback } from 'react'

type KeyboardHandler = (event: KeyboardEvent) => void

export const useKeyboardShortcut = (
  key: string,
  handler: () => void,
  options: {
    ctrl?: boolean
    meta?: boolean
    shift?: boolean
    enabled?: boolean
  } = {}
) => {
  const { ctrl = false, meta = false, shift = false, enabled = true } = options

  const handleKeyPress = useCallback<KeyboardHandler>(
    (event) => {
      if (event.key !== key) return
      if (shift && !event.shiftKey) return

      // When both ctrl and meta are requested, accept either (cross-platform Ctrl/Cmd)
      if (ctrl && meta) {
        if (!event.ctrlKey && !event.metaKey) return
      } else {
        if (ctrl && !event.ctrlKey) return
        if (meta && !event.metaKey) return
      }

      event.preventDefault()
      handler()
    },
    [key, ctrl, meta, shift, handler]
  )

  useEffect(() => {
    if (!enabled) return
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress, enabled])
}
