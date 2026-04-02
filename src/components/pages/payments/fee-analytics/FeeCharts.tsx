'use client'

import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { Card } from '@/components/ui/card'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface FeeChartsProps {
  feesByMethod: {
    labels: string[]
    fees: number[]
  } | null
  feesByCurrency: {
    labels: string[]
    fees: number[]
  } | null
  feesVsVolume: {
    labels: string[]
    volumes: number[]
    fees: number[]
  } | null
}

export default function FeeCharts({
  feesByMethod,
  feesByCurrency,
  feesVsVolume,
}: FeeChartsProps) {
  const feesByMethodChartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'bar',
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
      },
      colors: ['#465FFF'],
      plotOptions: {
        bar: {
          borderRadius: 5,
        },
      },
      xaxis: { categories: feesByMethod?.labels || [] },
      yaxis: { title: { text: 'Fees ($)' } },
      dataLabels: { enabled: true },
    }),
    [feesByMethod]
  )

  const feesByMethodChartSeries = useMemo(
    () => [
      {
        name: 'Fees',
        data: feesByMethod?.fees || [],
      },
    ],
    [feesByMethod]
  )

  const feesByCurrencyChartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'bar',
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
        stacked: true,
      },
      colors: ['#465FFF', '#33FF57', '#FF6B6B', '#FFD93D'],
      plotOptions: {
        bar: {
          borderRadius: 5,
        },
      },
      xaxis: { categories: feesByCurrency?.labels || [] },
      yaxis: { title: { text: 'Fees ($)' } },
      dataLabels: { enabled: true },
      legend: { position: 'top' },
    }),
    [feesByCurrency]
  )

  const feesByCurrencyChartSeries = useMemo(
    () => [
      {
        name: 'Fees',
        data: feesByCurrency?.fees || [],
      },
    ],
    [feesByCurrency]
  )

  const feesVsVolumeChartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'line',
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
      },
      colors: ['#465FFF', '#FF6B6B'],
      stroke: { curve: 'smooth', width: 2 },
      xaxis: { categories: feesVsVolume?.labels || [] },
      yaxis: [
        { title: { text: 'Volume ($)' } },
        { opposite: true, title: { text: 'Fees ($)' } },
      ],
      legend: { position: 'top' },
      dataLabels: { enabled: false },
    }),
    [feesVsVolume]
  )

  const feesVsVolumeChartSeries = useMemo(
    () => [
      {
        name: 'Volume',
        data: feesVsVolume?.volumes || [],
      },
      {
        name: 'Fees',
        data: feesVsVolume?.fees || [],
      },
    ],
    [feesVsVolume]
  )

  return (
    <>
      {/* Charts */}
      <div className='mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <Card>
          <h4 className='mb-4 text-sm font-medium text-gray-400'>Fees by Method (Bar)</h4>
          {feesByMethod && feesByMethod.labels.length > 0 ? (
            <ReactApexChart
              options={feesByMethodChartOptions}
              series={feesByMethodChartSeries}
              type='bar'
              height={250}
            />
          ) : (
            <p className='text-xs text-gray-500'>No data available</p>
          )}
        </Card>
        <Card>
          <h4 className='mb-4 text-sm font-medium text-gray-400'>Fees by Currency (Stacked Bar)</h4>
          {feesByCurrency && feesByCurrency.labels.length > 0 ? (
            <ReactApexChart
              options={feesByCurrencyChartOptions}
              series={feesByCurrencyChartSeries}
              type='bar'
              height={250}
            />
          ) : (
            <p className='text-xs text-gray-500'>No data available</p>
          )}
        </Card>
      </div>

      {/* Fees vs Volume Chart - Separate Row */}
      <div className='mt-6'>
        <Card>
          <h4 className='mb-4 text-sm font-medium text-gray-400'>Fees vs Volume (Dual-Line)</h4>
          {feesVsVolume && feesVsVolume.labels.length > 0 ? (
            <ReactApexChart
              options={feesVsVolumeChartOptions}
              series={feesVsVolumeChartSeries}
              type='line'
              height={200}
            />
          ) : (
            <p className='text-xs text-gray-500'>No data available</p>
          )}
        </Card>
      </div>
    </>
  )
}

