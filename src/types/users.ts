export type SortField = 'name' | 'email' | 'role' | 'status' | 'lastLogin'
export type SortOrder = 'asc' | 'desc'

export type User = {
  id: number
  name: string
  email: string
  phone: string
  role: string
  status: string
  isOnline: boolean
  lastLogin: string
  registeredAt: string
  subscribed: boolean
  subscription: {
    plan: string
    validUntil: string
  }
  avatar: string
  coursesEnrolled: number
}

// ... autres types 
