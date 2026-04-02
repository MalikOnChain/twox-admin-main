import { Metadata } from 'next'

import UserListPage from '@/components/pages/user/UserList'

export const metadata: Metadata = {
  title: 'Next.js Users Table | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Users Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template',
  // other metadata
}

export default function BasicTables() {
  return <UserListPage />
}
