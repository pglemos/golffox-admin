-- Golffox Database Schema (2025)
-- Este script redefine a estrutura principal utilizada pela aplicação Next.js.
-- ⚠️ Ele remove tabelas antigas incompatíveis com a nova arquitetura.

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Remover estruturas antigas para evitar conflitos
DROP TABLE IF EXISTS passengers CASCADE;
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        DROP TYPE user_role;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vehicle_status') THEN
        DROP TYPE vehicle_status;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'route_status') THEN
        DROP TYPE route_status;
    END IF;
END $$;

-- Tipos atualizados
CREATE TYPE user_role AS ENUM ('admin', 'operator', 'driver', 'passenger');
CREATE TYPE vehicle_status AS ENUM ('active', 'maintenance', 'inactive');
CREATE TYPE route_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- Função utilitária para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tabelas principais
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    role user_role NOT NULL DEFAULT 'passenger',
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model TEXT NOT NULL,
    plate TEXT NOT NULL UNIQUE,
    status vehicle_status NOT NULL DEFAULT 'active',
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    status route_status NOT NULL DEFAULT 'scheduled',
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE passengers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    route_id UUID REFERENCES routes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Triggers de atualização automática
CREATE TRIGGER companies_set_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER users_set_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER drivers_set_updated_at
    BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER vehicles_set_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER routes_set_updated_at
    BEFORE UPDATE ON routes
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER passengers_set_updated_at
    BEFORE UPDATE ON passengers
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Índices auxiliares
CREATE INDEX users_role_idx ON users (role);
CREATE INDEX users_company_idx ON users (company_id);
CREATE INDEX drivers_company_idx ON drivers (company_id);
CREATE INDEX vehicles_company_idx ON vehicles (company_id);
CREATE INDEX routes_company_status_idx ON routes (company_id, status);
CREATE INDEX passengers_company_idx ON passengers (company_id);

-- Dados base para facilitar demonstrações do dashboard
INSERT INTO companies (id, name)
VALUES
    ('c3b7f0e8-8c3f-4b2f-a112-06c3d04a0b10', 'Golffox Matriz')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO drivers (id, name, company_id)
VALUES
    ('d2f22d0e-b8c5-4fd5-8944-6e4f9ed9b8a1', 'Marcos Silva', 'c3b7f0e8-8c3f-4b2f-a112-06c3d04a0b10'),
    ('d92ebc2e-1f3b-4f3f-8f10-3a0e8b7c4d21', 'Ana Rodrigues', 'c3b7f0e8-8c3f-4b2f-a112-06c3d04a0b10')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, company_id = EXCLUDED.company_id;

INSERT INTO vehicles (id, model, plate, status, company_id)
VALUES
    ('v1fa9c74-5bde-4bb3-8c52-0d6cba0f1e98', 'Mercedes Sprinter', 'GFX-1020', 'active', 'c3b7f0e8-8c3f-4b2f-a112-06c3d04a0b10'),
    ('v2d4a8f1-c2ab-4d62-9fb7-1c8d2ae9f7b3', 'Renault Master', 'GFX-2033', 'maintenance', 'c3b7f0e8-8c3f-4b2f-a112-06c3d04a0b10')
ON CONFLICT (id) DO UPDATE
SET model = EXCLUDED.model,
    plate = EXCLUDED.plate,
    status = EXCLUDED.status,
    company_id = EXCLUDED.company_id;

INSERT INTO routes (id, name, status, company_id, driver_id, vehicle_id, scheduled_at)
VALUES
    (
        'r1b49b6f-1c5b-4c0d-9b3f-421ad5a74a90',
        'Transfer Aeroporto',
        'in_progress',
        'c3b7f0e8-8c3f-4b2f-a112-06c3d04a0b10',
        'd2f22d0e-b8c5-4fd5-8944-6e4f9ed9b8a1',
        'v1fa9c74-5bde-4bb3-8c52-0d6cba0f1e98',
        NOW() - INTERVAL '20 minutes'
    ),
    (
        'r2f6c2a9-0f2a-4f1d-8a34-7d6cbe28f1a2',
        'Shuttle Centro Corporativo',
        'scheduled',
        'c3b7f0e8-8c3f-4b2f-a112-06c3d04a0b10',
        'd92ebc2e-1f3b-4f3f-8f10-3a0e8b7c4d21',
        'v2d4a8f1-c2ab-4d62-9fb7-1c8d2ae9f7b3',
        NOW() + INTERVAL '40 minutes'
    )
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    status = EXCLUDED.status,
    company_id = EXCLUDED.company_id,
    driver_id = EXCLUDED.driver_id,
    vehicle_id = EXCLUDED.vehicle_id,
    scheduled_at = EXCLUDED.scheduled_at;

INSERT INTO passengers (id, name, email, company_id, route_id)
VALUES
    (
        'p1d8b5f0-9c4a-4d2f-9b6e-72c9ad3f1a22',
        'Lucas Andrade',
        'lucas.andrade@golffox.com',
        'c3b7f0e8-8c3f-4b2f-a112-06c3d04a0b10',
        'r1b49b6f-1c5b-4c0d-9b3f-421ad5a74a90'
    ),
    (
        'p2e4c7a1-2f5d-4b1c-8d73-1c0f9b7a5d43',
        'Patrícia Souza',
        'patricia.souza@golffox.com',
        'c3b7f0e8-8c3f-4b2f-a112-06c3d04a0b10',
        'r2f6c2a9-0f2a-4f1d-8a34-7d6cbe28f1a2'
    )
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    email = EXCLUDED.email,
    company_id = EXCLUDED.company_id,
    route_id = EXCLUDED.route_id;
