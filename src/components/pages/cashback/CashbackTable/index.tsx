'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { deleteCashback } from '@/api/cashback'

import ConfirmModal from '@/components/common/ConfirmModal'
import Loading from '@/components/common/Loading'
import Pagination from '@/components/tables/Pagination'
import Badge from '@/components/ui/badge/Badge'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

import { ChevronDownIcon, PencilIcon, TrashBinIcon } from '@/icons'

import ExpandedRow from './ExpandedRow'
import TableHeader from './TableHeader'

import {
  ICashbackData,
  ICashbackTableData,
  ICashbackTier,
  RAKEBACK_TYPE_OPTIONS,
} from '@/types/cashback'

type CashbackTableProps = {
  tableData: ICashbackTableData
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  fetchCashbacks: () => void
  onEdit: (cashback: ICashbackData) => void
  isEdit: boolean
  setIsEdit: (isEdit: boolean) => void
}

export default function CashbackTable({
  tableData,
  totalPages,
  page,
  setPage,
  isLoading,
  setIsLoading,
  fetchCashbacks,
  onEdit,
  isEdit,
  setIsEdit,
}: CashbackTableProps) {
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [expandedRows, setExpandedRows] = React.useState<{
    [key: string]: ICashbackTier[]
  }>({})

  const toggleRow = (tiers: ICashbackTier[], id: string) => {
    setExpandedRows((prev) => {
      if (prev[id]?.length > 0) return { ...prev, [id]: [] }
      return { [id]: tiers }
    })
  }

  const handleClose = useCallback(() => setOpenConfirm(false), [])

  const handleDelete = async (id: string) => {
    if (isLoading || !id) return
    try {
      setIsLoading(true)
      const res = await deleteCashback(id)
      if (res.success) {
        toast.success('Cashback deleted successfully')
        fetchCashbacks()
      } else {
        toast.error('Failed to delete cashback')
      }
    } catch (error) {
      console.error('Error deleting cashback:', error)
      toast.error('An error occurred while deleting cashback')
    } finally {
      setIsLoading(false)
      setDeleteId(null)
    }
  }

  useEffect(() => {
    if (isEdit) {
      fetchCashbacks()
      setIsEdit(false)
    }
  }, [isEdit, fetchCashbacks, setIsEdit])

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
          <div className='max-w-full overflow-x-auto'>
            <div className='min-w-[1102px]'>
              <Table>
                <TableHeader />

                <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                  {tableData.cashbacks.length > 0 ? (
                    tableData.cashbacks.map((row: ICashbackData) => {
                      const isExpanded = expandedRows[row._id]?.length > 0
                      return (
                        <React.Fragment key={row._id}>
                          <TableRow>
                            <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                              <div className='flex items-center gap-2'>
                                <span
                                  className='text-theme-xs cursor-pointer text-gray-500 dark:text-gray-400'
                                  onClick={() => toggleRow(row.tiers, row._id)}
                                >
                                  <ChevronDownIcon
                                    className={`transform transition-transform ${
                                      isExpanded ? 'rotate-180' : ''
                                    }`}
                                  />
                                </span>
                                <span>{row.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className='text-theme-sm px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                              {RAKEBACK_TYPE_OPTIONS[row.type].label}
                            </TableCell>
                            <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                              <Badge
                                size='sm'
                                color={row.status === 1 ? 'success' : 'error'}
                              >
                                {row.status === 1 ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                              <div className='flex items-center justify-center gap-2'>
                                <button
                                  className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                                  onClick={() => onEdit(row)}
                                >
                                  <PencilIcon />
                                </button>
                                <button
                                  className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                                  onClick={() => {
                                    setDeleteId(row._id)
                                    setOpenConfirm(true)
                                  }}
                                >
                                  <TrashBinIcon />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>

                          {isExpanded && <ExpandedRow tiers={row.tiers} />}
                        </React.Fragment>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className='text-center'>
                        <p className='py-2 text-gray-500 dark:text-gray-400'>
                          No cashbacks found
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
      )}
    </>
  )
}
