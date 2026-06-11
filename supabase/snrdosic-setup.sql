-- ============================================================
-- Setup do snrdosic — aplica o schema completo da La Belle.
-- As tabelas estavam vazias, então resetamos antes (seguro).
-- Cole TUDO no Supabase (snrdosic) -> SQL Editor -> New query -> Run.
-- ============================================================
drop table if exists whatsapp_messages, loyalty_transactions, blocked_slots, working_hours, bookings, promotions, services, staff, clients cascade;

-- ============================================================
-- La Bella InfinÃ­ â€” Schema inicial
-- ============================================================

-- ExtensÃµes
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABELA: clients
-- ============================================================
CREATE TABLE clients (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             VARCHAR(150)  NOT NULL,
  phone            VARCHAR(20)   NOT NULL UNIQUE,
  email            VARCHAR(200),
  birth_date       DATE,
  skin_type        VARCHAR(20)   CHECK (skin_type IN ('normal','oily','dry','mixed','sensitive')),
  allergies        TEXT,
  notes            TEXT,
  how_found        VARCHAR(50)   CHECK (how_found IN ('instagram','referral','google','other')),
  accepts_marketing BOOLEAN      NOT NULL DEFAULT TRUE,
  tags             TEXT[],
  status           VARCHAR(20)   NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','blocked')),
  loyalty_points   INTEGER       NOT NULL DEFAULT 0,
  loyalty_tier     VARCHAR(20)   NOT NULL DEFAULT 'rose' CHECK (loyalty_tier IN ('rose','gold','platinum')),
  avatar_url       TEXT,
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: staff
-- ============================================================
CREATE TABLE staff (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name        VARCHAR(150) NOT NULL,
  role        VARCHAR(30)  NOT NULL DEFAULT 'professional' CHECK (role IN ('admin','professional')),
  bio         TEXT,
  avatar_url  TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
-- TABELA: services
-- ============================================================
CREATE TABLE services (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              VARCHAR(200)   NOT NULL,
  slug              VARCHAR(200)   NOT NULL UNIQUE,
  description       TEXT,
  category          VARCHAR(100)   CHECK (category IN ('facial','cilios','sobrancelha','corpo','outros')),
  price             DECIMAL(10,2)  NOT NULL CHECK (price >= 0),
  duration_minutes  INTEGER        NOT NULL CHECK (duration_minutes > 0),
  image_url         TEXT,
  before_after_urls TEXT[],
  is_active         BOOLEAN        NOT NULL DEFAULT TRUE,
  is_featured       BOOLEAN        NOT NULL DEFAULT FALSE,
  sort_order        INTEGER        NOT NULL DEFAULT 0
);

-- ============================================================
-- TABELA: bookings
-- ============================================================
CREATE TABLE bookings (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id        UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  service_id       UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  professional_id  UUID REFERENCES staff(id) ON DELETE SET NULL,
  starts_at        TIMESTAMPTZ NOT NULL,
  ends_at          TIMESTAMPTZ NOT NULL,
  status           VARCHAR(20) NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','in_progress','completed','cancelled','no_show')),
  payment_method   VARCHAR(30) CHECK (payment_method IN ('pix','credit','debit','cash','transfer')),
  amount_paid      DECIMAL(10,2) CHECK (amount_paid >= 0),
  discount_amount  DECIMAL(10,2) NOT NULL DEFAULT 0,
  coupon_code      VARCHAR(50),
  notes            TEXT,
  cancelled_reason TEXT,
  reminder_d1_sent BOOLEAN NOT NULL DEFAULT FALSE,
  reminder_h2_sent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT bookings_ends_after_starts CHECK (ends_at > starts_at)
);

-- ============================================================
-- TABELA: promotions
-- ============================================================
CREATE TABLE promotions (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          VARCHAR(200)   NOT NULL,
  discount_type  VARCHAR(10)    NOT NULL CHECK (discount_type IN ('percent','fixed')),
  discount_value DECIMAL(10,2)  NOT NULL CHECK (discount_value > 0),
  service_ids    UUID[]         NOT NULL DEFAULT '{}',
  starts_at      TIMESTAMPTZ    NOT NULL,
  ends_at        TIMESTAMPTZ    NOT NULL,
  max_uses       INTEGER        CHECK (max_uses > 0),
  uses_count     INTEGER        NOT NULL DEFAULT 0,
  segment        VARCHAR(30)    NOT NULL DEFAULT 'all'
                 CHECK (segment IN ('all','vip','inactive','birthday')),
  coupon_code    VARCHAR(50)    NOT NULL UNIQUE,
  is_visible     BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  CONSTRAINT promotions_ends_after_starts CHECK (ends_at > starts_at)
);

-- ============================================================
-- TABELA: loyalty_transactions
-- ============================================================
CREATE TABLE loyalty_transactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  booking_id  UUID REFERENCES bookings(id) ON DELETE SET NULL,
  type        VARCHAR(30) NOT NULL CHECK (type IN ('earn','redeem','bonus','expire')),
  points      INTEGER     NOT NULL,
  description TEXT        NOT NULL,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: working_hours
-- ============================================================
CREATE TABLE working_hours (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id     UUID    NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  day_of_week  INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time   TIME    NOT NULL,
  end_time     TIME    NOT NULL,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (staff_id, day_of_week),
  CONSTRAINT working_hours_end_after_start CHECK (end_time > start_time)
);

-- ============================================================
-- TABELA: blocked_slots (feriados, almoÃ§o, fÃ©rias)
-- ============================================================
CREATE TABLE blocked_slots (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id        UUID REFERENCES staff(id) ON DELETE CASCADE,
  starts_at       TIMESTAMPTZ NOT NULL,
  ends_at         TIMESTAMPTZ NOT NULL,
  reason          TEXT,
  is_recurring    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELA: whatsapp_messages
-- ============================================================
CREATE TABLE whatsapp_messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   UUID REFERENCES clients(id) ON DELETE SET NULL,
  booking_id  UUID REFERENCES bookings(id) ON DELETE SET NULL,
  direction   VARCHAR(10) NOT NULL CHECK (direction IN ('outbound','inbound')),
  message     TEXT NOT NULL,
  template_id VARCHAR(50),
  status      VARCHAR(20) NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending','sent','delivered','read','failed')),
  sent_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ÃNDICES DE PERFORMANCE
-- ============================================================
CREATE INDEX idx_bookings_client_id       ON bookings(client_id);
CREATE INDEX idx_bookings_starts_at       ON bookings(starts_at);
CREATE INDEX idx_bookings_status          ON bookings(status);
CREATE INDEX idx_bookings_professional    ON bookings(professional_id, starts_at);
CREATE INDEX idx_clients_phone            ON clients(phone);
CREATE INDEX idx_clients_loyalty_tier     ON clients(loyalty_tier);
CREATE INDEX idx_clients_status           ON clients(status);
CREATE INDEX idx_loyalty_client           ON loyalty_transactions(client_id);
CREATE INDEX idx_services_slug            ON services(slug);
CREATE INDEX idx_services_category        ON services(category);
CREATE INDEX idx_promotions_coupon        ON promotions(coupon_code);
CREATE INDEX idx_whatsapp_client          ON whatsapp_messages(client_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE clients              ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff                ENABLE ROW LEVEL SECURITY;
ALTER TABLE services             ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings             ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours        ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages    ENABLE ROW LEVEL SECURITY;

-- ServiÃ§os: leitura pÃºblica para serviÃ§os ativos
CREATE POLICY "services_public_read" ON services
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "services_admin_all" ON services
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE user_id = auth.uid() AND role = 'admin')
  );

-- PromoÃ§Ãµes: leitura pÃºblica para promoÃ§Ãµes visÃ­veis
CREATE POLICY "promotions_public_read" ON promotions
  FOR SELECT USING (is_visible = TRUE AND ends_at > NOW());

CREATE POLICY "promotions_admin_all" ON promotions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Clientes: admin vÃª todos, profissional vÃª apenas os seus
CREATE POLICY "clients_admin_all" ON clients
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE user_id = auth.uid())
  );

-- Agendamentos: profissional vÃª apenas os seus; admin vÃª todos
CREATE POLICY "bookings_professional_read" ON bookings
  FOR SELECT USING (
    professional_id IN (SELECT id FROM staff WHERE user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM staff WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "bookings_admin_write" ON bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE user_id = auth.uid())
  );

-- Agendamento anÃ´nimo pelo site pÃºblico
CREATE POLICY "bookings_anon_insert" ON bookings
  FOR INSERT WITH CHECK (TRUE);

-- Financeiro: apenas admin
CREATE POLICY "loyalty_admin_all" ON loyalty_transactions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE user_id = auth.uid())
  );

CREATE POLICY "whatsapp_admin_all" ON whatsapp_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM staff WHERE user_id = auth.uid())
  );

-- ============================================================
-- SEED â€” Dados iniciais de exemplo
-- ============================================================

-- ServiÃ§os base
INSERT INTO services (name, slug, category, price, duration_minutes, is_active, is_featured, sort_order) VALUES
  ('Limpeza de Pele Profunda',         'limpeza-de-pele',         'facial',      180.00, 90,  TRUE, TRUE,  1),
  ('Peeling Facial',                    'peeling-facial',          'facial',      220.00, 60,  TRUE, TRUE,  2),
  ('HidrataÃ§Ã£o Facial Intensiva',       'hidratacao-facial',       'facial',      160.00, 60,  TRUE, FALSE, 3),
  ('ExtensÃ£o de CÃ­lios Fio a Fio',     'extensao-cilios',         'cilios',      250.00, 150, TRUE, TRUE,  4),
  ('Volume Russo',                      'volume-russo',            'cilios',      320.00, 180, TRUE, FALSE, 5),
  ('ManutenÃ§Ã£o de CÃ­lios',             'manutencao-cilios',       'cilios',      130.00, 90,  TRUE, FALSE, 6),
  ('Design de Sobrancelha',            'design-sobrancelha',      'sobrancelha', 80.00,  45,  TRUE, FALSE, 7),
  ('Henna de Sobrancelha',             'henna-sobrancelha',       'sobrancelha', 60.00,  30,  TRUE, FALSE, 8),
  ('Drenagem LinfÃ¡tica',               'drenagem-linfatica',      'corpo',       150.00, 60,  TRUE, TRUE,  9);

-- PromoÃ§Ã£o de boas-vindas
INSERT INTO promotions (title, discount_type, discount_value, service_ids, starts_at, ends_at, segment, coupon_code, is_visible) VALUES
  ('Boas-vindas â€” 10% off', 'percent', 10, '{}', NOW(), NOW() + INTERVAL '1 year', 'all', 'BEMVINDA', TRUE);


-- === Booking hardening ===
-- ============================================================
-- Booking hardening
-- 1) Remove o insert anÃ´nimo direto (vetor de spam): o agendamento
--    real passa por /api/bookings (server-side, service role).
-- 2) Impede agendamentos sobrepostos (anti-corrida) por profissional.
-- Idempotente. Rodar depois de 20260526000000_initial_schema.sql.
-- ============================================================

-- 1) Dropar a policy permissiva que deixava qualquer anon inserir booking.
drop policy if exists "bookings_anon_insert" on bookings;

-- 2) Anti-corrida via exclusion constraint (precisa de btree_gist).
create extension if not exists btree_gist;

-- professional_id pode ser NULL (salÃ£o de 1 profissional, ex.: La Belle).
-- Como NULL <> NULL num "=", agendamentos sem profissional nÃ£o conflitariam
-- entre si. Usamos um sentinela via coalesce, tratando "sem profissional" como
-- um Ãºnico recurso â€” correto pra um salÃ£o de uma pessoa.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_no_overlap'
  ) then
    alter table bookings
      add constraint bookings_no_overlap
      exclude using gist (
        (coalesce(professional_id, '00000000-0000-0000-0000-000000000000'::uuid)) with =,
        tstzrange(starts_at, ends_at) with &&
      )
      where (status <> 'cancelled' and status <> 'no_show');
  end if;
end $$;

