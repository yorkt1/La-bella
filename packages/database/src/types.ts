export type SkinType = 'normal' | 'oily' | 'dry' | 'mixed' | 'sensitive'
export type ClientStatus = 'active' | 'inactive' | 'blocked'
export type LoyaltyTier = 'rose' | 'gold' | 'platinum'
export type HowFound = 'instagram' | 'referral' | 'google' | 'other'

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'

export type PaymentMethod = 'pix' | 'credit' | 'debit' | 'cash' | 'transfer'
export type StaffRole = 'admin' | 'professional'
export type DiscountType = 'percent' | 'fixed'
export type LoyaltyTransactionType = 'earn' | 'redeem' | 'bonus' | 'expire'
export type PromotionSegment = 'all' | 'vip' | 'inactive' | 'birthday'
export type ServiceCategory =
  | 'facial'
  | 'cilios'
  | 'sobrancelha'
  | 'corpo'
  | 'outros'

export interface Client {
  id: string
  name: string
  phone: string
  email: string | null
  birth_date: string | null
  skin_type: SkinType | null
  allergies: string | null
  notes: string | null
  how_found: HowFound | null
  accepts_marketing: boolean
  tags: string[] | null
  status: ClientStatus
  loyalty_points: number
  loyalty_tier: LoyaltyTier
  avatar_url: string | null
  created_at: string
}

export interface Service {
  id: string
  name: string
  slug: string
  description: string | null
  category: ServiceCategory | null
  price: number
  duration_minutes: number
  image_url: string | null
  before_after_urls: string[] | null
  is_active: boolean
  is_featured: boolean
  sort_order: number
}

export interface Staff {
  id: string
  user_id: string
  name: string
  role: StaffRole
  bio: string | null
  avatar_url: string | null
  is_active: boolean
}

export interface Booking {
  id: string
  client_id: string
  service_id: string
  professional_id: string
  starts_at: string
  ends_at: string
  status: BookingStatus
  payment_method: PaymentMethod | null
  amount_paid: number | null
  discount_amount: number
  coupon_code: string | null
  notes: string | null
  cancelled_reason: string | null
  reminder_d1_sent: boolean
  reminder_h2_sent: boolean
  created_at: string
  client?: Client
  service?: Service
  professional?: Staff
}

export interface Promotion {
  id: string
  title: string
  discount_type: DiscountType
  discount_value: number
  service_ids: string[]
  starts_at: string
  ends_at: string
  max_uses: number | null
  uses_count: number
  segment: PromotionSegment
  coupon_code: string
  is_visible: boolean
  created_at: string
}

export interface LoyaltyTransaction {
  id: string
  client_id: string
  booking_id: string | null
  type: LoyaltyTransactionType
  points: number
  description: string
  expires_at: string | null
  created_at: string
}

export interface WorkingHours {
  id: string
  staff_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

export interface AvailabilitySlot {
  starts_at: string
  ends_at: string
  available: boolean
}

export interface DashboardKpis {
  bookings_today: number
  revenue_today: number
  total_clients: number
  pending_bookings: number
  average_ticket: number
  return_rate: number
  new_clients_month: number
  no_shows_month: number
}

export interface FinanceSummary {
  total: number
  average_ticket: number
  by_method: Record<PaymentMethod, number>
  by_service: Array<{ service_name: string; total: number; count: number }>
  daily: Array<{ date: string; total: number }>
}

type TableDef<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row
  Insert: Insert
  Update: Update
  Relationships: []
}

export type Database = {
  public: {
    Tables: {
      clients: TableDef<Client, Omit<Client, 'id' | 'created_at'>>
      services: TableDef<Service, Omit<Service, 'id'>>
      staff: TableDef<Staff, Omit<Staff, 'id'>>
      bookings: TableDef<Booking, Omit<Booking, 'id' | 'created_at'>>
      promotions: TableDef<Promotion, Omit<Promotion, 'id' | 'created_at' | 'uses_count'>>
      loyalty_transactions: TableDef<LoyaltyTransaction, Omit<LoyaltyTransaction, 'id' | 'created_at'>, Record<string, never>>
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
