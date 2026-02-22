/**
 * Keyboard shortcut hook
 * Handles keyboard event listeners with cleanup
 */

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
      const matchesKey = event.key === key
      const matchesCtrl = !ctrl || event.ctrlKey
      const matchesMeta = !meta || event.metaKey
      const matchesShift = !shift || event.shiftKey
      const matchesModifier = (ctrl || meta) ? (event.ctrlKey || event.metaKey) : true

      if (matchesKey && matchesCtrl && matchesMeta && matchesShift && matchesModifier) {
        event.preventDefault()
        handler()
      }
    },
    [key, ctrl, meta, shift, handler]
  )

  useEffect(() => {
    if (!enabled) return

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress, enabled])
}
