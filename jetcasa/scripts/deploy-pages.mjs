/**
 * Publica o conteúdo de dist/ no branch gh-pages, sem tocar nos outros branches
 * nem no working tree. Requer um `npm run build` prévio.
 */
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const dist = join(root, 'dist')
const repo = resolve(root, '..')

const git = (args, env) =>
  execFileSync('git', ['-C', repo, ...args], {
    encoding: 'utf8',
    env: env ?? process.env,
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim()

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html não existe — corra `npm run build` primeiro.')
  process.exit(1)
}

const work = mkdtempSync(join(tmpdir(), 'jetcasa-pages-'))
// O índice fica fora da árvore de trabalho, senão o próprio ficheiro entraria no commit.
const indexFile = mkdtempSync(join(tmpdir(), 'jetcasa-index-')) + '/index'
try {
  cpSync(dist, work, { recursive: true })
  // O Jekyll do GitHub Pages ignora pastas iniciadas por "_"; desliga-o.
  writeFileSync(join(work, '.nojekyll'), '')

  // Monta a árvore num índice temporário, para não mexer no índice do repositório.
  const env = { ...process.env, GIT_INDEX_FILE: indexFile, GIT_WORK_TREE: work }
  git(['add', '--all'], env)
  const tree = git(['write-tree'], env)

  let parent = null
  for (const ref of ['refs/heads/gh-pages', 'refs/remotes/origin/gh-pages']) {
    try {
      parent = git(['rev-parse', '--verify', ref])
      break
    } catch {
      /* ainda não existe */
    }
  }

  const message = `Publicar JETCASA (${git(['rev-parse', '--short', 'HEAD'])})`
  const commit = parent
    ? git(['commit-tree', tree, '-p', parent, '-m', message])
    : git(['commit-tree', tree, '-m', message])

  git(['update-ref', 'refs/heads/gh-pages', commit])
  console.log(`gh-pages actualizado: ${commit.slice(0, 7)}`)
} finally {
  rmSync(work, { recursive: true, force: true })
}
