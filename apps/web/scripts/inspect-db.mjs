// Inspeciona quais tabelas da La-bella existem no Supabase atual e quantas linhas têm.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const here = dirname(fileURLToPath(import.meta.url))
const env = {}
for (const line of readFileSync(join(here, '..', '.env.local'), 'utf8').split(/\r?\n/)) {
  const t = line.trim()
  if (!t || t.startsWith('#')) continue
  const i = t.indexOf('='); if (i === -1) continue
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
}
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const tables = ['clients','staff','services','bookings','promotions','loyalty_transactions','working_hours','blocked_slots','whatsapp_messages']
console.log('Banco:', env.NEXT_PUBLIC_SUPABASE_URL, '\n')
for (const t of tables) {
  const { count, error } = await sb.from(t).select('*', { count: 'exact', head: true })
  if (error) console.log(`${t.padEnd(22)} : AUSENTE (${error.message.slice(0, 50)})`)
  else console.log(`${t.padEnd(22)} : existe — ${count} linha(s)`)
}
