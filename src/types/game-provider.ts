export enum GameProviderType {
  SLOT = 'slot',
  LIVE = 'live',
}

export interface GameProvider {
  _id?: string
  code: string
  name: string
  banner?: string | null
  type: GameProviderType
  countGames?: number
  status: 0 | 1
  createdAt?: string
  updatedAt?: string
}

/**
 * Response from the API with a list of GameProviders
 */
export interface GameProviderListResponse {
  rows: GameProvider[]
  pagination: {
    total: number
    totalPages: number
    currentPage: number
  }
}

/**
 * Response from the API with a single gameProvider
 */
export interface GameProviderResponse {
  gameProvider: GameProvider
}

/**
 * Success response from create/update/delete operations
 */
export interface GameProviderSuccessResponse {
  message: string
  gameProviders?: GameProvider
  error?: string
}

/**
 * Error response from the API
 */
export interface GameProviderErrorResponse {
  message: string
}

export enum IMAGE_UPLOAD_STATUS {
  SELECT_GAMEPROVIDER_IMAGE = 'Please select provider image!',
  GAMEPROVIDER_IMAGE_UPLOAD_FAILED = 'Provider image upload failed',
  IMAGE_UPLOAD_SUCCESS = 'Uploading images successfully',
}

export interface IGameProviderUpdateResponse {
  success: boolean
  message?: string
}

export interface IGameProviderImageResponse {
  success?: boolean
  message?: string
  url: string
}
