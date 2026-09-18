/**
 * O GitHub Pages não conhece as rotas do React Router: um pedido directo a
 * /JayJag07/imovel/jc-001 devolveria 404. Este 404.html redirecciona para
 * /JayJag07/?/imovel/jc-001 (que existe e responde 200) e o bloco em index.html
 * repõe o endereço original antes de a aplicação arrancar.
 *
 * Técnica de rafgraph/spa-github-pages.
 */
import { writeFileSync } from 'node:fs'

// Quantos segmentos do caminho pertencem ao alojamento (aqui: o nome do repositório).
const pathSegmentsToKeep = process.env.VITE_BASE === '/' ? 0 : 1

const html = `<!doctype html>
<html lang="pt-AO">
  <head>
    <meta charset="utf-8" />
    <title>JETCASA</title>
    <script>
      // Converte /JayJag07/imovel/jc-001?x=1 em /JayJag07/?/imovel/jc-001&x=1
      ;(function () {
        var segments = ${pathSegmentsToKeep}
        var l = window.location
        l.replace(
          l.protocol +
            '//' +
            l.hostname +
            (l.port ? ':' + l.port : '') +
            l.pathname.split('/').slice(0, 1 + segments).join('/') +
            '/?/' +
            l.pathname.slice(1).split('/').slice(segments).join('/').replace(/&/g, '~and~') +
            (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
            l.hash,
        )
      })()
    </script>
  </head>
  <body></body>
</html>
`

writeFileSync(new URL('../dist/404.html', import.meta.url), html)
console.log('spa-fallback: dist/404.html criado (redirect para a rota da SPA)')
