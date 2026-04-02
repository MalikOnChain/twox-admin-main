'use client'

import { formatNumber } from '@/lib/utils'
import { ISegmentationStats } from '@/api/bonus-segmentation'

interface SegmentationStatsCardsProps {
  stats: ISegmentationStats | null
}

export default function SegmentationStatsCards({ stats }: SegmentationStatsCardsProps) {
  if (!stats) return null

  return (
    <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
      <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
        <div className='text-sm text-gray-500 dark:text-gray-400'>Total Users</div>
        <div className='mt-1 text-2xl font-semibold text-gray-800 dark:text-white'>
          {formatNumber(stats.totalUsers)}
        </div>
      </div>
      <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
        <div className='text-sm text-gray-500 dark:text-gray-400'>Total Balance</div>
        <div className='mt-1 text-2xl font-semibold text-gray-800 dark:text-white'>
          R$ {formatNumber(stats.totalBalance)}
        </div>
      </div>
      <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
        <div className='text-sm text-gray-500 dark:text-gray-400'>Avg Balance</div>
        <div className='mt-1 text-2xl font-semibold text-gray-800 dark:text-white'>
          R$ {formatNumber(stats.averageBalance)}
        </div>
      </div>
      <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
        <div className='text-sm text-gray-500 dark:text-gray-400'>Avg Deposit Freq</div>
        <div className='mt-1 text-2xl font-semibold text-gray-800 dark:text-white'>
          {stats.averageDepositFrequency.toFixed(1)}
        </div>
      </div>
    </div>
  )
}

