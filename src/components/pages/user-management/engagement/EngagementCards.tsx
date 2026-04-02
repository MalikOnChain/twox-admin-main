'use client'

import { IEngagementData } from '@/api/user-management'

interface EngagementCardsProps {
  cards: IEngagementData['data']['cards']
}

export default function EngagementCards({ cards }: EngagementCardsProps) {
  return (
    <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
      <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
        <p className='text-xs text-gray-500 dark:text-gray-400'>Total Play Time</p>
        <p className='text-2xl font-bold text-gray-800 dark:text-white/90'>{cards.totalPlayTime} min</p>
      </div>
      <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
        <p className='text-xs text-gray-500 dark:text-gray-400'>Avg Session Length</p>
        <p className='text-2xl font-bold text-gray-800 dark:text-white/90'>
          {cards.avgSessionLength.toFixed(1)} min
        </p>
      </div>
      <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
        <p className='text-xs text-gray-500 dark:text-gray-400'>Sessions This Week</p>
        <p className='text-2xl font-bold text-gray-800 dark:text-white/90'>{cards.sessionsThisWeek}</p>
      </div>
      <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
        <p className='text-xs text-gray-500 dark:text-gray-400'>Last Session</p>
        <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
          {cards.lastSession ? new Date(cards.lastSession).toLocaleDateString() : 'Never'}
        </p>
      </div>
    </div>
  )
}

