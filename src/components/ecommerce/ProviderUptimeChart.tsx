'use client'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { getProviderUptime, IProviderUptime } from '@/api/metrics'

import { Skeleton } from '@/components/common/Skeleton'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface ProviderUptimeChartProps {
  startDate: string
  endDate: string
}

export default function ProviderUptimeChart({ startDate, endDate }: ProviderUptimeChartProps) {
  const [data, setData] = useState<IProviderUptime | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getProviderUptime({ startDate, endDate })
        setData(result)
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Error fetching provider uptime data')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate])

  const colors = [
    '#465FFF',
    '#33FF57',
    '#FF5733',
    '#FFC300',
    '#9B59B6',
    '#3498DB',
    '#E74C3C',
    '#1ABC9C',
  ]

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'line',
        fontFamily: 'Outfit, sans-serif',
        toolbar: {
          show: false,
        },
      },
      colors: colors.slice(0, data?.providers.length || 0),
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      markers: {
        size: 4,
        hover: {
          size: 6,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: data?.dates || [],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          rotate: -45,
          rotateAlways: true,
        },
      },
      yaxis: {
        title: {
          text: 'Uptime (%)',
        },
        min: 0,
        max: 100,
        labels: {
          formatter: (val: number) => `${val}%`,
        },
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
      },
      grid: {
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val}%`,
        },
      },
    }),
    [data]
  )

  const series = useMemo(() => {
    if (!data) return []
    return data.providers.map((provider) => ({
      name: provider.providerName,
      data: provider.data.map((d) => d.uptime),
    }))
  }, [data])

  if (loading) {
    return <Skeleton className='h-[400px] rounded-2xl' />
  }

  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
      <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90 mb-4'>
        Provider Uptime
      </h3>
      <ReactApexChart options={options} series={series} type='line' height={350} />
    </div>
  )
}

