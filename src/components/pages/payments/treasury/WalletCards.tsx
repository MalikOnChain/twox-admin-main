'use client'

import { Card } from '@/components/ui/card'
import { IWalletBalancesResponse } from '@/api/treasury'
import { formatNumber } from '@/lib/utils'

interface WalletCardsProps {
  walletData: IWalletBalancesResponse['data'] | null
  formatCurrency: (amount: number, currency: string) => string
}

export default function WalletCards({ walletData, formatCurrency }: WalletCardsProps) {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>Wallets</h3>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {/* Hot Wallet */}
        <Card>
          <h4 className='text-sm font-medium text-gray-400'>Hot Wallet</h4>
          <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
            High-liquidity, frequently accessed funds
          </p>
          <div className='mt-4 space-y-2'>
            {walletData?.hot && walletData.hot.length > 0 ? (
              walletData.hot.map((wallet) => (
                <div key={wallet.currency} className='flex justify-between text-sm'>
                  <span className='text-gray-600 dark:text-gray-300'>{wallet.currency}:</span>
                  <span className='font-semibold text-gray-800 dark:text-white/90'>
                    {formatCurrency(wallet.amount, wallet.currency)}
                  </span>
                </div>
              ))
            ) : (
              <p className='text-xs text-gray-500 dark:text-gray-400'>No hot wallet balances</p>
            )}
            {walletData?.fiat?.BRL && walletData.fiat.BRL.totalUserBalance > 0 && (
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600 dark:text-gray-300'>BRL (User Balances):</span>
                <span className='font-semibold text-gray-800 dark:text-white/90'>
                  {formatCurrency(walletData.fiat.BRL.totalUserBalance, 'BRL')}
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Warm Wallet */}
        <Card>
          <h4 className='text-sm font-medium text-gray-400'>Warm Wallet</h4>
          <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
            Moderate liquidity, less frequent access
          </p>
          <div className='mt-4 space-y-2'>
            {walletData?.warm && walletData.warm.length > 0 ? (
              walletData.warm.map((wallet) => (
                <div key={wallet.currency} className='flex justify-between text-sm'>
                  <span className='text-gray-600 dark:text-gray-300'>{wallet.currency}:</span>
                  <span className='font-semibold text-gray-800 dark:text-white/90'>
                    {formatCurrency(wallet.amount, wallet.currency)}
                  </span>
                </div>
              ))
            ) : (
              <p className='text-xs text-gray-500 dark:text-gray-400'>No warm wallet balances</p>
            )}
          </div>
        </Card>

        {/* Cold Wallet */}
        <Card>
          <h4 className='text-sm font-medium text-gray-400'>Cold Wallet</h4>
          <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
            Long-term storage, high security
          </p>
          <div className='mt-4 space-y-2'>
            {walletData?.cold && walletData.cold.length > 0 ? (
              walletData.cold.map((wallet) => (
                <div key={wallet.currency} className='flex justify-between text-sm'>
                  <span className='text-gray-600 dark:text-gray-300'>{wallet.currency}:</span>
                  <span className='font-semibold text-gray-800 dark:text-white/90'>
                    {formatCurrency(wallet.amount, wallet.currency)}
                  </span>
                </div>
              ))
            ) : (
              <p className='text-xs text-gray-500 dark:text-gray-400'>No cold wallet balances</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

