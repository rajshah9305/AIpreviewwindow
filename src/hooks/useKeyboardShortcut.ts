import { useEffect, useCallback } from 'react'

interface Options {
  ctrl?: boolean
  meta?: boolean
  shift?: boolean
  enabled?: boolean
}

export function useKeyboardShortcut(key: string, handler: () => void, options: Options = {}): void {
  const { ctrl = false, meta = false, shift = false, enabled = true } = options

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key !== key) return
    if (shift && !e.shiftKey) return
    if (ctrl && meta ? (!e.ctrlKey && !e.metaKey) : (ctrl && !e.ctrlKey) || (meta && !e.metaKey)) return
    e.preventDefault()
    handler()
  }, [key, ctrl, meta, shift, handler])

  useEffect(() => {
    if (!enabled) return
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onKeyDown, enabled])
}
