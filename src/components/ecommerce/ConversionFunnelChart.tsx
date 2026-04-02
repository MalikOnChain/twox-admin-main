'use client'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { getConversionFunnel, IConversionFunnel } from '@/api/metrics'

import { Skeleton } from '@/components/common/Skeleton'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface ConversionFunnelChartProps {
  startDate: string
  endDate: string
}

export default function ConversionFunnelChart({ startDate, endDate }: ConversionFunnelChartProps) {
  const [data, setData] = useState<IConversionFunnel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getConversionFunnel({ startDate, endDate })
        setData(result)
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Error fetching conversion funnel data')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate])

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'bar',
        stacked: true,
        fontFamily: 'Outfit, sans-serif',
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          borderRadius: 5,
        },
      },
      colors: ['#465FFF', '#33FF57', '#FF5733'],
      dataLabels: {
        enabled: true,
        formatter: (val: number) => val.toLocaleString(),
      },
      xaxis: {
        categories: ['Visitors', 'Registrations', 'Deposits'],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        title: {
          text: 'Count',
        },
      },
      legend: {
        show: false,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val: number) => val.toLocaleString(),
        },
      },
    }),
    []
  )

  const series = useMemo(() => {
    if (!data) return []
    // For a proper funnel visualization, we show the progression
    // Each stage shows the cumulative value up to that point
    return [
      {
        name: 'Visitors',
        data: [data.visitors, 0, 0],
      },
      {
        name: 'Registrations',
        data: [0, data.registrations, 0],
      },
      {
        name: 'Deposits',
        data: [0, 0, data.deposits],
      },
    ]
  }, [data])

  if (loading) {
    return <Skeleton className='h-[400px] rounded-2xl' />
  }

  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
      <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90 mb-4'>
        Conversion Funnel
      </h3>
      <ReactApexChart options={options} series={series} type='bar' height={350} />
    </div>
  )
}

