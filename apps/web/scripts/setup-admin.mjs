// Setup do login admin no Supabase (lê chaves do .env.local).
// Cria/garante um usuário admin + a linha em `staff`, e confere o schema.
// Uso: node apps/web/scripts/setup-admin.mjs
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const here = dirname(fileURLToPath(import.meta.url))
const env = {}
for (const line of readFileSync(join(here, '..', '.env.local'), 'utf8').split(/\r?\n/)) {
  const t = line.trim()
  if (!t || t.startsWith('#')) continue
  const i = t.indexOf('=')
  if (i === -1) continue
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim() // last wins
}

const URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE = env.SUPABASE_SERVICE_ROLE_KEY
const EMAIL = 'voadm@gmail.com'
const PASSWORD = 'voadm132!#@'

const refOf = (jwt) => {
  try { return JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString()).ref } catch { return '?' }
}

console.log('== Setup admin ==')
console.log('URL        :', URL)
console.log('key ref    :', refOf(SERVICE))

if (!URL || !SERVICE) { console.log('ERRO: faltam URL/SERVICE no .env.local'); process.exit(1) }

const sb = createClient(URL, SERVICE, { auth: { autoRefreshToken: false, persistSession: false } })

// 1) Schema aplicado?
const { error: svcErr } = await sb.from('services').select('id').limit(1)
const schemaOk = !svcErr
console.log('schema     :', schemaOk ? 'OK (tabela services existe)' : 'AUSENTE — ' + svcErr.message)

// 2) Cria (ou acha) o usuário admin
let userId
const { data: created, error: createErr } = await sb.auth.admin.createUser({
  email: EMAIL, password: PASSWORD, email_confirm: true,
})
if (createErr) {
  if (/registered|exists|already/i.test(createErr.message)) {
    const { data: list } = await sb.auth.admin.listUsers()
    userId = list?.users?.find(u => u.email === EMAIL)?.id
    console.log('usuário    : já existia (id ' + userId + ')')
  } else {
    console.log('usuário    : ERRO —', createErr.message)
  }
} else {
  userId = created.user.id
  console.log('usuário    : criado (id ' + userId + ')')
}

// 3) Linha em staff (role admin) — só se o schema existe
if (schemaOk && userId) {
  const { data: ex } = await sb.from('staff').select('id').eq('user_id', userId).limit(1)
  if (ex && ex.length) {
    console.log('staff      : já existia')
  } else {
    const { error: stErr } = await sb.from('staff').insert({
      user_id: userId, name: 'Administrador', role: 'admin', is_active: true,
    })
    console.log('staff      :', stErr ? 'ERRO — ' + stErr.message : 'criado (admin)')
  }
} else if (!schemaOk) {
  console.log('staff      : pulado (aplicar o schema primeiro)')
}

console.log('\n=== LOGIN ===')
console.log('email :', EMAIL)
console.log('senha :', PASSWORD)
console.log('=============')
