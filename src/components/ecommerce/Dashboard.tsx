'use client'

import { useMemo, useState } from 'react'

import ConversionFunnelChart from '@/components/ecommerce/ConversionFunnelChart'
import DemographicCard from '@/components/ecommerce/DemographicCard'
import { EcommerceMetrics } from '@/components/ecommerce/EcommerceMetrics'
import GGRvsNGRChart from '@/components/ecommerce/GGRvsNGRChart'
import ProviderUptimeChart from '@/components/ecommerce/ProviderUptimeChart'
import RecentBigWinsTable from '@/components/ecommerce/RecentBigWinsTable'
import TopGamesChart from '@/components/ecommerce/TopGamesChart'

import DatePicker from '@/components/form/date-picker'

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })

  const requestPayload = useMemo(() => {
    const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    }
  }, [selectedDate])

  return (
    <>
      <div className='col-span-12'>
        <EcommerceMetrics />
      </div>

      <div className='col-span-12'>
        <DemographicCard />
      </div>

      <div className='col-span-12 flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold text-gray-800 dark:text-white/90'>Analytics Charts</h2>
        <DatePicker
          id='dashboard-month-picker'
          mode='month'
          defaultDate={selectedDate}
          onChange={(selectedDates) => {
            if (selectedDates && selectedDates.length > 0) {
              setSelectedDate(new Date(selectedDates[0]))
            }
          }}
        />
      </div>

      <div className='col-span-12 lg:col-span-6'>
        <ConversionFunnelChart startDate={requestPayload.startDate} endDate={requestPayload.endDate} />
      </div>

      <div className='col-span-12 lg:col-span-6'>
        <GGRvsNGRChart startDate={requestPayload.startDate} endDate={requestPayload.endDate} />
      </div>

      <div className='col-span-12 lg:col-span-6'>
        <TopGamesChart startDate={requestPayload.startDate} endDate={requestPayload.endDate} />
      </div>

      <div className='col-span-12 lg:col-span-6'>
        <ProviderUptimeChart startDate={requestPayload.startDate} endDate={requestPayload.endDate} />
      </div>

      <div className='col-span-12'>
        <RecentBigWinsTable />
      </div>
    </>
  )
}

export default Dashboard
