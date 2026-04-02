import { Metadata } from 'next'

import PerformancePage from '@/components/pages/bonuses-loyalty/PerformancePage'

export const metadata: Metadata = {
  title: 'Performance & Liability | TwoX',
  description: 'View bonus performance and liability metrics',
}

export default function Performance() {
  return <PerformancePage />
}

