'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, description, children, footer }) => {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0E0E1A]/90 p-8 text-white shadow-[0_40px_80px_rgba(0,0,0,0.4)]"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-6 top-6 rounded-full border border-white/10 p-2 text-slate-300 transition hover:text-white"
              aria-label="Fechar"
            >
              ✕
            </button>
            <div className="space-y-4">
              {title && <h2 className="text-2xl font-semibold">{title}</h2>}
              {description && <p className="text-sm text-slate-300">{description}</p>}
              <div className="space-y-4 text-sm text-slate-200">{children}</div>
            </div>
            {footer && <div className="mt-8 flex justify-end gap-3">{footer}</div>}
            {!footer && (
              <div className="mt-8 flex justify-end gap-3">
                <Button variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
                <Button>Confirmar</Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
