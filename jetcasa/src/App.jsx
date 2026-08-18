import { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'

// As páginas pesadas (mapa, formulários) só são carregadas quando visitadas.
const Search = lazy(() => import('./pages/Search'))
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'))
const Agents = lazy(() => import('./pages/Agents'))
const Sell = lazy(() => import('./pages/Sell'))
const Publish = lazy(() => import('./pages/Publish'))
const Login = lazy(() => import('./pages/Login'))
const Favorites = lazy(() => import('./pages/Favorites'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const location = useLocation()
  // A página de resultados ocupa o ecrã todo (lista + mapa), sem rodapé.
  const fullBleed = location.pathname.startsWith('/pesquisar')

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pesquisar" element={<Search />} />
            <Route path="/imovel/:id" element={<PropertyDetail />} />
            <Route path="/agentes" element={<Agents />} />
            <Route path="/vender" element={<Sell />} />
            <Route path="/publicar" element={<Publish />} />
            <Route path="/entrar" element={<Login />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!fullBleed && <Footer />}
    </div>
  )
}

function PageLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status" aria-label="A carregar">
      <span className="size-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand-500 dark:border-slate-700 dark:border-t-brand-400" />
    </div>
  )
}
