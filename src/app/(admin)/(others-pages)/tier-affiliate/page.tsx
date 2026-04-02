import { Metadata } from 'next'

import TierAffiliatesList from '@/components/pages/tier-affiliate'

export const metadata: Metadata = {
  title: 'Tier Affiliate Table',
  description: 'This is Tier Affiliate Table page',
}

export default function BasicTables() {
  return <TierAffiliatesList />
}
