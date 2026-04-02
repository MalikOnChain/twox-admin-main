'use client'

import { Card } from '@/components/ui/card'

interface SummaryCardsProps {
  seedData: {
    paid: { count: number; totalAmount: string }
    pending: { count: number; totalAmount: string }
    health: { percent: number; description: string }
  }
}

export default function SummaryCards({ seedData }: SummaryCardsProps) {
  return (
    <div className='mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3'>
      <Card>
        <h3 className='text-sm font-medium text-gray-400'>Approved</h3>
        <p className='text-2xl font-bold text-white'>{seedData.paid.count}</p>
        <p className='text-sm text-gray-400'>Total Approved | R${seedData.paid.totalAmount}</p>
      </Card>
      <Card>
        <h3 className='text-sm font-medium text-gray-400'>Pending</h3>
        <p className='text-2xl font-bold text-white'>{seedData.pending.count}</p>
        <p className='text-sm text-gray-400'>Total Outstanding | R${seedData.pending.totalAmount}</p>
      </Card>
      <Card>
        <h3 className='text-sm font-medium text-gray-400'>Health</h3>
        <p className='text-2xl font-bold text-white'>{seedData.health.percent}%</p>
        <p className='text-sm text-gray-400'>{seedData.health.description}</p>
      </Card>
    </div>
  )
}

