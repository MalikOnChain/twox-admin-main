'use client'

import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface PartnersChartsProps {
  ngrByPartner: Array<{ partner: string; partnerCode: string; ngr: number }>
  funnel: {
    visitors: number
    registered: number
    deposited: number
    ftds: number
  } | null
  roi: Array<{ date: string; cost: number; revenue: number; roi: number }>
}

export default function PartnersCharts({ ngrByPartner, funnel, roi }: PartnersChartsProps) {
  const ngrChartOptions =
    ngrByPartner.length > 0
      ? {
          chart: { type: 'bar' as const },
          xaxis: { categories: ngrByPartner.map((p) => p.partner) },
          series: [
            {
              name: 'NGR',
              data: ngrByPartner.map((p) => p.ngr),
            },
          ],
        }
      : null

  const funnelChartOptions = funnel
    ? {
        chart: { type: 'bar' as const },
        xaxis: { categories: ['Visitors', 'Registered', 'Deposited', 'FTDs'] },
        series: [
          {
            name: 'Count',
            data: [funnel.visitors, funnel.registered, funnel.deposited, funnel.ftds],
          },
        ],
      }
    : null

  const roiChartOptions =
    roi.length > 0
      ? {
          chart: { type: 'line' as const },
          xaxis: { categories: roi.map((r) => r.date) },
          series: [
            {
              name: 'ROI %',
              data: roi.map((r) => r.roi),
            },
          ],
        }
      : null

  return (
    <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
      {ngrChartOptions && (
        <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
          <h4 className='mb-4 text-sm font-semibold text-gray-800 dark:text-white'>NGR by Partner</h4>
          <Chart options={ngrChartOptions} series={ngrChartOptions.series} type='bar' height={300} />
        </div>
      )}

      {funnelChartOptions && (
        <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
          <h4 className='mb-4 text-sm font-semibold text-gray-800 dark:text-white'>Conversion Funnel</h4>
          <Chart options={funnelChartOptions} series={funnelChartOptions.series} type='bar' height={300} />
        </div>
      )}

      {roiChartOptions && (
        <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.03]'>
          <h4 className='mb-4 text-sm font-semibold text-gray-800 dark:text-white'>ROI Trend</h4>
          <Chart options={roiChartOptions} series={roiChartOptions.series} type='line' height={300} />
        </div>
      )}
    </div>
  )
}

