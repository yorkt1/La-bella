export interface Service {
  id: string
  name: string
  slug: string
  description: string | null
  category: 'facial' | 'cilios' | 'sobrancelha' | 'corpo' | 'outros' | null
  price: number
  duration_minutes: number
  image_url: string | null
  is_active: boolean
  is_featured: boolean
  sort_order: number
}

export interface Slot {
  starts_at: string
  ends_at: string
  available: boolean
}

export interface Client {
  id: string
  name: string
  phone: string
  email: string | null
  birth_date: string | null
  loyalty_points: number
  loyalty_tier: 'rose' | 'gold' | 'platinum'
  status: 'active' | 'inactive' | 'blocked'
  accepts_marketing: boolean
  tags: string[] | null
  notes: string | null
  created_at: string
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'

export interface Booking {
  id: string
  client_id: string
  service_id: string
  professional_id: string | null
  starts_at: string
  ends_at: string
  status: BookingStatus
  payment_method: 'pix' | 'credit' | 'debit' | 'cash' | 'transfer' | null
  amount_paid: number | null
  discount_amount: number
  coupon_code: string | null
  notes: string | null
  created_at: string
  clients?: Pick<Client, 'id' | 'name' | 'phone'>
  services?: Pick<Service, 'id' | 'name' | 'duration_minutes' | 'price'>
}

export interface Staff {
  id: string
  user_id: string | null
  name: string
  role: 'admin' | 'professional'
  bio: string | null
  avatar_url: string | null
  is_active: boolean
}

export interface Promotion {
  id: string
  title: string
  discount_type: 'percent' | 'fixed'
  discount_value: number
  coupon_code: string
  starts_at: string
  ends_at: string
  segment: 'all' | 'vip' | 'inactive' | 'birthday'
  max_uses: number | null
  uses_count: number
  is_visible: boolean
  created_at: string
}

export interface LoyaltyTransaction {
  id: string
  client_id: string
  booking_id: string | null
  type: 'earn' | 'redeem' | 'bonus' | 'expire'
  points: number
  description: string
  expires_at: string | null
  created_at: string
}
