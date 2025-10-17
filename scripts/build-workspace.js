#!/usr/bin/env node

const { execSync } = require('node:child_process')

const project = process.env.VERCEL_PROJECT_NAME || process.env.PROJECT_NAME || ''

const WORKSPACE_MAP = {
  'golffox-admin': { pkg: 'golffox-admin', path: 'apps/admin' },
  'golffox-operador': { pkg: 'golffox-operator', path: 'apps/operator' },
  'golffox-transportadora': { pkg: 'golffox-carrier', path: 'apps/carrier' },
  'golffox-motorista': { pkg: 'golffox-driver', path: 'apps/driver' },
  'golffox-passageiro': { pkg: 'golffox-passenger', path: 'apps/passenger' },
  'golffox-api': { pkg: 'golffox-api', path: 'api' },
}

function run(cmd) {
  console.log(`[build] ${cmd}`)
  execSync(cmd, { stdio: 'inherit', env: process.env })
}

const workspace = WORKSPACE_MAP[project]

if (workspace) {
  console.log(`[build] Detected Vercel project "${project}". Installing and building ${workspace.pkg}.`)
  run(`npm install --prefix ${workspace.path}`)
  run(`npm run build --prefix ${workspace.path}`)
} else {
  console.log('[build] No specific Vercel project detected. Building all workspaces.')
  run('pnpm -r build')
}
