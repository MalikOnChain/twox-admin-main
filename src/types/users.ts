import { ADMIN_REVIEW_STATUS, KYC_STATUS } from '@/types/kyc'

export interface IUserData {
  _id: string
  username: string
  avatar: string
  role: string
  email: string
  currentTier: number
  currentLevel: number
  balance: number | string
  isMuted: boolean
  isEmailVerified: boolean
  isBanned: boolean
  createdAt: string
  verified: Array<string>
  lastLoginIp: string | null
  lastLoginTime: string | null
  lastLoginCountry: string | null
  lastLoginCity: string | null
  CPFNumber?: string
}

export interface IUserWithProfile extends IUserData {
  profile: {
    fullName?: string
    firstName?: string
    lastName?: string
    gender?: string
    dateOfBirth?: string
    placeOfBirth?: string
    email?: string
    phone?: string
    country?: string
    city?: string
    state?: string
    street?: string
    postalCode?: string
    residentialAddress?: string
    sumsubStatus: KYC_STATUS
    identityDocument?: {
      type?: string
      country?: string
      number?: string
      issuedDate?: string
      validUntil?: string
      issueAuthority?: string
      frontImagePath?: string
      backImagePath?: string
      selfieImagePath?: string
    }
    sumsubReviewResult?: {
      answer?: 'GREEN' | 'RED' | 'YELLOW'
    }
    adminReviewResult?: {
      status?: ADMIN_REVIEW_STATUS
      reviewedBy?: string
      reviewedAt?: string
      notes?: string
    }
    metadata?: any
  }
}

export interface IUsersListResponse {
  success: boolean
  rows: IUserData[]
  pagination: {
    totalPages: number
    currentPage: number
  }
  error?: any
}
