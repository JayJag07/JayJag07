import { createContext, useContext, useEffect, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const ThemeContext = createContext(null)

/** Dark/Light mode opcional, com fallback para a preferência do sistema. */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('jetcasa:tema', 'system')

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches)
      document.documentElement.classList.toggle('dark', dark)
      document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggle: () =>
        setTheme((t) => {
          if (t === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark'
          }
          return t === 'dark' ? 'light' : 'dark'
        }),
    }),
    [theme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme tem de ser usado dentro de <ThemeProvider>')
  return ctx
}
