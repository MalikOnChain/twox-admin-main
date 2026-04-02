'use client'

import MetricsCard from '@/components/metrics/MetricsCard'
import { formatNumber } from '@/lib/utils'
import { IBonusOverview } from '@/api/bonuses-loyalty'

interface BonusOverviewSummaryCardsProps {
  overview: IBonusOverview | null
}

export default function BonusOverviewSummaryCards({
  overview,
}: BonusOverviewSummaryCardsProps) {
  return (
    <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
      <MetricsCard title='Active Bonuses' value={overview?.activeBonuses || 0} />
      <MetricsCard
        title='Value Issued'
        value={`R$ ${formatNumber(overview?.valueIssued || 0)}`}
      />
      <MetricsCard title='Claimed' value={overview?.claimed || 0} />
      <MetricsCard
        title='Cost % of GGR'
        value={`${overview?.costPercentOfGGR || 0}%`}
      />
    </div>
  )
}

