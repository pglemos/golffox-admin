/** @type {import(''next'').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Geração estática (sem SSR)
  output: 'export',
  // Localização padrão pt-BR
  i18n: { locales: ['pt-BR'], defaultLocale: 'pt-BR' },
  // Imagens sem otimização (compatível com export)
  images: { unoptimized: true },
  // Variáveis públicas
  env: {
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || 'https://golffox-admin.vercel.app',
  },
}

module.exports = nextConfig