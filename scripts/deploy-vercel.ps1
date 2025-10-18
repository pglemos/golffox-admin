param(
  [string]$Scope = "synvolt-projetos",
  [switch]$CheckHealth
)

function EnsureVercel {
  try { vercel --version | Out-Null } catch {
    Write-Host "Instalando Vercel CLI..." -ForegroundColor Cyan
    npm i -g vercel
  }
}

function EnsureLogin([string]$Scope) {
  try {
    $who = vercel whoami --scope $Scope
    Write-Host "Autenticado como: $who" -ForegroundColor Green
  } catch {
    Write-Host "Você não está autenticado. Execute 'vercel login' e finalize o fluxo." -ForegroundColor Yellow
    exit 1
  }
}

function LinkAndDeploy([string]$Path, [string]$Project, [string]$Scope) {
  Write-Host "\nDeploy do projeto '$Project' em '$Path'" -ForegroundColor Cyan
  Set-Location $Path
  vercel link --project $Project --scope $Scope --yes
  vercel --prod --scope $Scope --yes
}

EnsureVercel
EnsureLogin $Scope

# Admin (Next.js - raiz)
LinkAndDeploy "c:\Users\DELL\Documents\Nova pasta\golffox_admin\golffox-admin" "golffox-admin" $Scope

# Vite apps
LinkAndDeploy "c:\Users\DELL\Documents\Nova pasta\golffox_admin\golffox-admin\apps\carrier" "golffox-transportadora" $Scope
LinkAndDeploy "c:\Users\DELL\Documents\Nova pasta\golffox_admin\golffox-admin\apps\driver" "golffox-motorista" $Scope
LinkAndDeploy "c:\Users\DELL\Documents\Nova pasta\golffox_admin\golffox-admin\apps\passenger" "golffox-passageiro" $Scope
LinkAndDeploy "c:\Users\DELL\Documents\Nova pasta\golffox_admin\golffox-admin\apps\operator" "golffox-operador" $Scope

if ($CheckHealth) {
  Write-Host "\nVerificando /api/health em produção..." -ForegroundColor Cyan
  $endpoints = @(
    "https://golffox-admin.vercel.app/api/health",
    "https://golffox-transportadora.vercel.app/api/health",
    "https://golffox-motorista.vercel.app/api/health",
    "https://golffox-passageiro.vercel.app/api/health",
    "https://golffox-operador.vercel.app/api/health"
  )
  foreach ($url in $endpoints) {
    try {
      $resp = Invoke-WebRequest -Uri $url -UseBasicParsing
      Write-Host "$url -> $($resp.StatusCode)" -ForegroundColor Green
    } catch {
      Write-Host "$url -> falhou: $($_.Exception.Message)" -ForegroundColor Red
    }
  }
}