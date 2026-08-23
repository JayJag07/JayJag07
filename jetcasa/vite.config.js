import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // O site é servido em https://jayjag07.github.io/JayJag07/, por isso a base
  // é o nome do repositório. Num domínio próprio use VITE_BASE=/ npm run build.
  base: process.env.VITE_BASE ?? '/JayJag07/',
  plugins: [react(), tailwindcss()],
  build: { outDir: 'dist', sourcemap: false },
})
