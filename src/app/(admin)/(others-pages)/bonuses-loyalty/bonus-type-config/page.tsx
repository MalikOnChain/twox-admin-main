import { Metadata } from 'next'

import BonusTypeConfigPage from '@/components/pages/bonuses-loyalty/BonusTypeConfigPage'

export const metadata: Metadata = {
  title: 'Bonus Type Config | TwoX',
  description: 'Configure bonus types and settings',
}

export default function BonusTypeConfig() {
  return <BonusTypeConfigPage />
}

