import { Home, Search } from 'lucide-react'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="text-7xl font-extrabold tracking-tight text-brand-500">404</p>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">
        Não encontrámos esta página
      </h1>
      <p className="mt-3 text-slate-500 dark:text-slate-400">
        O endereço pode estar incorrecto ou o anúncio já não está disponível.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/" icon={Home}>Voltar ao início</Button>
        <Button to="/pesquisar" variant="outline" icon={Search}>Pesquisar imóveis</Button>
      </div>
    </div>
  )
}
