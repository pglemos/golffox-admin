/** @type {import(''next'').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Gera��o est�tica (sem SSR)
  output: 'export',
  // Localiza��o padr�o pt-BR
  i18n: { locales: ['pt-BR'], defaultLocale: 'pt-BR' },
  // Imagens sem otimiza��o (compat�vel com export)
  images: { unoptimized: true },
  // Vari�veis p�blicas
  env: {
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || 'https://golffox-admin.vercel.app',
  },
}

module.exports = nextConfig