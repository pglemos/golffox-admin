-- Políticas de Segurança RLS (Row Level Security) para Golffox
-- Este arquivo configura as políticas de acesso baseadas no papel do usuário

-- Habilitar RLS em todas as tabelas
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_profiles ENABLE ROW LEVEL SECURITY;

-- Função auxiliar para obter o papel do usuário atual
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role 
        FROM users 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função auxiliar para obter a empresa do usuário atual
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT company_id 
        FROM users 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função auxiliar para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função auxiliar para verificar se o usuário é operador
CREATE OR REPLACE FUNCTION is_operator()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'operator';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função auxiliar para verificar se o usuário é motorista
CREATE OR REPLACE FUNCTION is_driver()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'driver';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função auxiliar para verificar se o usuário é passageiro
CREATE OR REPLACE FUNCTION is_passenger()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN get_user_role() = 'passenger';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- POLÍTICAS PARA TABELA COMPANIES
-- ========================================

-- Admins podem ver todas as empresas
CREATE POLICY "Admins can view all companies" ON companies
    FOR SELECT USING (is_admin());

-- Operadores podem ver apenas sua própria empresa
CREATE POLICY "Operators can view their company" ON companies
    FOR SELECT USING (is_operator() AND id = get_user_company_id());

-- Admins podem inserir empresas
CREATE POLICY "Admins can insert companies" ON companies
    FOR INSERT WITH CHECK (is_admin());

-- Admins podem atualizar empresas
CREATE POLICY "Admins can update companies" ON companies
    FOR UPDATE USING (is_admin());

-- Admins podem deletar empresas
CREATE POLICY "Admins can delete companies" ON companies
    FOR DELETE USING (is_admin());

-- ========================================
-- POLÍTICAS PARA TABELA USERS
-- ========================================

-- Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (id = auth.uid());

-- Admins podem ver todos os usuários
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (is_admin());

-- Operadores podem ver usuários de sua empresa
CREATE POLICY "Operators can view company users" ON users
    FOR SELECT USING (is_operator() AND company_id = get_user_company_id());

-- Admins podem inserir usuários
CREATE POLICY "Admins can insert users" ON users
    FOR INSERT WITH CHECK (is_admin());

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (id = auth.uid());

-- Admins podem atualizar qualquer usuário
CREATE POLICY "Admins can update any user" ON users
    FOR UPDATE USING (is_admin());

-- ========================================
-- POLÍTICAS PARA TABELA DRIVERS
-- ========================================

-- Admins podem ver todos os motoristas
CREATE POLICY "Admins can view all drivers" ON drivers
    FOR SELECT USING (is_admin());

-- Operadores podem ver motoristas de sua empresa
CREATE POLICY "Operators can view company drivers" ON drivers
    FOR SELECT USING (is_operator() AND linked_company = (SELECT name FROM companies WHERE id = get_user_company_id()));

-- Motoristas podem ver seu próprio perfil
CREATE POLICY "Drivers can view their own profile" ON drivers
    FOR SELECT USING (is_driver() AND user_id = auth.uid());

-- Admins podem inserir motoristas
CREATE POLICY "Admins can insert drivers" ON drivers
    FOR INSERT WITH CHECK (is_admin());

-- Admins podem atualizar motoristas
CREATE POLICY "Admins can update drivers" ON drivers
    FOR UPDATE USING (is_admin());

-- Motoristas podem atualizar alguns campos do próprio perfil
CREATE POLICY "Drivers can update their own profile" ON drivers
    FOR UPDATE USING (is_driver() AND user_id = auth.uid());

-- ========================================
-- POLÍTICAS PARA TABELA VEHICLES
-- ========================================

-- Admins podem ver todos os veículos
CREATE POLICY "Admins can view all vehicles" ON vehicles
    FOR SELECT USING (is_admin());

-- Operadores podem ver veículos relacionados às suas rotas
CREATE POLICY "Operators can view company vehicles" ON vehicles
    FOR SELECT USING (
        is_operator() AND 
        route_id IN (
            SELECT id FROM routes WHERE company_id = get_user_company_id()
        )
    );

-- Motoristas podem ver veículos atribuídos a eles
CREATE POLICY "Drivers can view their vehicles" ON vehicles
    FOR SELECT USING (
        is_driver() AND 
        driver_id IN (
            SELECT id FROM drivers WHERE user_id = auth.uid()
        )
    );

-- Admins podem inserir/atualizar/deletar veículos
CREATE POLICY "Admins can manage vehicles" ON vehicles
    FOR ALL USING (is_admin());

-- ========================================
-- POLÍTICAS PARA TABELA PASSENGERS
-- ========================================

-- Admins podem ver todos os passageiros
CREATE POLICY "Admins can view all passengers" ON passengers
    FOR SELECT USING (is_admin());

-- Operadores podem ver passageiros de sua empresa
CREATE POLICY "Operators can view company passengers" ON passengers
    FOR SELECT USING (is_operator() AND company_id = get_user_company_id());

-- Passageiros podem ver seu próprio perfil
CREATE POLICY "Passengers can view their own profile" ON passengers
    FOR SELECT USING (is_passenger() AND user_id = auth.uid());