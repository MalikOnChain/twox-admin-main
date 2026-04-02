'use client'

import { ApexOptions } from 'apexcharts'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { toast } from 'sonner'

import { getMainGGRStats } from '@/api/metrics'

import ChartTab from '@/components/common/ChartTab'
import { Skeleton } from '@/components/common/Skeleton'
import DatePicker from '@/components/form/date-picker'
import MetricsCard from '@/components/metrics/MetricsCard'

import { IMainGGRStats, MetricsFilterOptions } from '@/types/metrics'

const filterOptions = [
  { value: MetricsFilterOptions.Daily, label: 'Daily' },
  { value: MetricsFilterOptions.Monthly, label: 'Monthly' },
]

interface RequestPayload {
  startDate: string
  endDate: string
}

const MainGGRStats = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>(
    MetricsFilterOptions.Monthly
  )
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState<boolean>(true)
  const [mainGGRStats, setMainGGRStats] = useState<IMainGGRStats>()
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  const requestPayload: RequestPayload = useMemo(() => {
    let startDate = new Date(selectedDate)
    let endDate = new Date(selectedDate)
    if (selectedFilter === MetricsFilterOptions.Monthly) {
      startDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      )
      endDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0
      )
    }

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    }
  }, [selectedFilter, selectedDate])

  const fetchMainGGRStats = useCallback(
    async (requestPayload: RequestPayload) => {
      try {
        setLoading(true)
        const summary = await getMainGGRStats(requestPayload)
        setMainGGRStats(summary)
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Error fetching FTD summary')
        }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value)
  }

  const options: ApexOptions = {
    colors: [
      '#FF5733', // Gross GGR
      '#33FF57', // Bonus Costs
      '#5733FF', // Refunds/Chargebacks
      '#FF33A5', // Provider Fees
      '#FF8C33', // Operating Costs
      '#33FF8C', // Affiliate Commissions
      '#8C33FF', // Withdrawal Costs
      '#FF3333', // Net GGR
    ],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'bar',
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 0,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [selectedDate],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Outfit',
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  }
  const series = [
    {
      name: 'Gross GGR',
      value: mainGGRStats?.grossGGR ?? 0,
    },
    {
      name: 'Bonus Costs',
      value: mainGGRStats?.bonusCost ?? 0,
    },
    {
      name: 'Refunds/Chargebacks',
      value: mainGGRStats?.refundAndChargeBack ?? 0,
    },
    {
      name: 'Provider Fees',
      value: mainGGRStats?.providerFee ?? 0,
    },
    {
      name: 'Operating Costs',
      value: mainGGRStats?.operationCost ?? 0,
    },
    {
      name: 'Affiliate Commissions',
      value: mainGGRStats?.affiliateCommissions ?? 0,
    },
    {
      name: 'Withdrawal Costs',
      value: mainGGRStats?.withdrawCost ?? 0,
    },
    {
      name: 'Net GGR',
      value: mainGGRStats?.netGGR ?? 0,
    },
  ].map(({ name, value }) => ({
    name,
    data: [Number((value || 0).toFixed(2))],
  }))

  useEffect(() => {
    fetchMainGGRStats(requestPayload)
  }, [fetchMainGGRStats, requestPayload])
  return (
    <div className='space-y-6 overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]'>
      <div className='flex flex-col gap-5 sm:flex-row sm:justify-between'>
        <div className='w-full'>
          <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
            Main GGR Stats
          </h3>
        </div>
        <div className='flex w-full items-start gap-3 sm:justify-end'>
          {selectedFilter === MetricsFilterOptions.Daily && (
            <DatePicker
              id='date-from-ggr'
              placeholder='GGR Date'
              defaultDate={selectedDate}
              onChange={(value) => {
                const date = Array.isArray(value) ? value[0] : value
                setSelectedDate(date)
              }}
            />
          )}
          {selectedFilter === MetricsFilterOptions.Monthly && (
            <DatePicker
              id='date-from-ggr'
              placeholder='GGR Date'
              mode='month'
              defaultDate={selectedDate}
              onChange={(value) => {
                const date = Array.isArray(value) ? value[0] : value
                setSelectedDate(date)
              }}
            />
          )}
          <ChartTab
            options={filterOptions}
            selected={selectedFilter}
            setSelected={handleFilterChange}
          />
        </div>
      </div>
      {loading ? (
        <>
          <div className='mb-10 grid grid-cols-1 items-center justify-center gap-5 md:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className='h-[110px] rounded-2xl' />
            ))}
          </div>
          <div className='grid grid-cols-1'>
            <Skeleton className='h-[380px] rounded-2xl' />
          </div>
        </>
      ) : (
        <div>
          <div className='mb-10 grid grid-cols-1 items-center justify-center gap-5 md:grid-cols-4'>
            <MetricsCard
              title='Gross GGR'
              tooltipText='Total bets placed by players minus total winnings paid out.'
              value={`${mainGGRStats && mainGGRStats.grossGGR < 0 ? '-' : ''}$${Math.abs(mainGGRStats?.grossGGR || 0).toFixed(2)}`}
            />
            <MetricsCard
              title='Bonus Costs'
              tooltipText='Sum of all player bonuses used.'
              value={`R$${(mainGGRStats?.bonusCost || 0).toFixed(2)}`}
            />
            <MetricsCard
              title='Refunds/Chargebacks'
              tooltipText='Any reversed or refunded player transactions.'
              value={`R$${(mainGGRStats?.refundAndChargeBack || 0).toFixed(2)}`}
            />
            <MetricsCard
              title='Provider Fees'
              tooltipText='Fees payable to game providers, either as a percentage or flat rate.'
              value={`R$${(mainGGRStats?.providerFee || 0).toFixed(2)}`}
            />
            <MetricsCard
              title='Operating Costs'
              tooltipText='Manual input of recurring business expenses.'
              value={`R$${(mainGGRStats?.operationCost || 0).toFixed(2)}`}
            />
            <MetricsCard
              title='Affiliate Commissions'
              tooltipText='Commissions paid to affiliates, based on % of GGR or CPA.'
              value={`R$${(mainGGRStats?.affiliateCommissions || 0).toFixed(2)}`}
            />
            <MetricsCard
              title='Withdrawal Costs'
              tooltipText='Withdrawal Costs.'
              value={`R$${(mainGGRStats?.withdrawCost || 0).toFixed(2)}`}
            />
            <MetricsCard
              title='Net GGR'
              tooltipText='Final GGR after deducting all the above costs.'
              value={`${mainGGRStats && mainGGRStats.netGGR < 0 ? '-' : ''}$${Math.abs(mainGGRStats?.netGGR || 0).toFixed(2)}`}
            />
          </div>
          <div>
            <ReactApexChart
              options={options}
              series={series}
              type='bar'
              height={380}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default MainGGRStats
