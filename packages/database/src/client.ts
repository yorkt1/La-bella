import { createClient as _createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export function createClient(url: string, key: string) {
  return _createClient<Database>(url, key)
}
