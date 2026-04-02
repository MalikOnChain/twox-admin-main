'use client'

import { useMemo } from 'react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface UptimeChartProps {
  uptimeTrend: Array<{
    provider: string
    code: string
    uptime: Array<{
      date: string
      uptime: number
    }>
  }>
}

export default function UptimeChart({ uptimeTrend }: UptimeChartProps) {
  const options: ApexOptions = useMemo(
    () => {
      const allDates = new Set<string>()
      uptimeTrend?.forEach((provider) => {
        provider.uptime?.forEach((item) => {
          if (item.date) allDates.add(item.date)
        })
      })
      const sortedDates = Array.from(allDates).sort()

      return {
        chart: {
          type: 'line',
          fontFamily: 'Outfit, sans-serif',
          toolbar: { show: false },
        },
        colors: ['#465FFF', '#33FF57', '#FF6B6B', '#FFD93D', '#9B59B6', '#E67E22', '#1ABC9C', '#E74C3C'],
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
          categories: sortedDates.length > 0 ? sortedDates : (uptimeTrend?.[0]?.uptime.map((item) => item.date) || []),
          labels: {
            rotate: -45,
            rotateAlways: false,
            formatter: (value: string) => {
              const date = new Date(value)
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            },
          },
        },
        yaxis: {
          title: { text: 'Uptime %' },
          min: 0,
          max: 100,
        },
        legend: { position: 'top' },
        dataLabels: { enabled: false },
        tooltip: {
          shared: true,
          intersect: false,
        },
      }
    },
    [uptimeTrend]
  )

  const series = useMemo(
    () => {
      if (!uptimeTrend) return []

      const allDates = new Set<string>()
      uptimeTrend.forEach((provider) => {
        provider.uptime?.forEach((item) => {
          if (item.date) allDates.add(item.date)
        })
      })
      const sortedDates = Array.from(allDates).sort()

      return uptimeTrend.map((provider) => {
        const uptimeMap = new Map<string, number>()
        provider.uptime?.forEach((item) => {
          if (item.date) uptimeMap.set(item.date, item.uptime || 0)
        })

        const data = sortedDates.map((date) => uptimeMap.get(date) || 0)

        return {
          name: provider.provider,
          data: data,
        }
      })
    },
    [uptimeTrend]
  )

  return (
    <Card>
      <h4 className='mb-4 text-sm font-medium text-gray-400'>Uptime (Line)</h4>
      {uptimeTrend && uptimeTrend.length > 0 ? (
        <ReactApexChart
          options={options}
          series={series}
          type='line'
          height={300}
        />
      ) : (
        <p className='text-xs text-gray-500'>No uptime data available</p>
      )}
    </Card>
  )
}

