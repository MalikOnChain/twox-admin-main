'use client'

import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface TransactionChartsProps {
  chartData: {
    volume: { labels: string[]; counts: number[]; amounts: number[] }
    methodSplit: { labels: string[]; counts: number[]; amounts: number[] }
    processingTime: { labels: string[]; counts: number[] }
  }
  loading: boolean
}

export default function TransactionCharts({ chartData, loading }: TransactionChartsProps) {
  return (
    <div className='mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3'>
      {/* Volume Chart (Line) */}
      <Card>
        <h3 className='mb-4 text-sm font-medium text-gray-400'>Volume (Line Chart)</h3>
        {loading ? (
          <div className='flex h-[250px] items-center justify-center'>
            <p className='text-xs text-gray-500'>Loading...</p>
          </div>
        ) : chartData.volume.labels.length === 0 ? (
          <p className='text-xs text-gray-500'>No data available</p>
        ) : (
          <ReactApexChart
            options={{
              chart: {
                type: 'line',
                fontFamily: 'Outfit, sans-serif',
                toolbar: { show: false },
              },
              colors: ['#465FFF'],
              stroke: { curve: 'smooth', width: 2 },
              xaxis: { categories: chartData.volume.labels },
              yaxis: { title: { text: 'Count' } },
              dataLabels: { enabled: false },
            }}
            series={[
              {
                name: 'Transaction Count',
                data: chartData.volume.counts,
              },
            ]}
            type='line'
            height={250}
          />
        )}
      </Card>

      {/* Method Split (Donut) */}
      <Card>
        <h3 className='mb-4 text-sm font-medium text-gray-400'>Method Split (Donut)</h3>
        {loading ? (
          <div className='flex h-[250px] items-center justify-center'>
            <p className='text-xs text-gray-500'>Loading...</p>
          </div>
        ) : chartData.methodSplit.labels.length === 0 ? (
          <p className='text-xs text-gray-500'>No data available</p>
        ) : (
          <ReactApexChart
            options={{
              chart: {
                type: 'donut',
                fontFamily: 'Outfit, sans-serif',
              },
              labels: chartData.methodSplit.labels,
              colors: ['#465FFF', '#33FF57', '#FF6B6B', '#FFD93D'],
              legend: { position: 'bottom' },
              dataLabels: { enabled: true },
            }}
            series={chartData.methodSplit.counts}
            type='donut'
            height={250}
          />
        )}
      </Card>

      {/* Processing Time (Histogram) */}
      <Card>
        <h3 className='mb-4 text-sm font-medium text-gray-400'>Processing Time (Histogram)</h3>
        {loading ? (
          <div className='flex h-[250px] items-center justify-center'>
            <p className='text-xs text-gray-500'>Loading...</p>
          </div>
        ) : chartData.processingTime.labels.length === 0 ? (
          <p className='text-xs text-gray-500'>No data available</p>
        ) : (
          <ReactApexChart
            options={{
              chart: {
                type: 'bar',
                fontFamily: 'Outfit, sans-serif',
                toolbar: { show: false },
              },
              colors: ['#465FFF'],
              plotOptions: {
                bar: {
                  borderRadius: 5,
                  horizontal: false,
                },
              },
              xaxis: { categories: chartData.processingTime.labels },
              yaxis: { title: { text: 'Count' } },
              dataLabels: { enabled: true },
            }}
            series={[
              {
                name: 'Transactions',
                data: chartData.processingTime.counts,
              },
            ]}
            type='bar'
            height={250}
          />
        )}
      </Card>
    </div>
  )
}

