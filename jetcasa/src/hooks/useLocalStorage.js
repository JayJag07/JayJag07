import { useCallback, useEffect, useState } from 'react'

/** Estado persistido em localStorage, tolerante a modo privado/SSR. */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* quota cheia ou storage indisponível — segue sem persistir */
    }
  }, [key, value])

  // Mantém separadores do mesmo browser em sincronia.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== key || e.newValue == null) return
      try {
        setValue(JSON.parse(e.newValue))
      } catch {
        /* ignora valores corrompidos */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  const reset = useCallback(() => setValue(initialValue), [initialValue])

  return [value, setValue, reset]
}
