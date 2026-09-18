import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { FacebookIcon, InstagramIcon, LinkedinIcon } from './SocialIcons'
import Logo from './Logo'

const COLUMNS = [
  {
    title: 'Comprar',
    links: [
      { label: 'Casas à venda', to: '/pesquisar?fim=venda&tipo=casa,vivenda' },
      { label: 'Apartamentos', to: '/pesquisar?fim=venda&tipo=apartamento' },
      { label: 'Terrenos legalizados', to: '/pesquisar?fim=terreno&doc=registo,titulo' },
      { label: 'Imóveis em construção', to: '/pesquisar?fim=venda&estado=construcao' },
    ],
  },
  {
    title: 'Alugar',
    links: [
      { label: 'Apartamentos em Luanda', to: '/pesquisar?fim=aluguer&prov=Luanda&tipo=apartamento' },
      { label: 'Casas para família', to: '/pesquisar?fim=aluguer&tipo=casa,vivenda' },
      { label: 'Escritórios', to: '/pesquisar?fim=aluguer&tipo=escritorio' },
      { label: 'Lojas e armazéns', to: '/pesquisar?fim=aluguer&tipo=loja' },
    ],
  },
  {
    title: 'JETCASA',
    links: [
      { label: 'Publicar imóvel', to: '/publicar' },
      { label: 'Vender com a JETCASA', to: '/vender' },
      { label: 'Agentes imobiliários', to: '/agentes' },
      { label: 'Os meus favoritos', to: '/favoritos' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            O seu portal imobiliário em Angola. Encontre a sua próxima casa, apartamento ou terreno
            de forma rápida e segura.
          </p>
          <ul className="mt-5 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 text-brand-500" /> Talatona, Luanda — Angola
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 text-brand-500" /> +244 923 000 100
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 text-brand-500" /> geral@jetcasa.ao
            </li>
          </ul>
          <div className="mt-5 flex gap-2">
            {[FacebookIcon, InstagramIcon, LinkedinIcon].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Rede social JETCASA"
                className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-brand-500 hover:text-white dark:bg-slate-800 dark:text-slate-300"
              >
                <Icon className="size-5" />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-white">
              {col.title}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-sm text-slate-600 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 px-4 py-6 text-center text-xs text-slate-500 sm:px-6 dark:border-slate-400">
        © {new Date().getFullYear()} JETCASA — O seu portal imobiliário em Angola. Valores em Kwanza (AOA).
        Projecto de demonstração com dados fictícios.
      </div>
    </footer>
  )
}
