import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Servido a partir de /jetcasa/ (GitHub Pages e `npm run preview`).
  // Para publicar na raiz de um domínio próprio, troque para '/'.
  base: '/jetcasa/',
  plugins: [react(), tailwindcss()],
  build: { outDir: 'dist', sourcemap: false },
})
