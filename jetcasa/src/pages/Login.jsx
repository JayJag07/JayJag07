import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, Mail, Phone, User } from 'lucide-react'
import Logo from '../components/layout/Logo'
import Button from '../components/ui/Button'

/** Entrar / Cadastrar — interface de demonstração, sem backend ligado. */
export default function Login() {
  const [mode, setMode] = useState('entrar')

  useEffect(() => {
    document.title = mode === 'entrar' ? 'Entrar — JETCASA' : 'Criar conta — JETCASA'
  }, [mode])

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
      <div className="hidden lg:block">
        <Logo />
        <h1 className="mt-8 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
          A sua conta JETCASA
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Guarde imóveis favoritos em todos os dispositivos, receba alertas de novos anúncios na sua
          zona e faça a gestão dos anúncios que publicar.
        </p>
        <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
          {[
            'Alertas por WhatsApp quando surgir um imóvel dentro dos seus filtros',
            'Histórico de visitas agendadas e mensagens com os agentes',
            'Gestão dos seus anúncios e estatísticas de visualizações',
          ].map((t) => (
            <li key={t} className="flex gap-2.5">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-6 sm:p-8">
        <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {[
            { id: 'entrar', label: 'Entrar' },
            { id: 'cadastrar', label: 'Cadastrar' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setMode(t.id)}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                mode === t.id
                  ? 'bg-white text-brand-600 shadow-sm dark:bg-slate-950 dark:text-brand-300'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form className="mt-6 grid gap-4" onSubmit={(e) => e.preventDefault()}>
          {mode === 'cadastrar' && (
            <IconField icon={User} placeholder="Nome completo" required />
          )}
          <IconField icon={Mail} type="email" placeholder="Email" required />
          {mode === 'cadastrar' && (
            <IconField icon={Phone} type="tel" placeholder="Telefone / WhatsApp" required />
          )}
          <IconField icon={Lock} type="password" placeholder="Palavra-passe" required />

          <Button type="submit" size="lg" className="mt-2">
            {mode === 'entrar' ? 'Entrar' : 'Criar conta'}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Ao continuar aceita os termos de utilização e a política de privacidade do JETCASA. Esta é
          uma interface de demonstração — nenhum dado é enviado.
        </p>

        <p className="mt-4 text-center text-sm text-slate-500">
          Prefere continuar sem conta?{' '}
          <Link to="/pesquisar" className="font-bold text-brand-600 hover:underline dark:text-brand-300">
            Explorar imóveis
          </Link>
        </p>
      </div>
    </div>
  )
}

function IconField({ icon: Icon, ...props }) {
  return (
    <label className="relative block">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
      <input
        {...props}
        className="h-12 w-full rounded-xl bg-white pl-11 pr-4 text-sm ring-1 ring-slate-200 outline-none transition focus:ring-2 focus:ring-brand-500 dark:bg-slate-900 dark:text-white dark:ring-slate-700"
      />
    </label>
  )
}
