export interface IBotUserData {
  _id: string
  username: string
  avatar: string
  wager: number
  rank: string
  minMultiplier: number
  maxMultiplier: number
  minBet: number
  maxBet: number
  createdAt: string
}

export interface IBotUsersListResponse {
  success: boolean
  rows: IBotUserData[]
  pagination: {
    totalPages: number
    currentPage: number
  }
  error?: any
}

export enum BOT_USER_AVATAR_UPLOAD_STATUS {
  SELECT_BOT_USER_AVATAR = 'Please select bot user avatar!',
  BOT_USER_AVATAR_UPLOAD_FAILED = 'Bot user avatar upload failed',
  BOT_USER_AVATAR_UPLOAD_SUCCESS = 'Bot user avatar uploaded successfully',
}
