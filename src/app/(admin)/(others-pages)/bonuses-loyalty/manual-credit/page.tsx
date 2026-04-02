import { Metadata } from 'next'

import ManualCreditPage from '@/components/pages/bonuses-loyalty/ManualCreditPage'

export const metadata: Metadata = {
  title: 'Manual Credit Issuance | TwoX',
  description: 'Manually issue credits and bonuses',
}

export default function ManualCredit() {
  return <ManualCreditPage />
}

