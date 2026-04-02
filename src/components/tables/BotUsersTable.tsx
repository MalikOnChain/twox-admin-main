'use client'
import moment from 'moment'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { deleteBotUser } from '@/api/bot-users'

import { formatNumber } from '@/lib/utils'

import ConfirmModal from '@/components/common/ConfirmModal'
import Loading from '@/components/common/Loading'
import Pagination from '@/components/tables/Pagination'
import UserAvatar from '@/components/ui/avatar/UserAvatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { TrashBinIcon } from '@/icons'
import { PencilIcon } from '@/icons'

import { IBotUserData } from '@/types/bot-users'

type BotUsersTableProps = {
  tableData: IBotUserData[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  fetchBotUsers: () => void
  onEdit: (row: IBotUserData) => void
}

export default function BotUsersTable({
  tableData,
  totalPages,
  page,
  setPage,
  isLoading,
  setIsLoading,
  fetchBotUsers,
  onEdit,
}: BotUsersTableProps) {
  const [deleteId, setDeleteId] = useState<string>(null)
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)

  const handleClose = useCallback(() => setOpenConfirm(false), [])

  const handleDelete = async (id: string) => {
    if (isLoading || !id) return
    try {
      setIsLoading(true)
      const res = await deleteBotUser({ id })
      if (res.success) {
        toast.success('Bot user deleted successfully')
        fetchBotUsers()
      }
    } catch (error) {
      console.error('Error deleting bonus:', error)
      toast.error(error.message || 'Failed to delete bonus')
    } finally {
      setIsLoading(false)
      setDeleteId(null)
      setOpenConfirm(false)
    }
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
          <div className='max-w-full overflow-x-auto'>
            <div className='min-w-[1102px]'>
              <Table>
                {/* Table Header */}
                <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                  <TableRow>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      User
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Rank
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Wager
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      minMultiplier
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      maxMultiplier
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      minBet
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      maxBet
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Member Since
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                  {tableData &&
                    tableData.length > 0 &&
                    tableData.map((row) => (
                      <TableRow key={row._id}>
                        <TableCell className='px-5 py-4 text-start sm:px-6'>
                          <div className='flex items-center gap-3'>
                            <UserAvatar
                              src={row.avatar}
                              alt={row.username}
                              size='large'
                              status='online'
                              className='cursor-pointer'
                            />
                            <span className='text-theme-sm block font-medium text-gray-800 dark:text-white/90'>
                              {row.username}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          {row.rank || '-'}
                        </TableCell>
                        <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          <span className='text-theme-xs block text-gray-500 dark:text-gray-400'>
                            {formatNumber(Number(Number(row.wager).toFixed(2)))}
                          </span>
                        </TableCell>
                        <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          {row.minMultiplier || '-'}
                        </TableCell>
                        <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          {row.maxMultiplier || '-'}
                        </TableCell>
                        <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          {row.minBet || '-'}
                        </TableCell>
                        <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          {row.maxBet || '-'}
                        </TableCell>
                        <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          {moment(row.createdAt).format('YYYY-MM-DD')}
                        </TableCell>
                        <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          <div className='flex items-center justify-center gap-2'>
                            <a
                              className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                              onClick={() => {
                                onEdit(row)
                              }}
                            >
                              <PencilIcon />
                            </a>
                            <a
                              className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                              onClick={() => {
                                setDeleteId(row._id)
                                setOpenConfirm(true)
                              }}
                            >
                              <TrashBinIcon />
                            </a>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
          <ConfirmModal
            open={openConfirm}
            title='Are you Sure?'
            description='You can not restore deleted bot user.'
            handleConfirm={() => handleDelete(deleteId)}
            handleClose={handleClose}
          />
        </div>
      )}
    </>
  )
}
