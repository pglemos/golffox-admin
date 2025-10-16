-- Golffox RLS Policies (2025)
-- Este script assume que o schema definido em schema.sql já foi aplicado.

-- Remover políticas e funções antigas para evitar conflitos
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Operators can view company users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admins can update any user" ON users;

DROP POLICY IF EXISTS "Company members view companies" ON companies;
DROP POLICY IF EXISTS "Admins manage companies" ON companies;

DROP POLICY IF EXISTS "Membros da empresa veem motoristas" ON drivers;
DROP POLICY IF EXISTS "Admins gerenciam motoristas" ON drivers;

DROP POLICY IF EXISTS "Membros da empresa veem veículos" ON vehicles;
DROP POLICY IF EXISTS "Admins gerenciam veículos" ON vehicles;

DROP POLICY IF EXISTS "Membros da empresa veem rotas" ON routes;
DROP POLICY IF EXISTS "Admins gerenciam rotas" ON routes;

DROP POLICY IF EXISTS "Passageiro vê seus dados" ON passengers;
DROP POLICY IF EXISTS "Membros da empresa veem passageiros" ON passengers;
DROP POLICY IF EXISTS "Admins gerenciam passageiros" ON passengers;

DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS is_operator();
DROP FUNCTION IF EXISTS is_driver();
DROP FUNCTION IF EXISTS is_passenger();
DROP FUNCTION IF EXISTS get_user_company_id();
DROP FUNCTION IF EXISTS get_user_role();
DROP FUNCTION IF EXISTS get_user_company_name();

-- Garantir que RLS está habilitado
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE passengers ENABLE ROW LEVEL SECURITY;

-- Funções auxiliares
CREATE OR REPLACE FUNCTION public.is_authenticated_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM users u
        WHERE u.id = auth.uid()
          AND u.role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.current_company_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT u.company_id
        FROM users u
        WHERE u.id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_company_operator()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM users u
        WHERE u.id = auth.uid()
          AND u.role IN ('admin', 'operator')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas para companies
CREATE POLICY "Company members view companies" ON companies
    FOR SELECT
    USING (
        is_authenticated_admin()
        OR (
            is_company_operator()
            AND companies.id = current_company_id()
        )
    );

CREATE POLICY "Admins manage companies" ON companies
    FOR ALL
    USING (is_authenticated_admin());

-- Políticas para users
CREATE POLICY "Users view own profile" ON users
    FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Users update own profile" ON users
    FOR UPDATE
    USING (id = auth.uid());

CREATE POLICY "Admins manage users" ON users
    FOR ALL
    USING (is_authenticated_admin());

-- Políticas para drivers
CREATE POLICY "Company members view drivers" ON drivers
    FOR SELECT
    USING (
        is_authenticated_admin()
        OR (
            is_company_operator()
            AND drivers.company_id = current_company_id()
        )
        OR drivers.user_id = auth.uid()
    );

CREATE POLICY "Admins manage drivers" ON drivers
    FOR ALL
    USING (is_authenticated_admin());

-- Políticas para vehicles
CREATE POLICY "Company members view vehicles" ON vehicles
    FOR SELECT
    USING (
        is_authenticated_admin()
        OR (
            is_company_operator()
            AND vehicles.company_id = current_company_id()
        )
    );

CREATE POLICY "Admins manage vehicles" ON vehicles
    FOR ALL
    USING (is_authenticated_admin());

-- Políticas para routes
CREATE POLICY "Company members view routes" ON routes
    FOR SELECT
    USING (
        is_authenticated_admin()
        OR (
            is_company_operator()
            AND routes.company_id = current_company_id()
        )
        OR EXISTS (
            SELECT 1
            FROM drivers d
            WHERE d.id = routes.driver_id
              AND d.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins manage routes" ON routes
    FOR ALL
    USING (is_authenticated_admin());

-- Políticas para passengers
CREATE POLICY "Passenger views own record" ON passengers
    FOR SELECT
    USING (passengers.user_id = auth.uid());

CREATE POLICY "Company members view passengers" ON passengers
    FOR SELECT
    USING (
        is_authenticated_admin()
        OR (
            is_company_operator()
            AND passengers.company_id = current_company_id()
        )
    );

CREATE POLICY "Admins manage passengers" ON passengers
    FOR ALL
    USING (is_authenticated_admin());
