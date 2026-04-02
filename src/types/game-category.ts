// types/game-category.ts
export interface IGameReference {
  id: string
  type: 'blueocean'
}

export interface IGameCategory {
  _id: string
  title: string
  games: IGameReference[]
  isPinned: boolean
  isActive: boolean
  displayOrder: number
  icon: string
  createdAt: Date
  updatedAt: Date
}

// For the converted game data that comes back from the service
export interface IConvertedGame {
  id: string
  name: string
  provider: string
  image: string
  isEnabled: boolean
  type: 'blueocean'
}

// API Request/Response types
export interface GameCategoryListRequest {
  page?: number
  limit?: number
  isActive?: boolean
  isPinned?: boolean
}

export interface GameCategoryPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface GameCategoryListResponse {
  success: boolean
  data: IGameCategory[]
  pagination: GameCategoryPagination
  message?: string
}

export interface GameCategoryDetailResponse {
  success: boolean
  data: IGameCategory
  games: IConvertedGame[]
  message?: string
}

export interface GameCategoryFormData {
  title: string
  games: IGameReference[]
  isPinned?: boolean
  isActive?: boolean
  displayOrder?: number
  icon?: string
}

export interface GameCategoryFormResponse {
  success: boolean
  data?: IGameCategory
  message?: string
}

export interface GameCategoryDeleteResponse {
  success: boolean
  message: string
}

export interface IconUploadResponse {
  success: boolean
  url: string
  message?: string
}
