'use client'

import { Card } from '@/components/ui/card'
import { formatNumber } from '@/lib/utils'

interface FeeSummaryCardsProps {
  summary: {
    totalFees: number
    fiatFees: number
    cryptoFees: number
    avgFeePercent: number
    topCostlyMethod: string
  } | null
}

const formatCurrency = (amount: number) => `$${formatNumber(amount)}`

export default function FeeSummaryCards({ summary }: FeeSummaryCardsProps) {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
      <Card>
        <h4 className='text-sm font-medium text-gray-400'>Total Fees</h4>
        <p className='mt-2 text-2xl font-bold text-white'>
          {summary ? formatCurrency(summary.totalFees) : '$0.00'}
        </p>
        <p className='mt-1 text-xs text-gray-500'>All payment methods</p>
      </Card>
      <Card>
        <h4 className='text-sm font-medium text-gray-400'>Fiat vs Crypto</h4>
        <p className='mt-2 text-2xl font-bold text-white'>
          {summary
            ? `${formatCurrency(summary.fiatFees)} / ${formatCurrency(summary.cryptoFees)}`
            : '—'}
        </p>
        <p className='mt-1 text-xs text-gray-500'>Fiat / Crypto</p>
      </Card>
      <Card>
        <h4 className='text-sm font-medium text-gray-400'>Avg Fee %</h4>
        <p className='mt-2 text-2xl font-bold text-white'>
          {summary ? `${summary.avgFeePercent.toFixed(2)}%` : '0%'}
        </p>
        <p className='mt-1 text-xs text-gray-500'>Average across all transactions</p>
      </Card>
      <Card>
        <h4 className='text-sm font-medium text-gray-400'>Top Costly Method</h4>
        <p className='mt-2 text-2xl font-bold text-white'>{summary?.topCostlyMethod || 'N/A'}</p>
        <p className='mt-1 text-xs text-gray-500'>Highest fee method</p>
      </Card>
    </div>
  )
}

