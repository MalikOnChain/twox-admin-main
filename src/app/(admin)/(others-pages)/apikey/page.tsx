import { Metadata } from 'next'

import ApikeyListPage from '@/components/pages/apikey/ApikeyList'

export const metadata: Metadata = {
  title: 'Next.js API Key Table',
  description: 'This is Next.js API Table  page',
}

export default function BasicTables() {
  return <ApikeyListPage />
}
