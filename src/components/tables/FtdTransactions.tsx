'use client'
import moment from 'moment'
import React from 'react'

import { Skeleton } from '@/components/common/Skeleton'
import Pagination from '@/components/tables/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { formatDurationFromMs } from '@/types/date'
import { FtdTransaction } from '@/types/ftd'

type FtdTransactionsProps = {
  rows: FtdTransaction[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading?: boolean
}

export default function FtdTransactions({
  rows,
  totalPages,
  page,
  setPage,
  isLoading,
}: FtdTransactionsProps) {
  return (
    <>
      {isLoading ? (
        <Skeleton className='h-[155px] w-full rounded-2xl' />
      ) : (
        <>
          <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
            <div className='max-w-full overflow-x-auto'>
              <div className='min-w-[1102px]'>
                <Table>
                  {/* Table Header */}
                  <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                    <TableRow>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                      >
                        Username
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Time from registration
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Payment Method
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Ip Address
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        City
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Country
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Deposited At
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Deposit Claim Bonus
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Bonus Amount
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Bonus Claimed At
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  {/* Table Body */}
                  <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                    {rows &&
                      rows.length > 0 &&
                      rows.map((row) => (
                        <TableRow key={row._id}>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-left text-gray-500 dark:text-gray-400'>
                            {row.username}
                          </TableCell>
                          <TableCell className='px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                            {formatDurationFromMs(row.timeFromRegistration)}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 uppercase dark:text-gray-400'>
                            {row.paymentMethod}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {`R$${Number(
                              row.firstDeposit.exchangedAmount
                            ).toFixed(2)}`}
                          </TableCell>

                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {row.geo?.ip || 'N/A'}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {row.geo?.city || 'N/A'}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {row.geo?.country || 'N/A'}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {moment(row.firstDeposit.updatedAt).format(
                              'MMMM D, YYYY, h:mm'
                            )}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {row.bonus?.claimMethod || 'N/A'}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {row.bonus?.amount
                              ? `R$${Number(row.bonus.amount).toFixed(2)}`
                              : 'N/A'}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {row.bonus?.claimedAt
                              ? moment(row.bonus.claimedAt).format(
                                  'MMMM D, YYYY, h:mm'
                                )
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    {rows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={11} className='text-center'>
                          <p className='py-2 text-gray-500 dark:text-gray-400'>
                            No records yet
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <Pagination
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={setPage}
                  className='mb-5 justify-center'
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
