import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import PropertyImage from '../media/PropertyImage'

const CATEGORIES = [
  {
    title: 'Casas em Centralidades',
    subtitle: 'Kilamba, Sequele, Zango e Cacuaco',
    to: '/pesquisar?fim=venda&tipo=casa,apartamento&zona=Kilamba',
    variant: 'tower',
  },
  {
    title: 'Vivendas em Condomínio Fechado',
    subtitle: 'Talatona, Benfica e Morro Bento',
    to: '/pesquisar?fim=venda&tipo=vivenda&extras=Condom%C3%ADnio%20Fechado',
    variant: 'villa',
  },
  {
    title: 'Terrenos Legalizados para Construção',
    subtitle: 'Com registo ou direito de superfície',
    to: '/pesquisar?fim=terreno&doc=registo,titulo,superficie',
    variant: 'land',
  },
  {
    title: 'Apartamentos para Alugar em Luanda',
    subtitle: 'Miramar, Maianga, Golfe e Ingombota',
    to: '/pesquisar?fim=aluguer&prov=Luanda&tipo=apartamento',
    variant: 'duplex',
  },
]

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <header className="mb-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Categorias populares
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Atalhos para o que os angolanos mais procuram no JETCASA.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Link
            key={c.title}
            to={c.to}
            className="group relative overflow-hidden rounded-2xl shadow-[var(--shadow-card)] ring-1 ring-slate-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] dark:ring-white/10"
          >
            <PropertyImage
              variant={c.variant}
              seed={c.title}
              alt={c.title}
              className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="text-lg font-bold leading-tight text-white">{c.title}</h3>
              <p className="mt-1 text-sm text-white/75">{c.subtitle}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-gold-400">
                Explorar
                <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
