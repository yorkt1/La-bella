import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) return NextResponse.json({ error: listError.message }, { status: 500 })

  const user = data.users.find(u => u.email === 'labella@gmail.com')
  if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })

  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    password: 'bel132@',
    email_confirm: true,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, message: 'Senha redefinida! Pode logar agora.' })
}
