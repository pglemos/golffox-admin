-- Align Supabase schema with admin entity creation flows
-- Adds missing tables, enums and columns required by the dashboard create modals

-- Enumerations ------------------------------------------------------------
DO $$
BEGIN
  CREATE TYPE public.user_role AS ENUM ('admin', 'operator', 'driver', 'passenger');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  CREATE TYPE public.company_status AS ENUM ('Ativo', 'Inativo');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  CREATE TYPE public.driver_status AS ENUM ('Ativo', 'Em análise', 'Inativo');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  CREATE TYPE public.contract_type AS ENUM ('CLT', 'terceirizado', 'autônomo');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  CREATE TYPE public.cnh_category AS ENUM ('D', 'E');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  CREATE TYPE public.vehicle_status AS ENUM ('Em Movimento', 'Parado', 'Com Problema', 'Garagem');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  CREATE TYPE public.route_status AS ENUM ('No Horário', 'Atrasado', 'Com Problema');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  CREATE TYPE public.alert_type AS ENUM ('Crítico', 'Atenção', 'Informativo');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

-- Core lookup tables ------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.permission_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  access TEXT[] NOT NULL DEFAULT '{}',
  is_admin_feature BOOLEAN NOT NULL DEFAULT FALSE,
  users_display INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DO $$
BEGIN
  EXECUTE 'CREATE TRIGGER set_timestamp_permission_profiles
    BEFORE UPDATE ON public.permission_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at()';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

ALTER TABLE public.permission_profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  EXECUTE 'CREATE POLICY "Admins manage permission profiles" ON public.permission_profiles
    FOR ALL USING (current_app_role() = ''admin'')
    WITH CHECK (current_app_role() = ''admin'')';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

ALTER TABLE public.permission_profiles
  ADD COLUMN IF NOT EXISTS users_display INTEGER DEFAULT 0;

-- Users synced with Supabase Auth ----------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role public.user_role NOT NULL DEFAULT 'operator',
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  permission_profile_id UUID REFERENCES public.permission_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON public.users(email);

DO $$
BEGIN
  EXECUTE 'CREATE TRIGGER set_timestamp_users
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at()';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  EXECUTE 'CREATE POLICY "Admins manage users" ON public.users
    FOR ALL USING (current_app_role() = ''admin'')
    WITH CHECK (current_app_role() = ''admin'')';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

-- Companies ---------------------------------------------------------------
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS cnpj TEXT,
  ADD COLUMN IF NOT EXISTS contact TEXT,
  ADD COLUMN IF NOT EXISTS address_text TEXT,
  ADD COLUMN IF NOT EXISTS address_lat NUMERIC(10, 8),
  ADD COLUMN IF NOT EXISTS address_lng NUMERIC(11, 8),
  ADD COLUMN IF NOT EXISTS contracted_passengers INTEGER DEFAULT 0;

UPDATE public.companies
SET status = CASE
  WHEN status IN ('active', 'Ativo') THEN 'Ativo'
  WHEN status IN ('inactive', 'Inativo') THEN 'Inativo'
  ELSE COALESCE(status, 'Ativo')
END;

ALTER TABLE public.companies
  ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.companies
  ALTER COLUMN status TYPE public.company_status
  USING CASE
    WHEN status IS NULL THEN 'Ativo'::public.company_status
    WHEN status IN ('Ativo', 'Inativo') THEN status::public.company_status
    ELSE 'Ativo'::public.company_status
  END;
ALTER TABLE public.companies
  ALTER COLUMN status SET DEFAULT 'Ativo'::public.company_status;

-- Drivers -----------------------------------------------------------------
ALTER TABLE public.drivers
  ADD COLUMN IF NOT EXISTS cpf TEXT,
  ADD COLUMN IF NOT EXISTS rg TEXT,
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS cep TEXT,
  ADD COLUMN IF NOT EXISTS cnh TEXT,
  ADD COLUMN IF NOT EXISTS cnh_validity DATE,
  ADD COLUMN IF NOT EXISTS cnh_category public.cnh_category,
  ADD COLUMN IF NOT EXISTS has_ear BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS transport_course_validity DATE,
  ADD COLUMN IF NOT EXISTS last_toxicological_exam DATE,
  ADD COLUMN IF NOT EXISTS photo_url TEXT,
  ADD COLUMN IF NOT EXISTS contract_type public.contract_type,
  ADD COLUMN IF NOT EXISTS credentialing_date DATE,
  ADD COLUMN IF NOT EXISTS linked_company TEXT,
  ADD COLUMN IF NOT EXISTS assigned_routes TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS availability TEXT,
  ADD COLUMN IF NOT EXISTS last_update TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS route_badge TEXT,
  ADD COLUMN IF NOT EXISTS shift_label TEXT;

UPDATE public.drivers
SET status = CASE
  WHEN status IN ('active', 'Ativo') THEN 'Ativo'
  WHEN status IN ('inactive', 'Inativo') THEN 'Inativo'
  WHEN status = 'pending' THEN 'Em análise'
  ELSE COALESCE(status, 'Em análise')
END;

ALTER TABLE public.drivers
  ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.drivers
  ALTER COLUMN status TYPE public.driver_status
  USING CASE
    WHEN status IS NULL THEN 'Em análise'::public.driver_status
    WHEN status IN ('Ativo', 'Em análise', 'Inativo') THEN status::public.driver_status
    ELSE 'Em análise'::public.driver_status
  END;
ALTER TABLE public.drivers
  ALTER COLUMN status SET DEFAULT 'Em análise'::public.driver_status;

-- Vehicles ----------------------------------------------------------------
ALTER TABLE public.vehicles
  ADD COLUMN IF NOT EXISTS model TEXT,
  ADD COLUMN IF NOT EXISTS status public.vehicle_status DEFAULT 'Garagem',
  ADD COLUMN IF NOT EXISTS position_lat NUMERIC(10, 8),
  ADD COLUMN IF NOT EXISTS position_lng NUMERIC(11, 8),
  ADD COLUMN IF NOT EXISTS route_id UUID REFERENCES public.routes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS last_maintenance DATE,
  ADD COLUMN IF NOT EXISTS next_maintenance DATE,
  ADD COLUMN IF NOT EXISTS is_registered BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS last_update_display TEXT;

-- Routes ------------------------------------------------------------------
ALTER TABLE public.routes
  ADD COLUMN IF NOT EXISTS scheduled_start TIME,
  ADD COLUMN IF NOT EXISTS start_location TEXT,
  ADD COLUMN IF NOT EXISTS destination TEXT,
  ADD COLUMN IF NOT EXISTS occupancy TEXT;

UPDATE public.routes
SET status = CASE
  WHEN status IN ('scheduled', 'No Horário') THEN 'No Horário'
  WHEN status IN ('delayed', 'Atrasado') THEN 'Atrasado'
  WHEN status IN ('issue', 'Com Problema') THEN 'Com Problema'
  ELSE COALESCE(status, 'No Horário')
END;

ALTER TABLE public.routes
  ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.routes
  ALTER COLUMN status TYPE public.route_status
  USING CASE
    WHEN status IS NULL THEN 'No Horário'::public.route_status
    WHEN status IN ('No Horário', 'Atrasado', 'Com Problema') THEN status::public.route_status
    ELSE 'No Horário'::public.route_status
  END;
ALTER TABLE public.routes
  ALTER COLUMN status SET DEFAULT 'No Horário'::public.route_status;

-- Operational tables ------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.alert_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  route_id UUID REFERENCES public.routes(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action_label TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DO $$
BEGIN
  EXECUTE 'CREATE TRIGGER set_timestamp_alerts
    BEFORE UPDATE ON public.alerts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at()';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  EXECUTE 'CREATE POLICY "Admins manage alerts" ON public.alerts
    FOR ALL USING (current_app_role() = ''admin'')
    WITH CHECK (current_app_role() = ''admin'')';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

ALTER TABLE public.alerts
  ADD COLUMN IF NOT EXISTS action_label TEXT;

CREATE TABLE IF NOT EXISTS public.route_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE,
  route_name TEXT NOT NULL,
  driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  driver_name TEXT NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  vehicle_plate TEXT NOT NULL,
  execution_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  total_time INTEGER,
  total_distance NUMERIC(10, 2),
  passengers_boarded INTEGER,
  passengers_not_boarded INTEGER,
  total_passengers INTEGER,
  fuel_consumption NUMERIC(8, 2),
  operational_cost NUMERIC(10, 2),
  punctuality INTEGER,
  route_optimization NUMERIC(5, 2),
  detail TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DO $$
BEGIN
  EXECUTE 'CREATE TRIGGER set_timestamp_route_history
    BEFORE UPDATE ON public.route_history
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at()';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

ALTER TABLE public.route_history ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  EXECUTE 'CREATE POLICY "Admins manage route history" ON public.route_history
    FOR ALL USING (current_app_role() = ''admin'')
    WITH CHECK (current_app_role() = ''admin'')';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

ALTER TABLE public.route_history
  ADD COLUMN IF NOT EXISTS detail TEXT;

CREATE TABLE IF NOT EXISTS public.cost_control (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE,
  route_name TEXT NOT NULL,
  period TEXT NOT NULL,
  total_kilometers NUMERIC(10, 2) NOT NULL,
  average_fuel_consumption NUMERIC(8, 2) NOT NULL,
  fuel_cost NUMERIC(8, 2) NOT NULL,
  total_fuel_cost NUMERIC(10, 2) NOT NULL,
  driver_cost NUMERIC(10, 2) NOT NULL,
  vehicle_maintenance_cost NUMERIC(10, 2) NOT NULL,
  operational_cost NUMERIC(10, 2) NOT NULL,
  revenue_per_passenger NUMERIC(8, 2) NOT NULL,
  total_revenue NUMERIC(10, 2) NOT NULL,
  profit_margin NUMERIC(5, 2) NOT NULL,
  cost_per_km NUMERIC(10, 2) NOT NULL,
  cost_per_passenger NUMERIC(10, 2) NOT NULL,
  variation_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DO $$
BEGIN
  EXECUTE 'CREATE TRIGGER set_timestamp_cost_control
    BEFORE UPDATE ON public.cost_control
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at()';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

ALTER TABLE public.cost_control ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  EXECUTE 'CREATE POLICY "Admins manage costs" ON public.cost_control
    FOR ALL USING (current_app_role() = ''admin'')
    WITH CHECK (current_app_role() = ''admin'')';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

ALTER TABLE public.cost_control
  ADD COLUMN IF NOT EXISTS variation_note TEXT;

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL,
  channel TEXT NOT NULL,
  contact TEXT,
  status TEXT NOT NULL DEFAULT 'Aberto',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DO $$
BEGIN
  EXECUTE 'CREATE TRIGGER set_timestamp_support_tickets
    BEFORE UPDATE ON public.support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at()';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  EXECUTE 'CREATE POLICY "Admins manage support" ON public.support_tickets
    FOR ALL USING (current_app_role() = ''admin'')
    WITH CHECK (current_app_role() = ''admin'')';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

CREATE TABLE IF NOT EXISTS public.report_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  frequency TEXT NOT NULL,
  delivery TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DO $$
BEGIN
  EXECUTE 'CREATE TRIGGER set_timestamp_report_schedules
    BEFORE UPDATE ON public.report_schedules
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at()';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

ALTER TABLE public.report_schedules ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  EXECUTE 'CREATE POLICY "Admins manage reports" ON public.report_schedules
    FOR ALL USING (current_app_role() = ''admin'')
    WITH CHECK (current_app_role() = ''admin'')';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

-- Seed permission profiles if empty --------------------------------------
INSERT INTO public.permission_profiles (name, description, access, is_admin_feature)
SELECT name, description, access, is_admin_feature
FROM (
  VALUES
    ('Administrador', 'Acesso completo ao painel administrativo', ARRAY['*'], TRUE),
    ('Operador', 'Gestão operacional de rotas, veículos e alertas', ARRAY['routes', 'vehicles', 'alerts'], FALSE),
    ('Suporte', 'Atendimento e acompanhamento de chamados', ARRAY['support', 'alerts'], FALSE)
) AS seed(name, description, access, is_admin_feature)
ON CONFLICT (name) DO NOTHING;
