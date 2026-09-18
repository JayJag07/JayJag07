import { FileCheck2, KeyRound, Search, ShieldCheck } from 'lucide-react'
import Button from '../ui/Button'

const STEPS = [
  {
    icon: Search,
    title: 'Pesquise por província ou centralidade',
    text: 'Filtre por preço em Kwanza, tipologia, área e documentação. O mapa acompanha cada filtro que aplica.',
  },
  {
    icon: ShieldCheck,
    title: 'Confirme a documentação',
    text: 'Cada anúncio indica se tem registo predial, título definitivo ou direito de superfície antes da visita.',
  },
  {
    icon: KeyRound,
    title: 'Agende a visita',
    text: 'Fale directamente com o proprietário ou com o agente por WhatsApp e marque a visita no dia que lhe convém.',
  },
  {
    icon: FileCheck2,
    title: 'Feche o negócio com segurança',
    text: 'Acompanhamos a escritura e a transmissão do imóvel junto das entidades competentes.',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-white py-16 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="max-w-2xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Como funciona o JETCASA
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Da pesquisa à chave na mão, com a documentação verificada em cada passo.
          </p>
        </header>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl bg-surface p-6 dark:bg-slate-900">
              <span className="grid size-12 place-items-center rounded-xl bg-brand-500 text-white shadow-md">
                <s.icon className="size-6" />
              </span>
              <span className="absolute right-5 top-5 text-4xl font-extrabold text-slate-200 dark:text-slate-800">
                {i + 1}
              </span>
              <h3 className="mt-4 font-bold text-slate-900 dark:text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 overflow-hidden rounded-2xl bg-brand-500 p-8 sm:p-12">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                Tem um imóvel ou terreno para vender?
              </h3>
              <p className="mt-2 text-white/90">
                Publique gratuitamente e chegue a milhares de compradores em todo o país. A nossa
                equipa ajuda a preparar as fotografias e a validar a documentação.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button to="/publicar" variant="gold" size="lg">Publicar Imóvel</Button>
              <Button to="/vender" variant="white" size="lg">Saber mais</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
