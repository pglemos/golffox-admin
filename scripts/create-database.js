/**
 * Script para criação inicial do banco de dados no Supabase
 * Execução: npm run db:create
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

async function createDatabase() {
  console.log('🚀 Iniciando criação do banco de dados GolfFox...');
  
  try {
    // Verificar conexão com o Supabase
    console.log('🔍 Verificando conexão com o Supabase...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Conexão com o Supabase estabelecida com sucesso!');
    await setupDatabase();
    
    console.log('🎉 Criação do banco de dados concluída com sucesso!');
    console.log('Você pode iniciar o projeto com: npm run dev');
    
  } catch (error) {
    console.error('❌ Erro durante a criação do banco de dados:', error.message);
    console.log('Por favor, verifique as credenciais do Supabase e tente novamente.');
    process.exit(1);
  }
}

async function setupDatabase() {
  console.log('🛠️ Criando estrutura do banco de dados...');
  
  // Criar extensão para UUID
  console.log('Habilitando extensão uuid-ossp...');
  await supabase.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  
  // Criar tabela de perfis
  console.log('Criando tabela profiles...');
  await supabase.query(`
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID REFERENCES auth.users ON DELETE CASCADE,
      name TEXT,
      email TEXT UNIQUE,
      role TEXT CHECK (role IN ('admin', 'driver', 'passenger')),
      phone TEXT,
      avatar_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
      PRIMARY KEY (id)
    );
  `);
  
  // Criar tabela de veículos
  console.log('Criando tabela vehicles...');
  await supabase.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id UUID DEFAULT uuid_generate_v4(),
      model TEXT NOT NULL,
      plate TEXT UNIQUE NOT NULL,
      year INTEGER,
      color TEXT,
      capacity INTEGER,
      status TEXT CHECK (status IN ('active', 'maintenance', 'inactive')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
      PRIMARY KEY (id)
    );
  `);
  
  // Criar tabela de viagens
  console.log('Criando tabela trips...');
  await supabase.query(`
    CREATE TABLE IF NOT EXISTS trips (
      id UUID DEFAULT uuid_generate_v4(),
      driver_id UUID REFERENCES profiles(id),
      vehicle_id UUID REFERENCES vehicles(id),
      passenger_id UUID REFERENCES profiles(id),
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      origin_coords GEOGRAPHY(POINT),
      destination_coords GEOGRAPHY(POINT),
      scheduled_at TIMESTAMP WITH TIME ZONE,
      started_at TIMESTAMP WITH TIME ZONE,
      completed_at TIMESTAMP WITH TIME ZONE,
      status TEXT CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
      PRIMARY KEY (id)
    );
  `);
  
  // Criar políticas RLS (Row Level Security)
  console.log('Configurando políticas de segurança...');
  
  // Habilitar RLS nas tabelas
  await supabase.query(`ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;`);
  await supabase.query(`ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;`);
  await supabase.query(`ALTER TABLE trips ENABLE ROW LEVEL SECURITY;`);
  
  // Políticas para profiles
  await supabase.query(`
    CREATE POLICY IF NOT EXISTS "Usuários podem ver seus próprios perfis" ON profiles
    FOR SELECT USING (auth.uid() = id);
    
    CREATE POLICY IF NOT EXISTS "Admins podem ver todos os perfis" ON profiles
    FOR SELECT USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
  `);
  
  // Políticas para vehicles
  await supabase.query(`
    CREATE POLICY IF NOT EXISTS "Todos podem ver veículos" ON vehicles
    FOR SELECT USING (true);
    
    CREATE POLICY IF NOT EXISTS "Apenas admins podem gerenciar veículos" ON vehicles
    FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
  `);
  
  // Políticas para trips
  await supabase.query(`
    CREATE POLICY IF NOT EXISTS "Usuários podem ver suas próprias viagens" ON trips
    FOR SELECT USING (auth.uid() = passenger_id OR auth.uid() = driver_id);
    
    CREATE POLICY IF NOT EXISTS "Admins podem ver todas as viagens" ON trips
    FOR SELECT USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
    
    CREATE POLICY IF NOT EXISTS "Admins podem gerenciar todas as viagens" ON trips
    FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
  `);
  
  console.log('✅ Banco de dados criado com sucesso!');
}

// Executar criação do banco de dados
createDatabase();