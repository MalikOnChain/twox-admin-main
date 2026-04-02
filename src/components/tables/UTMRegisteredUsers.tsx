'use client'
import { formatDate } from '@fullcalendar/core/index.js'
import React from 'react'

import { getUtmSourceOptions } from '@/lib/utils'

import { Skeleton } from '@/components/common/Skeleton'
import Pagination from '@/components/tables/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { UTMUser } from '@/types/utm-track'

type UTMRegisteredUsersProps = {
  rows: UTMUser[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading?: boolean
}

const UTM_SOURCE_OPTIONS = getUtmSourceOptions()

export default function UTMRegisteredUsers({
  rows,
  totalPages,
  page,
  setPage,
  isLoading,
}: UTMRegisteredUsersProps) {
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
                        Email
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        UTM Source
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        UTM Campaign
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        First Deposit Amount
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Second Deposit Amount
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Registered At
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  {/* Table Body */}
                  <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                    {rows &&
                      rows.length > 0 &&
                      rows.map((row) => (
                        <TableRow key={row._id}>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {row.username}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {row.email}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {
                              UTM_SOURCE_OPTIONS.find(
                                (option) => option.value === row.utm_source
                              )?.label
                            }
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {row.utm_campaign}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {`R$${Number(row.firstDepositAmount).toFixed(2)}`}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {`R$${Number(row.secondDepositAmount).toFixed(2)}`}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {row.createdAt ? formatDate(row.createdAt) : 'N/A'}
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
