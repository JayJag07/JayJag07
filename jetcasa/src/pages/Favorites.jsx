import { useEffect } from 'react'
import { HeartOff } from 'lucide-react'
import PropertyCard from '../components/property/PropertyCard'
import Button from '../components/ui/Button'
import { useFavorites } from '../context/FavoritesContext'
import { PROPERTIES } from '../data/properties'

export default function Favorites() {
  const { ids, clear } = useFavorites()
  const saved = PROPERTIES.filter((p) => ids.includes(p.id))

  useEffect(() => {
    document.title = 'Os meus favoritos — JETCASA'
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Os meus favoritos
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Guardados neste dispositivo — não precisa de conta para os manter.
          </p>
        </div>
        {saved.length > 0 && (
          <Button variant="outline" size="sm" onClick={clear}>
            Limpar lista
          </Button>
        )}
      </header>

      {saved.length === 0 ? (
        <div className="card mt-10 p-12 text-center">
          <HeartOff className="mx-auto size-12 text-slate-300" />
          <p className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
            Ainda não guardou nenhum imóvel
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
            Toque no coração de qualquer anúncio para o guardar aqui e comparar mais tarde.
          </p>
          <Button to="/pesquisar" className="mt-6">Explorar imóveis</Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {saved.map((p) => (
            <PropertyCard key={p.id} property={p} compact />
          ))}
        </div>
      )}
    </div>
  )
}
