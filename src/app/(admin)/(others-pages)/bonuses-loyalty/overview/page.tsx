import { Metadata } from 'next'

import BonusOverviewPage from '@/components/pages/bonuses-loyalty/BonusOverviewPage'

export const metadata: Metadata = {
  title: 'Bonus Overview | TwoX',
  description: 'View bonus overview statistics and analytics',
}

export default function BonusOverview() {
  return <BonusOverviewPage />
}

