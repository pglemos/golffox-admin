import { runSetup } from './dbSetup'

const shouldRun = process.env.RUN_DB_SETUP === 'true'

if (!shouldRun) {
  console.log('[setup-runner] RUN_DB_SETUP is not true, skipping Supabase setup')
  process.exit(0)
}

runSetup()
  .then(() => {
    console.log('[setup-runner] Supabase schema and seed applied successfully.')
  })
  .catch((err) => {
    console.error('[setup-runner] Failed to apply Supabase setup', err)
    process.exit(1)
  })
