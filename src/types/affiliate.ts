export interface IUser {
  _id: string
  email?: string
  googleId?: string
  username: string
  password?: string
  fullName?: string
  avatar?: string
  isBanned: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface IFriendsListResponse {
  rows: IUser[]
  pagination: {
    total: number
    totalPages: number
    currentPage: number
  }
  error?: any
}

export interface IReward {
  _id: string
  name: string
  amount: number
  status: boolean
}

export interface IRewardsListResponse {
  rows: IReward[]
  pagination: {
    total: number
    totalPages: number
    currentPage: number
  }
  error?: any
}

export interface IReferredUser {
  _id: string
  username: string
  metrics: {
    totalDeposit: string
    totalWithdraw: string
    totalWager: string
    totalWin: string
    totalBonus: string
    totalProfit: string
    selfProfit: string
  }
}

export interface IReferredUserListResponse {
  rows: IReferredUser[]
  totalPages: number
  currentPage: number
  error?: any
}

export interface IAffiliateMetrics {
  metrics: { key: string; value: string }[]
  error?: any
}
