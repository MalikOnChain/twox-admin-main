import { Bonus } from '@/types/bonus'

export interface IPromotionData {
  _id: string
  name: string
  summary: string
  image: string
  badge?: string
  colorTheme?: number
  highlightText?: string
  buttons?: { text: string; link: string }[]
  isPublic: boolean
  bonusId?: string
  description: string
  bonus?: Bonus
}

export interface IPromotionListResponse {
  success: boolean
  rows: IPromotionData[]
  pagination: {
    totalPages: number
    currentPage: number
  }
  error?: any
}

export interface IPromotionDetailResponse {
  success: boolean
  promotion: IPromotionData
}

export interface IPromotionUpdateResponse {
  success: boolean
  message?: string
}

export interface IPromotionImageResponse {
  success?: boolean
  message?: string
  url: string
}

export enum IMAGE_UPLOAD_STATUS {
  SELECT_PROMOTION_IMAGE = 'Please select promotion image!',
  PROMOTION_IMAGE_UPLOAD_FAILED = 'Promotion image upload failed',
  IMAGE_UPLOAD_SUCCESS = 'Uploading images successfully',
  IMAGE_UPLOAD_FAILED = 'Uploading images failed',
}
