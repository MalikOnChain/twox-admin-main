export enum PaymentMethodTypes {
  CRYPTO = 'crypto',
}

export interface GameTransaction {
  time: string
  category: string
  betAmount: number
  winAmount: number
  userBalance: {
    before: number
    after: number
  }
  status: string
}

export interface CryptoTransaction {
  time: string
  type: string
  userBalance: {
    before: number
    after: number
  }
  amount: number
  unit: string
  transactionId: string
  transactionHash: string
  blockchain: string
  network: string
  status: string
}

export interface ServiceTransaction {
  time: string
  type: string
  amount: number
  status: string
  userBalance: {
    before: number
    after: number
  }
}

export interface MixedTransaction
  extends GameTransaction,
    CryptoTransaction,
    ServiceTransaction {}

export interface PixTransaction {
  _id: string
  userId: {
    _id: string
    username: string
    avatar: string
  }
  amount: number
  currency: string
  type: 'transaction' | 'withdrawal' | 'deposit'
  method: 'pix' | 'payout_pix' | 'nowpayments_crypto'
  due: string | null
  status: number
  pixKey: string | null
  paidAt: string | null
  metadata?: any
  createdAt: string
  updatedAt: string
}
