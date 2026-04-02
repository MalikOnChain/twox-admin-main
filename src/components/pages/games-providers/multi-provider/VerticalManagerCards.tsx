'use client'

import { IVerticalManagerItem } from '@/api/games-providers'
import { formatNumber } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import Badge from '@/components/ui/badge/Badge'

interface VerticalManagerCardsProps {
  verticals: IVerticalManagerItem[]
}

export default function VerticalManagerCards({
  verticals,
}: VerticalManagerCardsProps) {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {verticals.map((vertical, index) => (
        <Card key={index}>
          <h4 className='mb-2 text-sm font-semibold text-gray-800 dark:text-white/90'>
            {vertical.vertical}
          </h4>
          <div className='space-y-2 text-xs text-gray-500 dark:text-gray-400'>
            <div>
              <span className='font-medium'>Providers:</span> {vertical.providers.length}
            </div>
            <div>
              <span className='font-medium'>Games:</span> {vertical.totalGames}
            </div>
            <div>
              <span className='font-medium'>Liability:</span> R${' '}
              {formatNumber(vertical.liability)}
            </div>
            <div>
              <span className='font-medium'>Wallet Rules:</span> {vertical.walletRules}
            </div>
            <div>
              <span className='font-medium'>Reporting:</span> {vertical.reportingSets}
            </div>
            <div>
              <span className='font-medium'>Failover:</span>{' '}
              <Badge
                size='sm'
                color={vertical.failover === 'Enabled' ? 'success' : 'error'}
              >
                {vertical.failover}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

