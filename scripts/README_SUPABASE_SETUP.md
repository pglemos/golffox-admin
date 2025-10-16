Supabase setup (manual or scripted)

Options:
- Use Supabase Dashboard → SQL Editor: run files in `supabase/migrations/0001_core.sql` then `supabase/seed/000_seed.sql`.
- Or via `psql` using a `SUPABASE_DB_URL` (requires Database URL):

  psql "$SUPABASE_DB_URL" -f supabase/migrations/0001_core.sql
  psql "$SUPABASE_DB_URL" -f supabase/seed/000_seed.sql

Realtime
- Enabled by publication statements in 0001_core.sql.

RLS/Policies
- Demo policies allow public reads and insert positions. Tighten per-role in production.

