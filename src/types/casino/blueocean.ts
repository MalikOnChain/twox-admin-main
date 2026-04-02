// BlueOcean Game Interfaces
export interface IBlueOceanGame {
  _id: string
  gameId: string
  name: string
  type: string
  subcategory?: string
  category: string
  system: string
  provider: string
  providerName: string
  details: string
  licence: string
  gamename: string
  report: string
  isNewGame: boolean
  position: number
  plays: number
  rtp: string
  wagering?: string
  mobile: boolean
  playForFunSupported: boolean
  freeroundsSupported: boolean
  featurebuySupported: boolean
  hasJackpot: boolean
  releaseDate?: Date
  showDate?: Date
  hideDate?: Date
  idHash: string
  idParent: string
  idHashParent: string
  lottie?: string
  image: string
  imagePreview: string
  imageFilled: string
  imagePortrait: string
  imageSquare: string
  imageBackground: string
  imageLottie: string
  imagePortraitLottie: string
  imageSquareLottie: string
  imageBw: string
  status: 'active' | 'inactive' | 'hidden'
  isEnabled: boolean
  isFeatured: boolean
  order: number
  createdAt: Date
  updatedAt: Date
  lastSyncAt: Date
}

// BlueOcean Game Provider Interfaces
export interface IBlueOceanGameProvider {
  _id: string
  provider: string
  providerName: string
  image?: string
  name: string
  system: string
  imageBlack?: string
  imageWhite?: string
  imageColored?: string
  imageSmallColor?: string
  imageSmallGray?: string
  type: string
  createdAt: Date
  updatedAt: Date
}

// Service Response Interfaces
export interface IBlueOceanGamesListResponse {
  success: boolean
  rows: IBlueOceanGame[]
  pagination: {
    total: number
    currentPage: number
    totalPages: number
  }
}

export interface IBlueOceanGameDetailResponse {
  success: boolean
  game?: IBlueOceanGame
  message?: string
}

export interface IBlueOceanGameUpdateData {
  property: string
  value: any
}

// Controller Request Interfaces
export interface IBlueOceanGamesListRequest {
  page?: number
  limit?: number
  type?: string
  code?: string
  filter?: string
}

export interface IBlueOceanGamesListResponse {
  rows: IBlueOceanGame[]
  totalPages: number
  currentPage: number
  error?: any
}

export interface IBlueOceanGameUpdateRequest {
  params: IBlueOceanGameUpdateData
}

// Allowed properties for game updates
export type BlueOceanGameUpdatableProperties =
  | 'name'
  | 'type'
  | 'category'
  | 'subcategory'
  | 'system'
  | 'provider'
  | 'providerName'
  | 'details'
  | 'licence'
  | 'gamename'
  | 'report'
  | 'isNewGame'
  | 'position'
  | 'plays'
  | 'rtp'
  | 'wagering'
  | 'mobile'
  | 'playForFunSupported'
  | 'freeroundsSupported'
  | 'featurebuySupported'
  | 'hasJackpot'
  | 'releaseDate'
  | 'showDate'
  | 'hideDate'
  | 'status'
  | 'isEnabled'
  | 'isFeatured'
  | 'order'
