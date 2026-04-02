'use client'
// First Time Deposit Summary
import { ApexOptions } from 'apexcharts'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { toast } from 'sonner'

import { getFtdSummary } from '@/api/metrics'

import ChartTab from '@/components/common/ChartTab'
import { Skeleton } from '@/components/common/Skeleton'
import DatePicker from '@/components/form/date-picker'
import MetricsCard from '@/components/metrics/MetricsCard'

import { FtdSummary } from '@/types/ftd'
import { MetricsFilterOptions } from '@/types/metrics'

const filterOptions = [
  { value: MetricsFilterOptions.Daily, label: 'Daily' },
  { value: MetricsFilterOptions.Monthly, label: 'Monthly' },
]

interface RequestPayload {
  startDate: string
  endDate: string
}

const FtdWidget = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>(
    MetricsFilterOptions.Monthly
  )
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const [loading, setLoading] = useState<boolean>(true)
  const [ftdSummary, setFtdSummary] = useState<FtdSummary>(null)
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

  const conversionRateTitle = useMemo(() => {
    if (selectedFilter === MetricsFilterOptions.Daily) {
      return 'Today conversion rate'
    }

    if (selectedFilter === MetricsFilterOptions.Weekly) {
      return `This week's conversion rate`
    }

    if (selectedFilter === MetricsFilterOptions.Monthly) {
      return `This month's conversion rate`
    }

    return 'Conversion rate'
  }, [selectedFilter])
  const averageAmountTitle = useMemo(() => {
    if (selectedFilter === MetricsFilterOptions.Daily) {
      return 'Today average amount'
    }

    if (selectedFilter === MetricsFilterOptions.Weekly) {
      return `This week's average amount`
    }

    if (selectedFilter === MetricsFilterOptions.Monthly) {
      return `This month's average amount`
    }

    return 'Average amount'
  }, [selectedFilter])
  const totalFtdsTitle = useMemo(() => {
    if (selectedFilter === MetricsFilterOptions.Daily) {
      return 'Today total FTDs'
    }

    if (selectedFilter === MetricsFilterOptions.Weekly) {
      return `This week's total FTDs`
    }

    if (selectedFilter === MetricsFilterOptions.Monthly) {
      return `This month's total FTDs`
    }

    return 'Total FTDs'
  }, [selectedFilter])

  const fetchFtdSummary = useCallback(
    async (requestPayload: RequestPayload) => {
      try {
        setLoading(true)
        const summary = await getFtdSummary(requestPayload)
        setFtdSummary(summary)
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
        columnWidth: '50%',
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
      name: conversionRateTitle,
      value: (ftdSummary?.conversionRate || 0) * 100,
    },
    { name: averageAmountTitle, value: ftdSummary?.averageAmount || 0 },
    { name: totalFtdsTitle, value: ftdSummary?.total || 0 },
  ].map(({ name, value }) => ({
    name,
    data: [Number(value.toFixed(2))],
  }))

  useEffect(() => {
    fetchFtdSummary(requestPayload)
  }, [requestPayload, fetchFtdSummary])

  return (
    <div className='space-y-6 rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]'>
      <div className='flex flex-col gap-5 sm:flex-row sm:justify-between'>
        <div className='w-full'>
          <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
            First Time Deposit Summary
          </h3>
          <p className='text-theme-sm mt-1 text-gray-500 dark:text-gray-400'>
            Summary of first time deposits
          </p>
        </div>
        <div className='flex w-full items-start gap-3 sm:justify-end'>
          {selectedFilter === MetricsFilterOptions.Daily && (
            <DatePicker
              id='date-ftd'
              placeholder='FTD Date'
              defaultDate={selectedDate}
              onChange={(value) => {
                const date = Array.isArray(value) ? value[0] : value
                setSelectedDate(date)
              }}
            />
          )}
          {selectedFilter === MetricsFilterOptions.Monthly && (
            <DatePicker
              id='date-ftd'
              placeholder='FTD Date'
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
        <div>
          <div className='mb-10 grid grid-cols-1 gap-5 md:grid-cols-3'>
            <Skeleton className='h-[110px] rounded-2xl' />
            <Skeleton className='h-[110px] rounded-2xl' />
            <Skeleton className='h-[110px] rounded-2xl' />
          </div>
          <div className='grid grid-cols-1'>
            <Skeleton className='h-[280px] rounded-2xl' />
          </div>
        </div>
      ) : (
        <div>
          <div className='mb-10 grid grid-cols-1 gap-5 md:grid-cols-3'>
            <MetricsCard
              title={conversionRateTitle}
              tooltipText='(FTD / total registrations)'
              value={`${((ftdSummary?.conversionRate || 0) * 100).toFixed(2)}%`}
            />
            <MetricsCard
              title={averageAmountTitle}
              value={`R$${(ftdSummary?.averageAmount || 0).toFixed(2)}`}
            />
            <MetricsCard
              title={totalFtdsTitle}
              value={ftdSummary?.total || 0}
            />
          </div>
          <div>
            <ReactApexChart
              options={options}
              series={series}
              type='bar'
              height={280}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default FtdWidget
