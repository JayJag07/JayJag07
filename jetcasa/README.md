# JETCASA — O seu portal imobiliário em Angola

Aplicação web de demonstração para compra, venda e arrendamento de imóveis e terrenos em Angola.
Interface inspirada no Zillow (pesquisa em destaque na homepage, resultados em ecrã dividido com
mapa interactivo, design orientado a cards), com valores em Kwanza e conteúdos em português de
Angola.

## Stack

| Camada | Escolha |
| --- | --- |
| Framework | React 19 + Vite (SPA estática, sem servidor) |
| Rotas | React Router 7 |
| Estilos | Tailwind CSS 4 (tema próprio em `src/index.css`) |
| Ícones | lucide-react |
| Mapas | Leaflet + React-Leaflet, com tiles OpenStreetMap |
| Estado | React Hooks + Context (`FavoritesContext`, `ThemeContext`) e `localStorage` |

Vite em vez de Next.js porque o projecto não tem backend nem SSR: o resultado é um bundle estático
que corre em GitHub Pages ou em qualquer alojamento. A lógica de dados está isolada em
`src/data/`, pelo que a migração para uma API real passa por substituir esses módulos.

## Executar

```bash
cd jetcasa
npm install
npm run dev      # http://localhost:5173/JayJag07/
npm run build    # gera dist/ (inclui 404.html para deep links no GitHub Pages)
npm run preview  # serve o build em http://localhost:4173/JayJag07/
```

## Publicação (GitHub Pages)

O site está publicado a partir do branch `gh-pages` do próprio repositório, em
**https://jayjag07.github.io/JayJag07/** (Definições → Pages → Source: *Deploy from a branch* →
`gh-pages` / `root`).

Para republicar depois de alterações:

```bash
cd jetcasa
npm run build                      # gera dist/ com base /JayJag07/
npm run deploy                     # publica dist/ no branch gh-pages
```

O `base` do Vite é `/JayJag07/` (o nome do repositório). Para servir na raiz de um domínio
próprio, construa com `VITE_BASE=/ npm run build`.

## Estrutura

```
src/
├── components/
│   ├── home/        Hero, Estatísticas, Categorias, Carrossel de destaques, Como funciona
│   ├── layout/      Header, Footer, Logo, ThemeToggle, ScrollToTop, SocialIcons
│   ├── map/         PropertyMap (Leaflet, marcadores com preço)
│   ├── media/       PropertyImage (cenas SVG), PhotoCarousel
│   ├── property/    PropertyCard, Gallery, ContactWidget, MortgageCalculator
│   ├── search/      SearchBar, LocationAutocomplete, FilterBar
│   └── ui/          Button, Badge, Modal, FavoriteButton
├── context/         Favoritos (localStorage) e tema claro/escuro
├── data/            properties.js, locations.js (18 províncias), agents.js
├── hooks/           useLocalStorage, useMediaQuery, useLockBodyScroll
├── lib/             format.js (Kwanza, áreas, datas), filters.js, whatsapp.js
└── pages/           Home, Search, PropertyDetail, Agents, Sell, Publish, Login, Favorites, NotFound
```

## Funcionalidades

**Homepage** — hero com cena de Luanda em SVG animado, barra de pesquisa central com separadores
Comprar / Alugar / Terrenos, auto-complete de província, município e centralidade (Talatona,
Kilamba, Maianga, Benguela…), filtros rápidos de preço, tipo e tipologia, estatísticas com
contador animado, categorias populares e carrosséis de destaques, terrenos verificados e
arrendamentos.

**Pesquisa em ecrã dividido** — lista de resultados à esquerda e mapa à direita, sempre
sincronizados. Filtros de faixa de preço em AOA, tipo, quartos/WC, área, estado (novo, usado, em
construção), documentação (registo predial, direito de superfície, título definitivo) e
comodidades. Os terrenos ganham filtros próprios de dimensão (m²/hectares) e de infra-estruturas
(água, luz, acesso asfaltado, murado). Os filtros ficam no URL, por isso a pesquisa é partilhável.
No telemóvel há alternância lista/mapa.

**Mapa** — marcadores em pill com o preço aproximado, popup com miniatura e ligação ao anúncio,
enquadramento automático aos resultados e realce cruzado com o card sob o rato.

**Detalhe do imóvel** — galeria em grelha com modal de tela cheia e navegação por teclado, resumo
de características, descrição, comodidades, infra-estruturas (terrenos), mapa da zona, simulador
de prestação ou de arrendamento e widget de contacto fixo com "Agendar Visita", "Enviar Mensagem"
e WhatsApp.

**Favoritos** — guardados em `localStorage`, sem necessidade de login, com contador no header e
página dedicada.

**WhatsApp** — todos os botões abrem a conversa já com a mensagem
`Olá, vi o imóvel [Título] no JETCASA e gostaria de mais informações`.

**Publicar / Vender / Agentes / Entrar** — formulário de anúncio em quatro passos, página de venda
com avaliação rápida a partir do preço médio por m² dos anúncios comparáveis, directório de
agentes com filtro por província e ecrã de autenticação (interface, sem backend).

## Notas de implementação

- **Imagens sem rede.** As fotografias dos anúncios são cenas SVG geradas no cliente
  (`PropertyImage`), parametrizadas por um hash do id do imóvel: vivendas, prédios, terrenos
  demarcados, piscinas, interiores, obra e vista aérea. Não há pedidos a CDNs de imagem, o site
  carrega na íntegra mesmo offline e cada anúncio mantém um aspecto próprio.
- **Mapa degrada bem.** Se os tiles do OpenStreetMap não carregarem, os marcadores de preço
  continuam a funcionar e o mapa avisa o utilizador.
- **Acessibilidade.** Auto-complete navegável por teclado, modais com Esc e foco preso, `aria-*`
  nos controlos, alvos de toque ≥ 40 px e respeito por `prefers-reduced-motion`.
- **Desempenho.** Rotas em `React.lazy`, Leaflet só entra no bundle da página de pesquisa e o CSS
  final ronda 9 kB gzip.
- **Dados fictícios.** 24 anúncios e 6 agentes em `src/data/`, cobrindo Luanda, Bengo, Benguela,
  Huambo, Huíla, Cabinda e Malanje.
