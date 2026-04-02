import { Pagination } from '@/types/common'
import { PaymentMethodTypes } from '@/types/transaction'

export interface FtdSummary {
  total: number
  conversionRate: number
  averageAmount: number
}

export interface FtdTransaction {
  _id: string
  firstDeposit: {
    type: string
    exchangedAmount: number
    updatedAt: string
    createdAt: string
  }
  paymentMethod: PaymentMethodTypes
  username: string
  bonus: {
    claimMethod: string
    amount: number
    claimedAt: string
  } | null
  timeFromRegistration: number
  geo?: {
    country?: string
    city?: string
    ip?: string
  } | null
}

export interface GetFtdTransactionsResponse {
  rows: FtdTransaction[]
  pagination: Pagination
}
