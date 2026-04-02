'use client'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { getGGRvsNGR, IGGRvsNGR } from '@/api/metrics'

import { Skeleton } from '@/components/common/Skeleton'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface GGRvsNGRChartProps {
  startDate: string
  endDate: string
}

export default function GGRvsNGRChart({ startDate, endDate }: GGRvsNGRChartProps) {
  const [data, setData] = useState<IGGRvsNGR | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await getGGRvsNGR({ startDate, endDate })
        setData(result)
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Error fetching GGR vs NGR data')
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
        type: 'line',
        fontFamily: 'Outfit, sans-serif',
        toolbar: {
          show: false,
        },
      },
      colors: ['#465FFF', '#33FF57'],
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
      },
      yaxis: {
        title: {
          text: 'Amount ($)',
        },
        labels: {
          formatter: (val: number) => `$${val.toLocaleString()}`,
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
          formatter: (val: number) => `$${val.toLocaleString()}`,
        },
      },
    }),
    [data?.dates]
  )

  const series = useMemo(() => {
    if (!data) return []
    return [
      {
        name: 'Gross GGR',
        data: data.ggr,
      },
      {
        name: 'Net GGR',
        data: data.ngr,
      },
    ]
  }, [data])

  if (loading) {
    return <Skeleton className='h-[400px] rounded-2xl' />
  }

  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
      <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90 mb-4'>
        GGR vs. NGR
      </h3>
      <ReactApexChart options={options} series={series} type='line' height={350} />
    </div>
  )
}

