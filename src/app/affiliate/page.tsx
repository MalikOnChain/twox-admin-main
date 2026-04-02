import type { Metadata } from 'next'
import React from 'react'

import { AffiliateMetrics } from '@/components/ecommerce/AffiliateMetrics'
import MonthlyGGRChart from '@/components/ecommerce/MonthlyGGRChart'
import MonthlyTarget from '@/components/ecommerce/MonthlyTarget'
// import StatisticsChart from '@/components/ecommerce/StatisticsChart'
// import RecentOrders from "@/components/ecommerce/RecentOrders";

export const metadata: Metadata = {
  title: 'iGaming Dashboard | Two X Affiliate',
  description: 'Two X Affiliate',
}

export default function AffiliateDashboard() {
  return (
    <div className='grid grid-cols-12 gap-4 md:gap-6'>
      <div className='col-span-12 space-y-6 xl:col-span-7'>
        <AffiliateMetrics />

        <MonthlyGGRChart />
      </div>

      <div className='col-span-12 xl:col-span-5'>
        <MonthlyTarget />
      </div>
    </div>
  )
}
