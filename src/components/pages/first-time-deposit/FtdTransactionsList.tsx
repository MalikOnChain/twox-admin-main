'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { getFtdTransactions } from '@/api/metrics'

import DatePicker from '@/components/form/date-picker'
import FtdTransactions from '@/components/tables/FtdTransactions'

interface RequestPayload {
  startDate: string
  endDate: string
}
const FtdTransactionsList = () => {
  const [ftdTransactions, setFtdTransactions] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [isLoadingTx, setIsLoadingTx] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(5)
  const now = new Date()

  // First day of the current month
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Last day of the current month
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const [startDate, setStartDate] = useState<Date>(firstDayOfMonth)
  const [endDate, setEndDate] = useState<Date>(lastDayOfMonth)

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  const requestDatePayload: RequestPayload = useMemo(() => {
    const startedDate = new Date(startDate)
    const endedDate = new Date(endDate)

    return {
      startDate: formatDate(startedDate),
      endDate: formatDate(endedDate),
    }
  }, [startDate, endDate])

  const fetchFtdTransactions = useCallback(
    async (page: number, limit: number, payload: RequestPayload) => {
      try {
        setIsLoadingTx(true)
        const response = await getFtdTransactions({
          page,
          limit,
          ...payload,
        })
        setFtdTransactions(response.rows)
        setTotalPages(response.pagination.totalPages)
        setPage(response.pagination.currentPage)
      } catch (error) {
        if (error instanceof Error) {
          console.error('error', error.message)
          toast.error(error.message)
        } else {
          toast.error('Error fetching FTD summary')
        }
      } finally {
        setIsLoadingTx(false)
      }
    },
    []
  )

  useEffect(() => {
    fetchFtdTransactions(page, limit, requestDatePayload)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate])

  const handleChangePage = (page: number) => {
    setPage(page)
    fetchFtdTransactions(page, limit, requestDatePayload)
  }

  return (
    <div className='space-y-6 rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 sm:px-6 sm:pt-6 dark:border-gray-800 dark:bg-white/[0.03]'>
      <div className='flex flex-col gap-5 sm:flex-row sm:justify-between'>
        <div className='flex w-full items-center justify-between'>
          <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
            First Time Deposit Breakdown
          </h3>
          <div className='flex items-center gap-4'>
            <span className='text-base font-semibold text-gray-800 dark:text-white/90'>
              From
            </span>
            <DatePicker
              id='date-from-ftd'
              placeholder='FTD Date'
              defaultDate={startDate}
              maxDate={endDate}
              onChange={(value) => {
                const date = Array.isArray(value) ? value[0] : value
                setStartDate(date)
              }}
            />
            <span className='text-base font-semibold text-gray-800 dark:text-white/90'>
              To
            </span>
            <DatePicker
              id='date-to-ftd'
              placeholder='FTD Date'
              defaultDate={endDate}
              minDate={startDate}
              onChange={(value) => {
                const date = Array.isArray(value) ? value[0] : value
                setEndDate(date)
              }}
            />
          </div>
        </div>
      </div>
      <FtdTransactions
        totalPages={totalPages}
        rows={ftdTransactions}
        page={page}
        setPage={handleChangePage}
        isLoading={isLoadingTx}
      />
    </div>
  )
}

export default FtdTransactionsList
