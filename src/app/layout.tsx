import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@providers/app-providers';
import { cn } from '@utils/cn';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Golffox Platform',
  description: 'Painel moderno para gestão de mobilidade corporativa Golffox.',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="scroll-smooth" lang="pt-BR" suppressHydrationWarning>
      <body className={cn(inter.className, 'bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50')}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
