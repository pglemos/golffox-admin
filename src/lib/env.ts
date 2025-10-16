import { z } from 'zod';

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string({ required_error: 'NEXT_PUBLIC_SUPABASE_URL é obrigatório' })
    .url('NEXT_PUBLIC_SUPABASE_URL deve ser uma URL válida'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string({ required_error: 'NEXT_PUBLIC_SUPABASE_ANON_KEY é obrigatória' })
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY não pode estar vazia'),
});

const serverSchema = clientSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, 'SUPABASE_SERVICE_ROLE_KEY não pode estar vazia')
    .optional(),
  SUPABASE_JWT_SECRET: z.string().min(1).optional(),
});

type ClientEnv = z.infer<typeof clientSchema>;
type ServerEnv = z.infer<typeof serverSchema>;

let cachedClientEnv: ClientEnv | undefined;
let cachedServerEnv: ServerEnv | undefined;

function parseEnv<T>(schema: z.ZodSchema<T>, payload: Record<string, string | undefined>) {
  const result = schema.safeParse(payload);

  if (!result.success) {
    const formatted = result.error.issues.map(issue => `${issue.path.join('.') || 'chave'}: ${issue.message}`).join(', ');

    if (typeof window !== 'undefined') {
      console.warn('[env] Variáveis de ambiente inválidas detectadas no cliente:', formatted);
      return undefined;
    }

    throw new Error(`Falha ao validar variáveis de ambiente: ${formatted}`);
  }

  return result.data;
}

function resolveClientEnv(): ClientEnv {
  if (!cachedClientEnv) {
    cachedClientEnv = parseEnv(clientSchema, {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });

    if (!cachedClientEnv) {
      throw new Error('Variáveis de ambiente públicas não configuradas corretamente.');
    }
  }

  return cachedClientEnv;
}

function resolveServerEnv(): ServerEnv {
  if (typeof window !== 'undefined') {
    throw new Error('Variáveis de ambiente do servidor não estão disponíveis no navegador.');
  }

  if (!cachedServerEnv) {
    cachedServerEnv = parseEnv(serverSchema, {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET,
    });

    if (!cachedServerEnv) {
      throw new Error('Variáveis de ambiente do servidor não estão configuradas corretamente.');
    }
  }

  return cachedServerEnv;
}

export const env = {
  get client() {
    return resolveClientEnv();
  },
  get server() {
    return resolveServerEnv();
  },
};
