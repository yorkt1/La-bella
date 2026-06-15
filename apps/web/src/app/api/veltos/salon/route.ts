import { missingSalonResponse, rpcJson, salonId } from '../_utils'

export async function GET() {
  const id = salonId()
  if (!id) return missingSalonResponse()
  return rpcJson('public_salon', { p_salon: id })
}
