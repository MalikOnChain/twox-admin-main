import { Metadata } from 'next'

import UserAffiliate from '@/components/pages/user-affiliate'

export const metadata: Metadata = {
  title: 'User Affiliate',
  description: 'This is User Affiliate  page',
}

export default function BasicTables() {
  return <UserAffiliate />
}
