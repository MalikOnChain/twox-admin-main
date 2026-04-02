'use client'

import { useMemo } from 'react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'

import {
  IBonusTypePerformance,
  IClaimTrend,
  ICostVsNGR,
  IRegionSplit,
} from '@/api/bonuses-loyalty'
import { formatNumber } from '@/lib/utils'
import { Card } from '@/components/ui/card'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface BonusOverviewChartsProps {
  typePerformance: IBonusTypePerformance[]
  claimTrend: IClaimTrend[]
  costVsNGR: ICostVsNGR[]
  regionSplit: IRegionSplit[]
}

export default function BonusOverviewCharts({
  typePerformance,
  claimTrend,
  costVsNGR,
  regionSplit,
}: BonusOverviewChartsProps) {
  // Type Performance Chart Options
  const typePerformanceOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'bar',
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
        stacked: true,
      },
      colors: ['#465FFF', '#33FF57', '#FF6B6B', '#FFD93D', '#9B59B6'],
      plotOptions: {
        bar: {
          borderRadius: 5,
          horizontal: false,
        },
      },
      xaxis: {
        categories:
          typePerformance.length > 0
            ? typePerformance.map((item) => item.type || 'Unknown')
            : [],
      },
      yaxis: {
        title: { text: 'Amount (R$)' },
      },
      legend: { position: 'top' },
      dataLabels: { enabled: true },
      tooltip: {
        y: {
          formatter: (val: number) => `R$ ${formatNumber(val)}`,
        },
      },
    }),
    [typePerformance]
  )

  const typePerformanceSeries = useMemo(
    () => {
      if (typePerformance.length === 0) {
        return [
          { name: 'Total Amount', data: [] },
          { name: 'Claims', data: [] },
        ]
      }
      return [
        {
          name: 'Total Amount',
          data: typePerformance.map((item) => item.totalAmount || 0),
        },
        {
          name: 'Claims',
          data: typePerformance.map((item) => item.claimCount || 0),
        },
      ]
    },
    [typePerformance]
  )

  // Claim Trend Chart Options
  const claimTrendOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'line',
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
      },
      colors: ['#465FFF'],
      stroke: { curve: 'smooth', width: 2 },
      xaxis: {
        categories:
          claimTrend.length > 0 ? claimTrend.map((item) => item.date || '') : [],
      },
      yaxis: {
        title: { text: 'Claims' },
      },
      dataLabels: { enabled: false },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} claims`,
        },
      },
    }),
    [claimTrend]
  )

  const claimTrendSeries = useMemo(
    () => {
      if (claimTrend.length === 0) {
        return [{ name: 'Claims', data: [] }]
      }
      return [
        {
          name: 'Claims',
          data: claimTrend.map((item) => item.claimCount || 0),
        },
      ]
    },
    [claimTrend]
  )

  // Cost vs NGR Chart Options
  const costVsNGROptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'line',
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
      },
      colors: ['#465FFF', '#33FF57'],
      stroke: { curve: 'smooth', width: 2 },
      xaxis: {
        categories: costVsNGR.length > 0 ? costVsNGR.map((item) => item.date || '') : [],
      },
      yaxis: {
        title: { text: 'Amount (R$)' },
      },
      legend: { position: 'top' },
      dataLabels: { enabled: false },
      tooltip: {
        y: {
          formatter: (val: number) => `R$ ${formatNumber(val)}`,
        },
      },
    }),
    [costVsNGR]
  )

  const costVsNGRSeries = useMemo(
    () => {
      if (costVsNGR.length === 0) {
        return [
          { name: 'Cost', data: [] },
          { name: 'NGR', data: [] },
        ]
      }
      return [
        {
          name: 'Cost',
          data: costVsNGR.map((item) => item.cost || 0),
        },
        {
          name: 'NGR',
          data: costVsNGR.map((item) => item.ngr || 0),
        },
      ]
    },
    [costVsNGR]
  )

  // Region Split Chart Options
  const regionSplitOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'donut',
        fontFamily: 'Outfit, sans-serif',
      },
      labels:
        regionSplit.length > 0
          ? regionSplit.map((item) => item.region || 'Unknown')
          : [],
      colors: [
        '#465FFF',
        '#33FF57',
        '#FF6B6B',
        '#FFD93D',
        '#9B59B6',
        '#E67E22',
        '#1ABC9C',
      ],
      legend: { position: 'bottom' },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(1)}%`,
      },
      tooltip: {
        y: {
          formatter: (val: number, opts: any) => {
            const seriesIndex = opts.seriesIndex
            const item = regionSplit[seriesIndex]
            if (item) {
              return `${item.region || 'Unknown'}: ${val.toFixed(1)}% (R$ ${formatNumber(item.totalAmount || 0)})`
            }
            return `${val.toFixed(1)}%`
          },
        },
      },
    }),
    [regionSplit]
  )

  const regionSplitSeries = useMemo(
    () => {
      if (regionSplit.length === 0) {
        return []
      }
      const total = regionSplit.reduce((sum, item) => sum + (item.totalAmount || 0), 0)
      return regionSplit.map((item) =>
        total > 0 ? ((item.totalAmount || 0) / total) * 100 : 0
      )
    },
    [regionSplit]
  )

  return (
    <div className='space-y-6'>
      {/* Type Performance */}
      <Card>
        <h4 className='mb-4 text-sm font-medium text-gray-400'>
          Type Performance (Stacked Bar)
        </h4>
        {typePerformance.length > 0 ? (
          <ReactApexChart
            options={typePerformanceOptions}
            series={typePerformanceSeries}
            type='bar'
            height={400}
          />
        ) : (
          <p className='text-xs text-gray-500'>No type performance data available</p>
        )}
      </Card>

      {/* Claim Trend */}
      <Card>
        <h4 className='mb-4 text-sm font-medium text-gray-400'>Claim Trend (Line)</h4>
        {claimTrend.length > 0 ? (
          <ReactApexChart
            options={claimTrendOptions}
            series={claimTrendSeries}
            type='line'
            height={300}
          />
        ) : (
          <p className='text-xs text-gray-500'>No claim trend data available</p>
        )}
      </Card>

      {/* Cost vs NGR */}
      <Card>
        <h4 className='mb-4 text-sm font-medium text-gray-400'>
          Cost vs NGR (Dual-Line)
        </h4>
        {costVsNGR.length > 0 ? (
          <ReactApexChart
            options={costVsNGROptions}
            series={costVsNGRSeries}
            type='line'
            height={300}
          />
        ) : (
          <p className='text-xs text-gray-500'>No cost vs NGR data available</p>
        )}
      </Card>

      {/* Region Split */}
      <Card>
        <h4 className='mb-4 text-sm font-medium text-gray-400'>Region Split (Donut)</h4>
        {regionSplit.length > 0 ? (
          <ReactApexChart
            options={regionSplitOptions}
            series={regionSplitSeries}
            type='donut'
            height={350}
          />
        ) : (
          <p className='text-xs text-gray-500'>No region split data available</p>
        )}
      </Card>
    </div>
  )
}

