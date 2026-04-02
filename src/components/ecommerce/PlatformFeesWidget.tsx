'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { getPlatformFeesWidget, IPlatformFeesWidget } from '@/api/metrics'

import { formatNumber } from '@/lib/utils'

import DatePicker from '@/components/form/date-picker'
import { Skeleton } from '@/components/common/Skeleton'

export default function PlatformFeesWidget() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [data, setData] = useState<IPlatformFeesWidget['data'] | null>(null)
  const [loading, setLoading] = useState(true)
  const threshold = 1000 // Default threshold

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
      threshold,
    }
  }, [selectedDate])

  const fetchData = async () => {
    try {
      setLoading(true)
      const result = await getPlatformFeesWidget(requestPayload)
      setData(result.data)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching platform fees')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [requestPayload.startDate, requestPayload.endDate])

  const handleClick = () => {
    router.push('/operating-providers')
  }

  if (loading) {
    return <Skeleton className='h-[300px] rounded-2xl' />
  }

  if (!data) {
    return null
  }

  const isOverThreshold = data.isOverThreshold
  const bgColor = isOverThreshold
    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    : 'bg-white dark:bg-white/[0.03] border-gray-200 dark:border-gray-800'
  const textColor = isOverThreshold
    ? 'text-red-600 dark:text-red-400'
    : 'text-gray-800 dark:text-white/90'
  const amountColor = isOverThreshold
    ? 'text-red-700 dark:text-red-300'
    : 'text-gray-900 dark:text-white'

  return (
    <div className='grid grid-cols-12 gap-4 md:gap-6'>
      <div className='col-span-12 flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold text-gray-800 dark:text-white/90'>
          Platform Fees Widget
        </h2>
        <DatePicker
          id='platform-fees-month-picker'
          mode='month'
          defaultDate={selectedDate}
          onChange={(selectedDates) => {
            if (selectedDates && selectedDates.length > 0) {
              setSelectedDate(new Date(selectedDates[0]))
            }
          }}
        />
      </div>

      <div
        className={`col-span-12 rounded-2xl border p-5 md:p-6 cursor-pointer transition-all hover:shadow-lg ${bgColor}`}
        onClick={handleClick}
      >
        <div className='flex items-center justify-between mb-4'>
          <h3 className={`text-lg font-semibold ${textColor}`}>Total Payment Fees</h3>
          {isOverThreshold && (
            <span className='rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400'>
              Over Threshold
            </span>
          )}
        </div>

        <div className='space-y-4'>
          <div>
            <div className='flex items-baseline gap-2'>
              <span className={`text-3xl font-bold ${amountColor}`}>
                ${formatNumber(data.totalFees)}
              </span>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                (Fiat + Crypto)
              </span>
            </div>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
              Threshold: ${formatNumber(data.threshold)}
            </p>
          </div>

          <div className='grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
            <div>
              <p className='text-sm text-gray-500 dark:text-gray-400'>Fiat Fees</p>
              <p className='text-lg font-semibold text-gray-800 dark:text-white/90'>
                ${formatNumber(data.fiatFees)}
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                {data.fiatTransactionCount} transactions
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-500 dark:text-gray-400'>Crypto Fees</p>
              <p className='text-lg font-semibold text-gray-800 dark:text-white/90'>
                ${formatNumber(data.cryptoFees)}
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                {data.cryptoTransactionCount} transactions
              </p>
            </div>
          </div>

          <div className='pt-2'>
            <p className='text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400'>
              Click to view Fee Analytics →
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

