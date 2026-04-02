'use client'

import { useMemo } from 'react'
import { ApexOptions } from 'apexcharts'
import dynamic from 'next/dynamic'
import { IProviderDetail } from '@/api/games-providers'
import { formatNumber } from '@/lib/utils'
import { Modal } from '@/components/ui/modal'
import Badge from '@/components/ui/badge/Badge'
import Loading from '@/components/common/Loading'

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

interface ProviderDetailModalProps {
  isOpen: boolean
  providerDetail: IProviderDetail | null
  loading: boolean
  onClose: () => void
}

export default function ProviderDetailModal({
  isOpen,
  providerDetail,
  loading,
  onClose,
}: ProviderDetailModalProps) {
  const ggrTrendOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'line',
        fontFamily: 'Outfit, sans-serif',
        toolbar: { show: false },
      },
      colors: ['#465FFF'],
      xaxis: {
        categories: providerDetail?.ggrTrend.map((item) => item.date) || [],
      },
      yaxis: {
        title: { text: 'GGR (R$)' },
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      tooltip: {
        y: {
          formatter: (val: number) => `R$ ${formatNumber(val)}`,
        },
      },
    }),
    [providerDetail]
  )

  const ggrTrendSeries = useMemo(
    () => [
      {
        name: 'GGR',
        data: providerDetail?.ggrTrend.map((item) => item.ggr) || [],
      },
    ],
    [providerDetail]
  )

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='max-w-4xl p-6 lg:p-10'
    >
      {loading ? (
        <Loading />
      ) : providerDetail ? (
        <div className='space-y-6'>
          <h4 className='mb-4 text-xl font-semibold text-gray-800 dark:text-white/90'>
            Provider Detail: {providerDetail.provider}
          </h4>
          <div>
            <h4 className='mb-3 text-sm font-semibold text-gray-800 dark:text-white/90'>
              Basic Information
            </h4>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='text-gray-500 dark:text-gray-400'>API Version:</span>
                <span className='ml-2 font-medium text-gray-800 dark:text-white/90'>{providerDetail.apiVersion}</span>
              </div>
              <div>
                <span className='text-gray-500 dark:text-gray-400'>Contract:</span>
                <span className='ml-2 font-medium text-gray-800 dark:text-white/90'>{providerDetail.contract}</span>
              </div>
              <div>
                <span className='text-gray-500 dark:text-gray-400'>Fee Model:</span>
                <span className='ml-2 font-medium text-gray-800 dark:text-white/90'>{providerDetail.feeModel}</span>
              </div>
              <div>
                <span className='text-gray-500 dark:text-gray-400'>Fee %:</span>
                <span className='ml-2 font-medium text-gray-800 dark:text-white/90'>{providerDetail.feePercent}%</span>
              </div>
              <div>
                <span className='text-gray-500 dark:text-gray-400'>Total Games:</span>
                <span className='ml-2 font-medium text-gray-800 dark:text-white/90'>{providerDetail.totalGames}</span>
              </div>
              <div>
                <span className='text-gray-500 dark:text-gray-400'>Enabled Games:</span>
                <span className='ml-2 font-medium text-gray-800 dark:text-white/90'>{providerDetail.enabledGames}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className='mb-3 text-sm font-semibold text-gray-800 dark:text-white/90'>
              Verticals
            </h4>
            <div className='flex flex-wrap gap-2'>
              {providerDetail.verticals.map((vertical, index) => (
                <Badge key={index} size='sm' color='primary'>
                  {vertical}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className='mb-3 text-sm font-semibold text-gray-800 dark:text-white/90'>
              Markets
            </h4>
            <div className='flex flex-wrap gap-2'>
              {providerDetail.markets.map((market, index) => (
                <Badge key={index} size='sm' color='primary'>
                  {market}
                </Badge>
              ))}
            </div>
          </div>
          {providerDetail.ggrTrend.length > 0 && (
            <div>
              <h4 className='mb-3 text-sm font-semibold text-gray-800 dark:text-white/90'>
                GGR Trend
              </h4>
              <ReactApexChart
                options={ggrTrendOptions}
                series={ggrTrendSeries}
                type='line'
                height={300}
              />
            </div>
          )}
          <div>
            <h4 className='mb-3 text-sm font-semibold text-gray-800 dark:text-white/90'>
              Conversion
            </h4>
            <div className='text-sm'>
              <span className='text-gray-500 dark:text-gray-400'>Rate:</span>
              <span className='ml-2 font-medium text-gray-800 dark:text-white/90'>{providerDetail.conversion}%</span>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}

