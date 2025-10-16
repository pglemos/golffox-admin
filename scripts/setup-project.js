/**
 * Script para configuração inicial do projeto com Supabase
 * Execução: npm run setup-project
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

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

// Interface para interação com o usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function setupProject() {
  console.log('🚀 Iniciando configuração do projeto GolfFox...');
  
  try {
    // Verificar conexão com o Supabase
    console.log('🔍 Verificando conexão com o Supabase...');
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error && error.code === '42P01') {
      // Tabela não existe, precisamos criar
      await setupDatabase();
    } else if (error) {
      throw error;
    } else {
      console.log('✅ Conexão com o Supabase estabelecida com sucesso!');
      await confirmDatabaseSetup();
    }
    
    console.log('🎉 Configuração concluída com sucesso!');
    console.log('Você pode iniciar o projeto com: npm run dev');
    
  } catch (error) {
    console.error('❌ Erro durante a configuração:', error.message);
    console.log('Por favor, verifique as credenciais do Supabase e tente novamente.');
  } finally {
    rl.close();
  }
}

async function confirmDatabaseSetup() {
  return new Promise((resolve) => {
    rl.question('Banco de dados já existe. Deseja recriar as tabelas? (s/N): ', async (answer) => {
      if (answer.toLowerCase() === 's') {
        await setupDatabase();
      } else {
        console.log('Mantendo estrutura atual do banco de dados.');
      }
      resolve();
    });
  });
}

async function setupDatabase() {
  console.log('🛠️ Configurando banco de dados...');
  
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
    CREATE POLICY "Usuários podem ver seus próprios perfis" ON profiles
    FOR SELECT USING (auth.uid() = id);
    
    CREATE POLICY "Admins podem ver todos os perfis" ON profiles
    FOR SELECT USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
  `);
  
  // Políticas para vehicles
  await supabase.query(`
    CREATE POLICY "Todos podem ver veículos" ON vehicles
    FOR SELECT USING (true);
    
    CREATE POLICY "Apenas admins podem gerenciar veículos" ON vehicles
    FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
  `);
  
  // Políticas para trips
  await supabase.query(`
    CREATE POLICY "Usuários podem ver suas próprias viagens" ON trips
    FOR SELECT USING (auth.uid() = passenger_id OR auth.uid() = driver_id);
    
    CREATE POLICY "Admins podem ver todas as viagens" ON trips
    FOR SELECT USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
    
    CREATE POLICY "Admins podem gerenciar todas as viagens" ON trips
    FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
  `);
  
  console.log('✅ Banco de dados configurado com sucesso!');
}

// Executar configuração
setupProject();