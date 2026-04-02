import { Metadata } from 'next'

import FeeAnalyticsPage from '@/components/pages/payments/FeeAnalyticsPage'

export const metadata: Metadata = {
  title: 'Fee Analytics | TwoX',
  description: 'Payment fee analytics and insights',
}

export default function FeeAnalytics() {
  return <FeeAnalyticsPage />
}

