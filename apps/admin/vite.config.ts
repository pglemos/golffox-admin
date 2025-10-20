import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = resolve(__dirname, '..', '..')

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
  resolve: {
    alias: {
      '@': projectRoot,
    },
  },
})

