import { useEffect } from 'react'
import Hero from '../components/home/Hero'
import Stats from '../components/home/Stats'
import Categories from '../components/home/Categories'
import FeaturedCarousel from '../components/home/FeaturedCarousel'
import HowItWorks from '../components/home/HowItWorks'
import { PROPERTIES } from '../data/properties'
import { sortProperties } from '../lib/filters'

export default function Home() {
  useEffect(() => {
    document.title = 'JETCASA — O seu portal imobiliário em Angola'
  }, [])

  const featured = sortProperties(PROPERTIES.filter((p) => p.featured), 'relevancia')
  const land = sortProperties(PROPERTIES.filter((p) => p.type === 'terreno'), 'recentes')
  const rentals = sortProperties(
    PROPERTIES.filter((p) => p.purpose === 'aluguer'),
    'recentes',
  )

  return (
    <>
      <Hero />
      <Stats />
      <FeaturedCarousel
        title="Imóveis em destaque"
        subtitle="Selecção verificada pela equipa JETCASA esta semana."
        properties={featured}
        seeAllTo="/pesquisar?fim=venda"
      />
      <Categories />
      <FeaturedCarousel
        title="Terrenos com documentação verificada"
        subtitle="Direito de superfície, título definitivo ou registo predial confirmados."
        properties={land}
        seeAllTo="/pesquisar?fim=terreno"
      />
      <FeaturedCarousel
        title="Para arrendar agora"
        subtitle="Disponíveis de imediato, com renda mensal em Kwanza."
        properties={rentals}
        seeAllTo="/pesquisar?fim=aluguer"
      />
      <HowItWorks />
    </>
  )
}
