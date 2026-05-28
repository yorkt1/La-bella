import { Topbar } from '@/components/admin/layout/topbar'
import { createAdminClient } from '@/lib/supabase/server'
import { UserCog, Mail } from 'lucide-react'

async function getStaff() {
  try {
    const admin = await createAdminClient()
    const { data } = await admin
      .from('staff')
      .select('id, name, role, bio, is_active')
      .order('name', { ascending: true })
    return (data || []) as { id: string; name: string; role: string; bio: string | null; is_active: boolean }[]
  } catch {
    return []
  }
}

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  professional: 'Profissional',
}

export default async function EquipePage() {
  const staff = await getStaff()

  return (
    <>
      <Topbar title="Equipe" subtitle="Profissionais e administradores" />
      <div className="p-6 space-y-6">
        {staff.length === 0 ? (
          <div className="py-24 text-center bg-white border border-[#EAE0DC] rounded-2xl">
            <UserCog size={32} className="text-[#EAE0DC] mx-auto mb-3" />
            <p className="text-sm text-[#7A5C52]/50 mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
              Nenhum profissional cadastrado
            </p>
            <p className="text-xs text-[#7A5C52]/40" style={{ fontFamily: 'var(--font-poppins)' }}>
              Adicione profissionais via Supabase → tabela staff
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map((member) => (
              <div key={member.id} className={`bg-white border rounded-2xl p-5 ${member.is_active ? 'border-[#EAE0DC]' : 'border-[#EAE0DC] opacity-60'}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C89B7B] to-[#7A5C52] flex items-center justify-center shrink-0">
                    <span className="text-white text-base font-light" style={{ fontFamily: 'var(--font-cormorant)' }}>
                      {member.name.split(' ').slice(0, 2).map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1E1E1E] truncate" style={{ fontFamily: 'var(--font-poppins)' }}>{member.name}</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wide ${member.role === 'admin' ? 'bg-[#E3F2FD] text-[#1565C0]' : 'bg-[#F6E6E6] text-[#7A5C52]'}`} style={{ fontFamily: 'var(--font-poppins)' }}>
                      {roleLabels[member.role] ?? member.role}
                    </span>
                  </div>
                </div>
                {member.bio && (
                  <p className="text-xs text-[#7A5C52]/60 leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>{member.bio}</p>
                )}
                {!member.is_active && (
                  <p className="text-[10px] text-[#E65100] mt-2" style={{ fontFamily: 'var(--font-poppins)' }}>Inativo</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-[#FDFAF8] border border-[#EAE0DC] rounded-2xl p-5 flex items-start gap-4">
          <Mail size={16} className="text-[#C89B7B] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#1E1E1E] mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
              Como cadastrar profissionais
            </p>
            <p className="text-xs text-[#7A5C52]/70 leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>
              1. Crie o usuário em <strong>Supabase → Authentication → Users</strong><br />
              2. Insira na tabela <strong>staff</strong>: name, role ('admin' ou 'professional'), user_id do passo anterior
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
