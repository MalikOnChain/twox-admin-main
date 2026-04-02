import { Metadata } from 'next'
import React from 'react'

import PageBreadcrumb from '@/components/common/PageBreadCrumb'

export const metadata: Metadata = {
  title: 'Next.js Users Table | TailAdmin - Next.js Dashboard Template',
  description:
    'This is Next.js Users Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template',
  // other metadata
}

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle='Users Table' />
      {/* <div className='space-y-6'>
        <ComponentCard title='Users Table 1'>
          <UsersTable />
        </ComponentCard>
      </div> */}
    </div>
  )
}
