import { useEffect } from 'react'

/** Bloqueia o scroll do body enquanto um modal está aberto. */
export function useLockBodyScroll(active) {
  useEffect(() => {
    if (!active) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [active])
}
