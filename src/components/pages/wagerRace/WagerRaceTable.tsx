'use client'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { deleteWagerRace } from '@/api/wagerRace'

import { formatDate } from '@/lib/utils'

import ConfirmModal from '@/components/common/ConfirmModal'
import Loading from '@/components/common/Loading'
import Pagination from '@/components/tables/Pagination'
import Badge from '@/components/ui/badge/Badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { PencilIcon, TrashBinIcon } from '@/icons'

import {
  IWagerRace,
  PAYMENT_STATUS,
  WAGER_RACE_STATUS,
} from '@/types/wagerRace'

type WagerRaceTableProps = {
  tableData: IWagerRace[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  fetchWagerRace: () => void
  onEdit: (tier: IWagerRace) => void
}

export default function WagerRaceTable({
  tableData,
  totalPages,
  page,
  setPage,
  isLoading,
  setIsLoading,
  fetchWagerRace,
  onEdit,
}: WagerRaceTableProps) {
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>(null)
  const router = useRouter()

  const handleClose = useCallback(() => setOpenConfirm(false), [])

  const handleDelete = async (id: string) => {
    if (isLoading || !id) return
    try {
      setIsLoading(true)
      const res = await deleteWagerRace(id)
      if (res.success) {
        toast.success('Wager Race deleted successfully')
        fetchWagerRace()
      }
    } catch (error) {
      console.error('Error deleting tier:', error)
    } finally {
      setIsLoading(false)
      setDeleteId(null)
    }
  }

  useEffect(() => {
    fetchWagerRace()
  }, [page, fetchWagerRace])

  const getStatusColor = (status: string) => {
    switch (status) {
      case WAGER_RACE_STATUS.ACTIVE:
        return 'success'
      case WAGER_RACE_STATUS.COMPLETED:
        return 'error'
      case WAGER_RACE_STATUS.SCHEDULED:
        return 'warning'
      default:
        return 'primary'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case PAYMENT_STATUS.PAID:
        return 'success'
      case PAYMENT_STATUS.UNPAID:
        return 'error'
      default:
        return 'primary'
    }
  }

  const handleRowClick = (row: IWagerRace) => {
    // if (row.status !== WAGER_RACE_STATUS.ACTIVE) {
    //   toast.error('Wager Race is not active')
    //   return
    // }
    router.push(`/wager-race/${row._id}`)
  }

  return (
    <>
      {isLoading ? (
        <Loading />
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
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Title
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Min Wager
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Start Date
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        End Date
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Status
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Payment Status
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  {/* Table Body */}
                  <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                    {tableData &&
                      tableData.length > 0 &&
                      tableData.map((row) => (
                        <TableRow key={row._id}>
                          <TableCell className='text-brand-500 px-5 py-4 text-center hover:cursor-pointer hover:text-white sm:px-6'>
                            <span onClick={() => handleRowClick(row)}>
                              {row.title}
                            </span>
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {row.minWager}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {formatDate(row.period.start.toString())}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            {formatDate(row.period.end.toString())}
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            <Badge size='sm' color={getStatusColor(row.status)}>
                              {row.status}
                            </Badge>
                          </TableCell>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            <Badge
                              size='sm'
                              color={getPaymentStatusColor(row.paymentStatus)}
                            >
                              {row.paymentStatus}
                            </Badge>
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
                    {tableData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className='text-center'>
                          <p className='py-2 text-gray-500 dark:text-gray-400'>
                            No data found
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
            <ConfirmModal
              open={openConfirm}
              title='Are you Sure?'
              description='You can not restore deleted record.'
              handleConfirm={() => {
                handleDelete(deleteId)
              }}
              handleClose={handleClose}
            />
          </div>
        </>
      )}
    </>
  )
}
