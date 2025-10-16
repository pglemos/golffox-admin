import { describe, expect, it, vi } from 'vitest';

vi.mock('../../src/lib/logging/logger', () => ({
  logger: {
    warn: vi.fn(),
  },
}));

// Import inside test to control process.env

describe('env', () => {
  it('valida variáveis públicas corretamente', async () => {
    const originalEnv = { ...process.env };
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';

    const { env } = await import('../../src/lib/env');

    expect(env.client.NEXT_PUBLIC_SUPABASE_URL).toBe('https://example.supabase.co');
    expect(env.client.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe('anon');

    process.env = originalEnv;
  });

  it('lança erro em ambiente server quando variáveis faltam', async () => {
    const originalEnv = { ...process.env };
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    await expect(async () => {
      const { env } = await import('../../src/lib/env');
      // eslint-disable-next-line no-void
      void env;
    }).rejects.toThrowError();

    process.env = originalEnv;
  });
});
