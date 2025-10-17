#!/usr/bin/env node

const { execSync } = require('node:child_process')

const project = process.env.VERCEL_PROJECT_NAME || process.env.PROJECT_NAME || ''

const WORKSPACE_MAP = {
  'golffox-admin': 'golffox-admin',
  'golffox-operador': 'golffox-operator',
  'golffox-transportadora': 'golffox-carrier',
  'golffox-motorista': 'golffox-driver',
  'golffox-passageiro': 'golffox-passenger',
  'golffox-api': 'golffox-api',
}

function run(cmd) {
  console.log(`[build] ${cmd}`)
  execSync(cmd, { stdio: 'inherit', env: process.env })
}

const workspace = WORKSPACE_MAP[project]

if (workspace) {
  console.log(`[build] Detected Vercel project "${project}". Building workspace "${workspace}".`)
  run(`pnpm --filter ${workspace} run build`)
} else {
  console.log('[build] No specific Vercel project detected. Building all workspaces.')
  run('pnpm -r build')
}

