// O GitHub Pages não conhece as rotas do React Router: serve o mesmo shell
// em 404.html para que /jetcasa/imovel/jc-001 continue a funcionar em recarga.
import { copyFileSync } from 'node:fs'

copyFileSync(new URL('../dist/index.html', import.meta.url), new URL('../dist/404.html', import.meta.url))
console.log('spa-fallback: dist/404.html criado')
