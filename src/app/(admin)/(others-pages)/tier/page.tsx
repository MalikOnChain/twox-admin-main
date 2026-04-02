import { Metadata } from 'next'

import TierListPage from '@/components/pages/tier/TierList'

export const metadata: Metadata = {
  title: 'Next.js Tier Table',
  description: 'This is Next.js Tier Table  page',
}

export default function BasicTables() {
  return <TierListPage />
}
