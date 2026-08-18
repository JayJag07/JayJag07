import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Repõe o scroll no topo a cada mudança de página (excepto na pesquisa). */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname.startsWith('/pesquisar')) return
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
