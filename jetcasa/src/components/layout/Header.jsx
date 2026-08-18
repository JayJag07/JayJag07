import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Heart, LogIn, Menu, PlusCircle, X } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import Button from '../ui/Button'
import { useFavorites } from '../../context/FavoritesContext'

const NAV = [
  { to: '/pesquisar?fim=venda', label: 'Comprar' },
  { to: '/pesquisar?fim=aluguer', label: 'Alugar' },
  { to: '/vender', label: 'Vender' },
  { to: '/pesquisar?fim=terreno', label: 'Terrenos' },
  { to: '/agentes', label: 'Agentes Imobiliários' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { count } = useFavorites()
  const location = useLocation()

  useEffect(() => setOpen(false), [location])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b transition duration-300 ${
        scrolled
          ? 'border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90'
          : 'border-transparent bg-white dark:bg-slate-950'
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Logo />

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 dark:bg-slate-800 dark:text-brand-300'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/favoritos"
            className="relative grid size-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={`Favoritos (${count})`}
          >
            <Heart className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <span className="hidden sm:block">
            <ThemeToggle />
          </span>
          <span className="hidden sm:block">
            <Button to="/publicar" variant="gold" size="sm" icon={PlusCircle} className="whitespace-nowrap">
              Publicar Imóvel
            </Button>
          </span>
          <span className="hidden md:block">
            <Button to="/entrar" variant="outline" size="sm" icon={LogIn} className="whitespace-nowrap">
              Entrar / Cadastrar
            </Button>
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-xl text-slate-700 transition hover:bg-slate-100 lg:hidden dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 pb-5 pt-3 lg:hidden dark:border-slate-800 dark:bg-slate-950">
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="rounded-lg px-3 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            <Button to="/publicar" variant="gold" icon={PlusCircle}>Publicar Imóvel</Button>
            <Button to="/entrar" variant="outline" icon={LogIn}>Entrar / Cadastrar</Button>
            <div className="flex items-center justify-between rounded-xl px-1 pt-1">
              <span className="text-sm font-medium text-slate-500">Modo claro / escuro</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
