'use client'
import { useRouter } from 'next/navigation'

import Button from '@/components/ui/button/Button'

export default function TournamentsTab() {
  const router = useRouter()

  return (
    <div className='space-y-4'>
      <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>Tournaments & Raffles History</h3>
      <div className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Tournament and raffle history will be displayed here. Links to Promotion section (§5).
        </p>
        <Button
          size='sm'
          variant='outline'
          className='mt-4'
          onClick={() => router.push('/promotion')}
        >
          View All Tournaments
        </Button>
      </div>
    </div>
  )
}

