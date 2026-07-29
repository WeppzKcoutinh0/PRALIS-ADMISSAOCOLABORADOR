export type ProfileRole = 'admin' | 'dp' | 'viewer'

export interface Profile {
  id: string
  fullName: string
  email: string
  role: ProfileRole
  isActive: boolean
}
