import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const FavoritesContext = createContext(null)

/** Favoritos guardados localmente — sem necessidade de login. */
export function FavoritesProvider({ children }) {
  const [ids, setIds] = useLocalStorage('jetcasa:favoritos', [])

  const toggle = useCallback(
    (id) =>
      setIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      ),
    [setIds],
  )

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      has: (id) => ids.includes(id),
      toggle,
      clear: () => setIds([]),
    }),
    [ids, toggle, setIds],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites tem de ser usado dentro de <FavoritesProvider>')
  return ctx
}
