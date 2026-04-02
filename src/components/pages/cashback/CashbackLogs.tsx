'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getCashbackLogs } from '@/api/cashback'

import ComponentCard from '@/components/common/ComponentCard'
import { InputSearch } from '@/components/common/InputSearch'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import Pagination from '@/components/tables/Pagination'
import Badge from '@/components/ui/badge/Badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { CASHBACK_TYPE_COLORS, ICashbackLogs } from '@/types/cashback'
import { RAKEBACK_TYPE_OPTIONS } from '@/types/cashback'
import { SERVICE_TRANSACTION_STATUS } from '@/types/service'

export default function CashbackLogs() {
  const [isLoading, setIsLoading] = useState(false)
  const [tableData, setTableData] = useState<ICashbackLogs[]>([])
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)

  const fetchCashbackLogs = useCallback(
    async (filter?: string) => {
      setIsLoading(true)
      try {
        const response = await getCashbackLogs({
          page,
          limit,
          filter: filter || '',
        })
        if (response.success) {
          setTableData(response.rows)
          setTotalPages(response.pagination.totalPages)
        } else {
          toast.error('Failed to fetch cashback logs')
        }
      } catch (error) {
        console.error('Error fetching cashback logs:', error)
        toast.error('An error occurred while fetching cashback logs')
      } finally {
        setIsLoading(false)
      }
    },
    [page, limit]
  )

  useEffect(() => {
    fetchCashbackLogs()
  }, [fetchCashbackLogs])

  return (
    <ComponentCard
      title='Cashback Logs'
      backUrl='/cashback'
      inputSearchElement={<InputSearch fetchData={fetchCashbackLogs} />}
    >
      <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
        <div className='max-w-full overflow-x-auto'>
          <div className='min-w-[1102px]'>
            <Table>
              <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                <TableRow>
                  <TableCell
                    isHeader
                    className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                  >
                    Cashback Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                  >
                    Cashback Type
                  </TableCell>
                  <TableCell
                    isHeader
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                  >
                    Receiver
                  </TableCell>
                  <TableCell
                    isHeader
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                  >
                    Earning Amount
                  </TableCell>
                  <TableCell
                    isHeader
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                  >
                    Claim Date
                  </TableCell>
                  <TableCell
                    isHeader
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                  >
                    Claim Status
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                {tableData.length > 0 ? (
                  tableData.map((row: ICashbackLogs) => (
                    <TableRow key={row._id}>
                      <TableCell className='text-theme-sm px-5 py-3 text-left text-gray-500 dark:text-gray-400'>
                        {row.cashbackName}
                      </TableCell>
                      <TableCell
                        className={`text-theme-sm px-5 py-3 text-center ${CASHBACK_TYPE_COLORS[row.cashbackType] || 'text-gray-500'}`}
                      >
                        {RAKEBACK_TYPE_OPTIONS[row.cashbackType]?.label ||
                          'Unknown'}
                      </TableCell>
                      <TableCell className='text-theme-sm px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                        {row.userName}
                      </TableCell>
                      <TableCell className='text-theme-sm px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                        {row.amount}
                      </TableCell>
                      <TableCell className='text-theme-sm px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                        {row.updatedAt}
                      </TableCell>
                      <TableCell className='text-theme-sm px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                        <Badge
                          size='sm'
                          color={
                            row.status === SERVICE_TRANSACTION_STATUS.COMPLETED
                              ? 'success'
                              : 'error'
                          }
                        >
                          {row.status === SERVICE_TRANSACTION_STATUS.COMPLETED
                            ? 'Claimed'
                            : 'UnClaimed'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className='text-center'>
                      <p className='py-2 text-gray-500 dark:text-gray-400'>
                        No cashback logs found
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className='relative mb-5 flex items-center justify-center'>
              <Pagination
                totalPages={totalPages}
                currentPage={page}
                onPageChange={setPage}
                className='justify-center'
              />
              {isLoading && (
                <span className='absolute right-[-40px]'>
                  <LoadingSpinner className='h-6 w-6' />
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </ComponentCard>
  )
}
