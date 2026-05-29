const BASE_URL = process.env.EVOLUTION_API_URL
const API_KEY  = process.env.EVOLUTION_API_KEY
const INSTANCE = process.env.EVOLUTION_INSTANCE

export function isWhatsAppConfigured() {
  return !!(BASE_URL && API_KEY && INSTANCE)
}

export async function sendWhatsApp(to: string, text: string): Promise<boolean> {
  if (!isWhatsAppConfigured()) return false

  const phone = to.replace(/\D/g, '')
  const number = phone.startsWith('55') ? phone : `55${phone}`

  try {
    const res = await fetch(`${BASE_URL}/message/sendText/${INSTANCE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: API_KEY! },
      body: JSON.stringify({ number: `${number}@s.whatsapp.net`, text }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function notifyAdmin(text: string): Promise<boolean> {
  const adminPhone = process.env.ADMIN_WHATSAPP_PHONE
  if (!adminPhone) return false
  return sendWhatsApp(adminPhone, text)
}
