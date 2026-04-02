'use client'

import dynamic from 'next/dynamic'
import { formatNumber } from '@/lib/utils'
import { IPartner, IPartnerMetrics } from '@/api/affiliate-management'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface PartnerDetailsViewProps {
  partner: IPartner
  metrics: IPartnerMetrics
  onClose: () => void
}

export default function PartnerDetailsView({ partner, metrics, onClose }: PartnerDetailsViewProps) {
  const ftdsChartOptions =
    metrics.ftds && metrics.ftds.length > 0
      ? {
          chart: { type: 'line' as const },
          xaxis: { categories: metrics.ftds.map((f) => f.date) },
          series: [
            {
              name: 'FTDs',
              data: metrics.ftds.map((f) => f.count),
            },
            {
              name: 'Amount',
              data: metrics.ftds.map((f) => f.amount),
            },
          ],
        }
      : null

  const ngrChartOptions =
    metrics.ngr && metrics.ngr.length > 0
      ? {
          chart: { type: 'line' as const },
          xaxis: { categories: metrics.ngr.map((n) => n.date) },
          series: [
            {
              name: 'NGR',
              data: metrics.ngr.map((n) => n.ngr),
            },
          ],
        }
      : null

  return (
    <div className='mt-6 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-white/[0.03]'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>{partner.name} - Metrics</h3>
        <button
          onClick={onClose}
          className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        >
          ×
        </button>
      </div>

      {/* Metrics Cards */}
      <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
        <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
          <div className='text-sm text-gray-500 dark:text-gray-400'>Total FTDs</div>
          <div className='mt-1 text-2xl font-semibold text-gray-800 dark:text-white'>{metrics.totalFTDs}</div>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
          <div className='text-sm text-gray-500 dark:text-gray-400'>Total NGR</div>
          <div className='mt-1 text-2xl font-semibold text-gray-800 dark:text-white'>
            R$ {formatNumber(metrics.totalNGR)}
          </div>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
          <div className='text-sm text-gray-500 dark:text-gray-400'>ROI</div>
          <div className='mt-1 text-2xl font-semibold text-gray-800 dark:text-white'>
            {metrics.roi.toFixed(2)}%
          </div>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
          <div className='text-sm text-gray-500 dark:text-gray-400'>Conversion Rate</div>
          <div className='mt-1 text-2xl font-semibold text-gray-800 dark:text-white'>
            {metrics.funnel.totalRegistered > 0
              ? ((metrics.funnel.totalDeposited / metrics.funnel.totalRegistered) * 100).toFixed(2)
              : 0}
            %
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {ftdsChartOptions && (
          <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
            <h4 className='mb-4 text-sm font-semibold text-gray-800 dark:text-white'>FTDs Trend</h4>
            <Chart options={ftdsChartOptions} series={ftdsChartOptions.series} type='line' height={300} />
          </div>
        )}

        {ngrChartOptions && (
          <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
            <h4 className='mb-4 text-sm font-semibold text-gray-800 dark:text-white'>NGR Trend</h4>
            <Chart options={ngrChartOptions} series={ngrChartOptions.series} type='line' height={300} />
          </div>
        )}
      </div>
    </div>
  )
}

