'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyState?: React.ReactNode;
}

const shimmerRows = Array.from({ length: 4 }, (_, index) => index);

export function Table<T extends Record<string, any>>({ data, columns, loading = false, emptyState }: TableProps<T>) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-xl">
      <table className="min-w-full divide-y divide-white/10">
        <thead className="bg-white/5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-6 py-4">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-sm text-slate-200">
          {loading
            ? shimmerRows.map((row) => (
                <tr key={row} className="animate-pulse">
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4">
                      <div className="h-4 w-24 rounded-full bg-white/10" />
                    </td>
                  ))}
                </tr>
              ))
            : data.length > 0
            ? data.map((row, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIndex * 0.04 }}
                  className="hover:bg-white/5"
                >
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4 align-middle">
                      {column.render ? column.render(row) : String(row[column.key as keyof T] ?? '')}
                    </td>
                  ))}
                </motion.tr>
              ))
            : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                    {emptyState ?? 'Nenhum registro encontrado.'}
                  </td>
                </tr>
              )}
        </tbody>
      </table>
    </div>
  );
}
