import { Metadata } from 'next'

import PromotionListPage from '@/components/pages/promotion/PromotionListPage'

export const metadata: Metadata = {
  title: 'Next.js Tier Table',
  description: 'This is Next.js Tier Table  page',
}

export default function BasicTables() {
  return <PromotionListPage />
}
