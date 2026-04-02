import { Metadata } from 'next'

import BotUserListPage from '@/components/pages/bot-user/BotUserList'

export const metadata: Metadata = {
  title: 'Next.js Users Table | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Users Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template',
  // other metadata
}

export default function BasicTables() {
  return <BotUserListPage />
}
