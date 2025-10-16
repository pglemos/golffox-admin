'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from './Button';

export interface NavbarProps {
  logo?: React.ReactNode;
  actions?: React.ReactNode;
  links: Array<{ label: string; href: string }>;
}

export const Navbar: React.FC<NavbarProps> = ({ logo, actions, links }) => {
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 120], ['blur(0px)', 'blur(12px)']);
  const background = useTransform(scrollY, [0, 120], ['rgba(10,10,10,0)', 'rgba(10,10,10,0.65)']);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 mx-auto flex h-20 max-w-6xl items-center justify-between rounded-full px-8 backdrop-blur"
      style={{ background, backdropFilter: blur as unknown as string }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex items-center gap-4 text-white">
        {logo}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-secondary">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3 text-white">
        {actions ?? (
          <Button variant="ghost" className="border-white/30 text-white">
            Entrar
          </Button>
        )}
      </div>
    </motion.header>
  );
};
