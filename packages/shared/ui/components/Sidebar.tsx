'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';

type SidebarItem = {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  active?: boolean;
};

export interface SidebarProps {
  items: SidebarItem[];
  footer?: React.ReactNode;
  collapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, footer, collapsed = false, onToggle }) => (
  <motion.aside
    initial={{ x: -40, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className={`group relative flex h-full flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-[#121224] via-[#0A0A0A] to-[#040407] p-4 text-white shadow-[0_30px_60px_rgba(0,0,0,0.35)] ${collapsed ? 'w-20' : 'w-64'} transition-[width] duration-500`}
  >
    <div className="flex items-center justify-between px-2 py-4">
      <span className={`text-lg font-semibold tracking-tight transition ${collapsed ? 'hidden' : 'block'}`}>Golffox</span>
      <Button
        aria-label="Alternar sidebar"
        size="sm"
        variant="ghost"
        className="h-10 w-10 rounded-full border border-white/10 p-0"
        onClick={onToggle}
      >
        <span className="text-xl">☰</span>
      </Button>
    </div>
    <nav className="mt-2 flex-1 space-y-2">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href ?? '#'}
          className={`group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-300 ${item.active ? 'bg-white/10 text-white shadow-inner' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
        >
          <span className="text-lg">{item.icon}</span>
          <span className={`${collapsed ? 'hidden opacity-0' : 'opacity-100'} transition-opacity duration-300`}>{item.label}</span>
        </a>
      ))}
    </nav>
    {footer && <div className="mt-6 border-t border-white/10 pt-4 text-sm text-slate-300">{footer}</div>}
  </motion.aside>
);
