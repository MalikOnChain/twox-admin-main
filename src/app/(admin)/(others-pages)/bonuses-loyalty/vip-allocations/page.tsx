import { Metadata } from 'next'

import VIPAllocationsPage from '@/components/pages/bonuses-loyalty/VIPAllocationsPage'

export const metadata: Metadata = {
  title: 'VIP-Triggered Allocations | TwoX',
  description: 'Manage VIP-triggered bonus allocations',
}

export default function VIPAllocations() {
  return <VIPAllocationsPage />
}

