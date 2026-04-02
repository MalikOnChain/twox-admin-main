import { Metadata } from 'next'

import AnalyticsPage from '@/components/pages/games-providers/AnalyticsPage'

export const metadata: Metadata = {
  title: 'Games & Providers Analytics | TwoX',
  description: 'View games and providers analytics',
}

export default function Analytics() {
  return <AnalyticsPage />
}

