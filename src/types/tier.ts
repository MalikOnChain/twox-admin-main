export interface ITierData {
  _id?: string
  name: string
  icon: string
  downgradePeriod: number
  levels: ITierLevel[]
}

export interface ITierLevel {
  _id?: string
  level: number
  minXP: number
  icon: string
  name: string
}

export interface ITierListResponse {
  success: boolean
  rows: ITierData[]
  pagination: {
    totalPages: number
    currentPage: number
  }
  error?: any
}

export interface ITierUpdateResponse {
  success: boolean
  message?: string
}

export interface ITierIconResponse {
  success?: boolean
  message?: string
  url: string
}

export enum TIER_NAMES {
  BRONZE = 'Bronze',
  SILVER = 'Silver',
  GOLD = 'Gold',
  PLATINUM = 'Platinum',
  DIAMOND = 'Diamond',
  VIP = 'VIP',
}

export enum ICON_UPLOAD_STATUS {
  SELECT_TIER_ICON = 'Please select tier icon!',
  SELECT_TIER_LEVEL_ICON = 'Please select tier level icon!',
  TIER_ICON_UPLOAD_FAILED = 'Tier icon upload failed',
  TIER_LEVEL_ICON_UPLOAD_FAILED = 'Tier level icon upload failed',
  ICON_UPLOAD_SUCCESS = 'Uploading icons successfully',
  ICON_UPLOAD_FAILED = 'Uploading icons failed',
}
