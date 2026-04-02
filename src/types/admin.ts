import { IRole } from '@/types/role'

interface ActionLog {
  // Define properties based on your actual action log structure
  action: string
  timestamp: Date
  details?: object
}

export interface IAdminSession {
  sessionId: string
  ipAddress: string
  userAgent: string
  loginTime: Date
  lastActivity: Date
  isActive: boolean
}

export interface IDashboardLayout {
  cardId: string
  visible: boolean
  position: number
  size?: 'small' | 'medium' | 'large'
}

export interface IAdmin {
  _id: string
  roles: string[]
  password: string
  username: string
  email: string
  isOTPEnabled: boolean
  otpData: string
  isTwoFAEnabled: boolean
  twoFASecret: string
  notes: string
  lastAdminLogin: Date | null
  isActive: boolean
  permissions: string[]
  actionLogs: ActionLog[]
  grantedAt: Date
  sessions?: IAdminSession[]
  dashboardLayout?: IDashboardLayout[]
  createdAt: Date
  updatedAt: Date
  googleId: string | null
  gmail: string | null
  googleUsername: string | null
  avatar: string | null
  __v: number
}

export interface IAdminDataCollection {
  _id: string
  roles: IRole[]
  password: string
  username: string
  email: string
  isOTPEnabled: boolean
  otpData: string
  isTwoFAEnabled: boolean
  twoFASecret: string
  notes: string
  lastAdminLogin: Date | null
  isActive: boolean
  permissions: string[]
  actionLogs: ActionLog[]
  grantedAt: Date
  sessions?: IAdminSession[]
  dashboardLayout?: IDashboardLayout[]
  createdAt: Date
  updatedAt: Date
  avatar: string | null
  __v: number
}

export interface IAdminsListResponse {
  rows: IAdminDataCollection[]
  totalPages: number
  currentPage: number
  error?: any
}
