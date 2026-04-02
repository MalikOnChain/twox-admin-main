import {
  ArbitrumIcon,
  AvalancheIcon,
  BitcoinCoinIcon,
  BnbIcon,
  DogeIcon,
  EthereumIcon,
  LitecoinIcon,
  MaticIcon,
  TronIcon,
  XrpIcon,
} from '@/icons'

/**
 * Calculates the total USD value for a specific property across all assets
 * @param assets Array of crypto assets
 * @param property The property to calculate (availableAmount, totalAmount, blockedAmount, allocatedAmount)
 * @returns Formatted USD string with 2 decimal places
 */
export const calculateTotalUsdValue = (
  assets: CryptoAsset[],
  property: keyof Pick<
    CryptoAsset,
    'availableAmount' | 'totalAmount' | 'blockedAmount' | 'allocatedAmount'
  >
): string => {
  const total = assets.reduce((sum, asset) => {
    const amount = parseFloat(asset[property])
    const rate = parseFloat(asset.exchangeRate)
    return sum + amount * rate
  }, 0)

  return `R$${total.toFixed(2)}`
}

/**
 * Utility object with methods to calculate different balance totals
 */
export const cryptoMetrics = {
  getAvailableBalance: (assets: CryptoAsset[]): string =>
    calculateTotalUsdValue(assets, 'availableAmount'),

  getTotalBalance: (assets: CryptoAsset[]): string =>
    calculateTotalUsdValue(assets, 'totalAmount'),

  getBlockedAmount: (assets: CryptoAsset[]): string =>
    calculateTotalUsdValue(assets, 'blockedAmount'),

  getAllocatedAmount: (assets: CryptoAsset[]): string =>
    calculateTotalUsdValue(assets, 'allocatedAmount'),
}

const BLOCKCHAIN_PROTOCOL_NAME = {
  BITCOIN: 'bitcoin',
  LITE_COIN: 'litecoin',
  DOGE_COIN: 'dogecoin',
  ETHEREUM: 'ethereum',
  XRP: 'xrp',
  BINANCE_SMART_CHAIN: 'binance-smart-chain',
  TRON: 'tron',
  POLYGON: 'polygon',
  AVALANCHE: 'avalanche',
  ARBITRUM: 'arbitrum',
}

const CRYPTO_TOKENS = {
  USDT: 'USDT',
}

export const CRYPTO_SYMBOLS: any = {
  [BLOCKCHAIN_PROTOCOL_NAME.BITCOIN]: 'BTC',
  [BLOCKCHAIN_PROTOCOL_NAME.LITE_COIN]: 'LTC',
  [BLOCKCHAIN_PROTOCOL_NAME.DOGE_COIN]: 'DOGE',
  [BLOCKCHAIN_PROTOCOL_NAME.ETHEREUM]: 'ETH',
  [BLOCKCHAIN_PROTOCOL_NAME.XRP]: 'XRP',
  [BLOCKCHAIN_PROTOCOL_NAME.BINANCE_SMART_CHAIN]: 'BNB',
  [BLOCKCHAIN_PROTOCOL_NAME.TRON]: 'TRX',
  [BLOCKCHAIN_PROTOCOL_NAME.POLYGON]: 'MATIC',
  [BLOCKCHAIN_PROTOCOL_NAME.AVALANCHE]: 'AVAX',
  [BLOCKCHAIN_PROTOCOL_NAME.ARBITRUM]: 'ARB',
  [CRYPTO_TOKENS.USDT]: 'USDT',
}

export const ICONS = {
  [BLOCKCHAIN_PROTOCOL_NAME.BITCOIN]: BitcoinCoinIcon,
  [BLOCKCHAIN_PROTOCOL_NAME.LITE_COIN]: LitecoinIcon,
  [BLOCKCHAIN_PROTOCOL_NAME.DOGE_COIN]: DogeIcon,
  [BLOCKCHAIN_PROTOCOL_NAME.ETHEREUM]: EthereumIcon,
  [BLOCKCHAIN_PROTOCOL_NAME.XRP]: XrpIcon,
  [BLOCKCHAIN_PROTOCOL_NAME.BINANCE_SMART_CHAIN]: BnbIcon,
  [BLOCKCHAIN_PROTOCOL_NAME.TRON]: TronIcon,
  [BLOCKCHAIN_PROTOCOL_NAME.POLYGON]: MaticIcon,
  [BLOCKCHAIN_PROTOCOL_NAME.AVALANCHE]: AvalancheIcon,
  [BLOCKCHAIN_PROTOCOL_NAME.ARBITRUM]: ArbitrumIcon,
}
