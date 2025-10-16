/**
 * Script para verificar a conexão com o Supabase
 * Execução: npm run verify-supabase
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erro: Variáveis de ambiente do Supabase não configuradas');
  console.log('Por favor, configure as seguintes variáveis no arquivo .env.local:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifySupabaseConnection() {
  console.log('🔍 Verificando conexão com o Supabase...');
  
  try {
    // Tentar fazer uma consulta simples para verificar a conexão
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) throw error;
    
    console.log('✅ Conexão com o Supabase estabelecida com sucesso!');
    console.log('🔗 URL do Supabase:', supabaseUrl);
    
    // Verificar tabelas essenciais
    await verifyEssentialTables();
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com o Supabase:', error.message);
    console.log('Por favor, verifique:');
    console.log('1. Se as credenciais estão corretas');
    console.log('2. Se o projeto Supabase está ativo');
    console.log('3. Se há restrições de rede ou firewall');
    return false;
  }
}

async function verifyEssentialTables() {
  console.log('🔍 Verificando tabelas essenciais...');
  
  const essentialTables = ['profiles', 'trips', 'vehicles'];
  const missingTables = [];
  
  for (const table of essentialTables) {
    const { data, error } = await supabase
      .from(table)
      .select('count', { count: 'exact', head: true });
    
    if (error && error.code === '42P01') { // Código para tabela não existente
      missingTables.push(table);
    }
  }
  
  if (missingTables.length > 0) {
    console.warn('⚠️ Tabelas essenciais não encontradas:', missingTables.join(', '));
    console.log('Execute npm run db:setup para configurar o banco de dados');
  } else {
    console.log('✅ Todas as tabelas essenciais estão presentes!');
  }
}

// Executar verificação
verifySupabaseConnection()
  .then(success => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Erro inesperado:', error);
    process.exit(1);
  });