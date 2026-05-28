import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addMinutes, parseISO, format, setHours, setMinutes } from 'date-fns'

const WORKING_HOURS = { start: 9, end: 19 }
const SLOT_INTERVAL = 30

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const serviceId = searchParams.get('serviceId')
  const dateStr = searchParams.get('date')
  const professionalId = searchParams.get('professionalId')

  if (!serviceId || !dateStr) {
    return NextResponse.json({ error: 'serviceId e date são obrigatórios' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: service, error: serviceError } = await supabase
    .from('services')
    .select('duration_minutes')
    .eq('id', serviceId)
    .single()

  if (serviceError || !service) {
    return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 })
  }

  const { duration_minutes } = service as { duration_minutes: number }

  const date = parseISO(dateStr)
  // Domingo = sem atendimento
  if (date.getDay() === 0) return NextResponse.json([])

  const endHour = date.getDay() === 6 ? 16 : WORKING_HOURS.end

  const slots: string[] = []
  let current = setMinutes(setHours(date, WORKING_HOURS.start), 0)
  const dayEnd = setMinutes(setHours(date, endHour), 0)

  while (addMinutes(current, duration_minutes) <= dayEnd) {
    slots.push(format(current, "yyyy-MM-dd'T'HH:mm:ss"))
    current = addMinutes(current, SLOT_INTERVAL)
  }

  const dayStart = format(setHours(date, 0), "yyyy-MM-dd'T'00:00:00")
  const dayEndStr = format(setHours(date, 23), "yyyy-MM-dd'T'23:59:59")

  let bookingsQuery = supabase
    .from('bookings')
    .select('starts_at, ends_at')
    .gte('starts_at', dayStart)
    .lte('starts_at', dayEndStr)
    .not('status', 'in', '("cancelled","no_show")')

  if (professionalId) {
    bookingsQuery = bookingsQuery.eq('professional_id', professionalId)
  }

  const { data: existingBookings } = await bookingsQuery

  const available = slots.map((slot) => {
    const slotStart = parseISO(slot)
    const slotEnd = addMinutes(slotStart, duration_minutes)

    const isOccupied = (existingBookings as { starts_at: string; ends_at: string }[] | null)?.some(
      (b) => slotStart < parseISO(b.ends_at) && slotEnd > parseISO(b.starts_at)
    )

    return {
      starts_at: slot,
      ends_at: format(slotEnd, "yyyy-MM-dd'T'HH:mm:ss"),
      available: !isOccupied,
    }
  })

  return NextResponse.json(available)
}
