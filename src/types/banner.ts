export interface IBannerData {
  _id?: string
  title: string
  image: string
  position: string
  language: {
    code: 'en' | 'es' | 'fr' | 'de' | 'it' | 'ar' | 'pt' | 'zh' // Predefined language codes
    name:
      | 'English'
      | 'Spanish'
      | 'French'
      | 'German'
      | 'Italian'
      | 'Arabic'
      | 'Portuguese'
      | 'Chinese' // Predefined language names
  }
  device: 'mobile' | 'desktop' | 'tablet' | 'smartwatch' // Predefined device types
  section:
    | 'home'
    | 'promotions'
    | 'games'
    | 'sports'
    | 'casino'
    | 'bonuses'
    | 'responsible-gambling'
    | 'new-user-registration'
    | 'payment-methods'
    | 'mobile-app'
    | 'live-betting'
    | 'vip-program'
    | 'events'
    | 'affiliate'
    | 'blog-news'
    | 'footer' // Predefined section types
  bannerData?: {
    title?: string
    subtitle?: string
    highlight?: string
    features?: string[]
  }
}

export interface IBannerListResponse {
  success: boolean
  rows: IBannerData[]
  pagination: {
    totalPages: number
    currentPage: number
  }
  error?: any
}

export interface IBannerDetailResponse {
  success: boolean
  banner: IBannerData
}

export interface IBannerUpdateResponse {
  success: boolean
  message?: string
}

export interface IBannerImageResponse {
  success?: boolean
  message?: string
  url: string
}

export enum IMAGE_UPLOAD_STATUS {
  SELECT_BANNER_IMAGE = 'Please select banner image!',
  BANNER_IMAGE_UPLOAD_FAILED = 'Banner image upload failed',
  IMAGE_UPLOAD_SUCCESS = 'Uploading images successfully',
}
