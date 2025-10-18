param(
  [Parameter(Mandatory = $false)] [string] $ProjectName,
  [Parameter(Mandatory = $false)] [string] $Org,
  [Parameter(Mandatory = $false)] [string] $Token,
  [Parameter(Mandatory = $false)] [string] $SupabaseUrl,
  [Parameter(Mandatory = $false)] [string] $SupabaseAnonKey,
  [Parameter(Mandatory = $false)] [string] $SupabaseServiceRoleKey,
  [Parameter(Mandatory = $false)] [string] $GoogleMapsApiKey,
  [Parameter(Mandatory = $false)] [string] $SetupAdminToken
)

$ErrorActionPreference = 'Stop'

function Write-Info($msg) { Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Warn($msg) { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg) { Write-Host "[ERROR] $msg" -ForegroundColor Red }

# 1) Pré-requisitos
Write-Info 'Verificando instalação do Vercel CLI'
$vercelInstalled = (Get-Command vercel -ErrorAction SilentlyContinue) -ne $null
if (-not $vercelInstalled) {
  Write-Err 'Vercel CLI não encontrado. Instale com: npm i -g vercel'
  throw 'Vercel CLI ausente'
}

# 2) Autenticação
if ($Token) {
  Write-Info 'Usando VERCEL_TOKEN fornecido'
  $env:VERCEL_TOKEN = $Token
} else {
  Write-Info 'Realizando login no Vercel (se necessário)'
  try { vercel login | Out-Null } catch { Write-Warn 'Login do Vercel pode já estar ativo. Prosseguindo.' }
}

# 3) Link do projeto
if (-not $ProjectName) {
  $ProjectName = Read-Host 'Informe o nome do projeto Vercel (ex.: golffox-admin)'
}
if (-not $Org) {
  $Org = Read-Host 'Informe o ID/slug da organização no Vercel (opcional)'
}

Write-Info "Linkando projeto Vercel: $ProjectName"
if ($Org) {
  vercel link --project $ProjectName --scope $Org --yes | Out-Null
} else {
  vercel link --project $ProjectName --yes | Out-Null
}

# 4) Coleta de credenciais Supabase
if (-not $SupabaseUrl)       { $SupabaseUrl       = Read-Host 'NEXT_PUBLIC_SUPABASE_URL' }
if (-not $SupabaseAnonKey)   { $SupabaseAnonKey   = Read-Host 'NEXT_PUBLIC_SUPABASE_ANON_KEY' }
if (-not $SupabaseServiceRoleKey) { $SupabaseServiceRoleKey = Read-Host 'SUPABASE_SERVICE_ROLE_KEY' }
if (-not $GoogleMapsApiKey)  { $GoogleMapsApiKey  = Read-Host '[Opcional] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY' }
if (-not $SetupAdminToken)   { $SetupAdminToken   = Read-Host 'SETUP_ADMIN_TOKEN (token secreto para provisionamento)' }

# 5) Variáveis para ambientes (Production e Preview)
$envs = @('production', 'preview')
foreach ($envName in $envs) {
  Write-Info "Configurando variáveis no ambiente: $envName"

  vercel env add NEXT_PUBLIC_SUPABASE_URL $SupabaseUrl $envName | Out-Null
  vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY $SupabaseAnonKey $envName | Out-Null

  vercel env add SUPABASE_SERVICE_ROLE_KEY $SupabaseServiceRoleKey $envName | Out-Null

  vercel env add SUPABASE_URL $SupabaseUrl $envName | Out-Null
  vercel env add SUPABASE_SERVICE_ROLE $SupabaseServiceRoleKey $envName | Out-Null

  if ($GoogleMapsApiKey) {
    vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY $GoogleMapsApiKey $envName | Out-Null
  }

  if ($SetupAdminToken) {
    vercel env add SETUP_ADMIN_TOKEN $SetupAdminToken $envName | Out-Null
  }
}

Write-Info 'Todas as variáveis foram configuradas nos ambientes Production e Preview.'
Write-Info 'Para confirmar, execute: vercel env ls'

# 6) Próximos passos
Write-Host "\nPróximos passos:" -ForegroundColor Green
Write-Host "- Faça o deploy: vercel --prod" -ForegroundColor Green
Write-Host "- Após o deploy, provisionar admin com curl (substitua DOMAIN):" -ForegroundColor Green
Write-Host "  curl -X POST https://DOMAIN/api/auth/provision-admin \`" -ForegroundColor Green
Write-Host "       -H 'Content-Type: application/json' \`" -ForegroundColor Green
Write-Host "       -H 'x-setup-token: $SetupAdminToken' \`" -ForegroundColor Green
Write-Host "       -d '{\"email\":\"admin@golffox.com\",\"password\":\"admin123456\",\"name\":\"Administrador Golffox\"}'" -ForegroundColor Green

Write-Info 'Concluído.'
# Conteúdo residual removido para manter o script focado na configuração de variáveis do Vercel e instruções de provisionamento.