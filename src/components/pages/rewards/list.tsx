'use client'
import React from 'react'

import Loading from '@/components/common/Loading'
import Pagination from '@/components/tables/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { IReward } from '@/types/affiliate'

type RewardTableProps = {
  rewards: IReward[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading: boolean
}

export default function RewardTable({
  rewards,
  totalPages,
  page,
  setPage,
  isLoading,
}: RewardTableProps) {
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
            <div className='max-w-full overflow-x-auto'>
              <Table>
                {/* Table Header */}
                <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                  <TableRow>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                    >
                      Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                    >
                      Amount
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                  {rewards &&
                    rewards.length > 0 &&
                    rewards.map((reward) => (
                      <TableRow key={reward._id}>
                        <TableCell className='text-center'>
                          {reward.name}
                        </TableCell>
                        <TableCell className='text-center'>
                          {reward.amount}
                        </TableCell>
                        <TableCell className='text-center'>
                          {reward.status}
                        </TableCell>
                      </TableRow>
                    ))}

                  {rewards.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className='text-center'>
                        <p className='py-2 text-gray-500 dark:text-gray-400'>
                          No rewards found
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
