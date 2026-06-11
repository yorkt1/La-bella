-- ============================================================
-- Booking hardening
-- 1) Remove o insert anônimo direto (vetor de spam): o agendamento
--    real passa por /api/bookings (server-side, service role).
-- 2) Impede agendamentos sobrepostos (anti-corrida) por profissional.
-- Idempotente. Rodar depois de 20260526000000_initial_schema.sql.
-- ============================================================

-- 1) Dropar a policy permissiva que deixava qualquer anon inserir booking.
drop policy if exists "bookings_anon_insert" on bookings;

-- 2) Anti-corrida via exclusion constraint (precisa de btree_gist).
create extension if not exists btree_gist;

-- professional_id pode ser NULL (salão de 1 profissional, ex.: La Belle).
-- Como NULL <> NULL num "=", agendamentos sem profissional não conflitariam
-- entre si. Usamos um sentinela via coalesce, tratando "sem profissional" como
-- um único recurso — correto pra um salão de uma pessoa.
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
