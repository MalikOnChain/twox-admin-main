export interface IAssigner {
  _id: string
  username: string
  email: string
}
export interface ITierAffiliate {
  _id?: string
  name: string
  referralCode: string
  wagerCommissionRate: number
  lossCommissionRate: number
  assigner: string
  createdAt?: Date
}

export interface ITierAffiliateCollection {
  _id: string
  name: string
  referralCode: string
  wagerCommissionRate: number
  lossCommissionRate: number
  assigner: IAssigner
  userCount: number
  createdAt: Date
}

export interface ITierAffiliateListResponse {
  rows: ITierAffiliateCollection[]
  totalPages: number
  currentPage: number
  error?: any
}
