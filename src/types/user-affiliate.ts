export interface IUserAffiliateCollection {
  _id: string
  username: string
  email: string
  referralCode: string
  userCount: number
}

export interface IUserAffiliateListResponse {
  rows: IUserAffiliateCollection[]
  totalPages: number
  currentPage: number
  error?: any
}
