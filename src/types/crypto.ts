interface CryptoWallet {
  limit: number
  hasMore: boolean
  items: CryptoAsset[]
}

interface CryptoAsset {
  allocatedAmount: string
  availableAmount: string
  blockchain: string
  blockedAmount: string
  exchangeRate: string
  id: string
  symbol: string
  totalAmount: string
  type: string
}

interface MainWalletAssets {
  assetData: {
    allocatedAmount: string
    availableAmount: string
    blockedAmount: string
    contract: string
    standard: string
    totalAmount: string
  }
  assetId: string
  blockchain: string
  exchange_rate: string
  network: string
  symbol: string
  type: string
}

interface MainWalletData {
  item: {
    assets: MainWalletAssets[]
  }
}

interface MainWalletResponse {
  network: string
  walletAddress: string
  data: MainWalletData
}

interface CryptoTransaction {
  _id: string
  userId: string
  blockchain: string
  network: string
  type: string
  userBalance: {
    before: number
    after: number
  }
  status: string
  amount: number
  exchangeRate: number
  exchangedAmount: number
  unit: string
  transactionId: string
  address: string
  metadata: {
    originalPayload: {
      blockchain: string
      network: string
      address: string
      minedInBlock: {
        height: 8145038
        hash: string
        timestamp: number
      }
      currentConfirmations: number
      targetConfirmations: number
      amount: string
      unit: string
      transactionId: string
    }
  }
  version: number
  createdAt: string
  updatedAt: string
  __v: number
}
