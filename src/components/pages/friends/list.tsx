'use client'
import moment from 'moment'
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

import { IUser } from '@/types/affiliate'

type FriendTableProps = {
  friends: IUser[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading: boolean
}

export default function FriendTable({
  friends,
  totalPages,
  page,
  setPage,
  isLoading,
}: FriendTableProps) {
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
                      Email
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                    >
                      Member Since
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                  {friends &&
                    friends.length > 0 &&
                    friends.map((friend) => (
                      <TableRow key={friend._id}>
                        <TableCell className='text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400'>
                          {friend.username}
                        </TableCell>
                        <TableCell className='text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400'>
                          {friend?.email}
                        </TableCell>
                        <TableCell className='text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400'>
                          {moment(friend?.createdAt).format(
                            'YYYY-MM-DD HH:mm:ss'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}

                  {friends.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className='text-center'>
                        <p className='py-2 text-gray-500 dark:text-gray-400'>
                          No friends found
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
