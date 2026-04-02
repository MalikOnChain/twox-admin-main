import { Metadata } from 'next'

import BannerListPage from '@/components/pages/banner/BannerListPage'

export const metadata: Metadata = {
  title: 'Next.js Tier Table',
  description: 'This is Next.js Tier Table  page',
}

export default function BasicTables() {
  return <BannerListPage />
}
