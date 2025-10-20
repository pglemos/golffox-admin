/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Desabilita a renderização do lado do servidor para evitar problemas com o tema
  output: 'export',
  // Configura o diretório de saída para 'out'
  distDir: 'out',
  // Configura o caminho base para o site
  basePath: '',
  // Desabilita a geração de imagens estáticas
  images: {
    unoptimized: true
  },
  // Adiciona variáveis de ambiente públicas
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://golffox-admin.vercel.app'
  }
}

module.exports = nextConfig