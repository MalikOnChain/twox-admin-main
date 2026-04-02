'use client'

import { IGameDetail } from '@/api/games-providers'
import { formatNumber } from '@/lib/utils'
import { Card } from '@/components/ui/card'

interface FinancialSummaryCardsProps {
  financial: IGameDetail['financial']
}

export default function FinancialSummaryCards({
  financial,
}: FinancialSummaryCardsProps) {
  return (
    <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
      <Card>
        <h4 className='text-sm font-medium text-gray-400'>Total Stakes</h4>
        <p className='mt-2 text-2xl font-bold text-white'>
          R$ {formatNumber(financial.totalStakes)}
        </p>
      </Card>
      <Card>
        <h4 className='text-sm font-medium text-gray-400'>Total Wins</h4>
        <p className='mt-2 text-2xl font-bold text-white'>
          R$ {formatNumber(financial.totalWins)}
        </p>
      </Card>
      <Card>
        <h4 className='text-sm font-medium text-gray-400'>Total GGR</h4>
        <p className='mt-2 text-2xl font-bold text-white'>
          R$ {formatNumber(financial.totalGGR)}
        </p>
      </Card>
      <Card>
        <h4 className='text-sm font-medium text-gray-400'>Transactions</h4>
        <p className='mt-2 text-2xl font-bold text-white'>
          {formatNumber(financial.transactionCount)}
        </p>
      </Card>
    </div>
  )
}

