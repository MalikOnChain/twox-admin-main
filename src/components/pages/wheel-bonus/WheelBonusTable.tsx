'use client'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { deleteWheelBonus } from '@/api/wheelBonus'
import { WheelBonus } from '@/api/wheelBonus'

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

import { ChevronDownIcon, PencilIcon, TrashBinIcon } from '@/icons'

type WheelBonusWithStringStatus = Omit<WheelBonus, 'status'> & {
  status: 'active' | 'inactive'
}

type WheelBonusTableProps = {
  wheelBonuses: WheelBonusWithStringStatus[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  fetchWheelBonuses: () => void
  onEdit: (wheelBonus: WheelBonusWithStringStatus) => void
}

export default function WheelBonusTable({
  wheelBonuses,
  totalPages,
  page,
  setPage,
  isLoading,
  setIsLoading,
  fetchWheelBonuses,
  onEdit,
}: WheelBonusTableProps) {
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>(null)
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>(
    {}
  )

  const handleClose = useCallback(() => setOpenConfirm(false), [])

  const handleDelete = async (id: string) => {
    if (isLoading || !id) return
    try {
      setIsLoading(true)
      const res = await deleteWheelBonus(id)
      if (res.success) {
        toast.success('Wheel bonus deleted successfully')
        fetchWheelBonuses()
      }
    } catch (error) {
      console.error('Error deleting wheel bonus:', error)
      toast.error(error.message || 'Failed to delete wheel bonus')
    } finally {
      setIsLoading(false)
      setDeleteId(null)
      setOpenConfirm(false)
    }
  }

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
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
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Status
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Valid Period
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                    {wheelBonuses && wheelBonuses.length > 0 ? (
                      wheelBonuses.map((wheelBonus) => {
                        const isExpanded = expandedRows[wheelBonus._id]
                        return (
                          <React.Fragment key={wheelBonus._id}>
                            <TableRow>
                              <TableCell className='text-theme-sm cursor-default px-4 py-3 text-left text-gray-500 dark:text-gray-400'>
                                <div className='flex items-center gap-2'>
                                  <span
                                    className='text-theme-xs cursor-pointer text-gray-500 dark:text-gray-400'
                                    onClick={() => toggleRow(wheelBonus._id)}
                                  >
                                    <ChevronDownIcon
                                      className={`transform transition-transform ${
                                        isExpanded ? 'rotate-180' : ''
                                      }`}
                                    />
                                  </span>
                                  <span>{wheelBonus.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                                <Badge
                                  size='sm'
                                  color={
                                    wheelBonus.status === 'active'
                                      ? 'success'
                                      : 'error'
                                  }
                                >
                                  {wheelBonus.status === 'active'
                                    ? 'Active'
                                    : 'Inactive'}
                                </Badge>
                              </TableCell>
                              <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                                {new Date(
                                  wheelBonus.validFrom
                                ).toLocaleDateString()}{' '}
                                -{' '}
                                {new Date(
                                  wheelBonus.validTo
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                                <div className='flex items-center justify-center space-x-2'>
                                  <button
                                    onClick={() => onEdit(wheelBonus)}
                                    className='text-primary-500 hover:text-primary-600'
                                  >
                                    <PencilIcon />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDeleteId(wheelBonus._id)
                                      setOpenConfirm(true)
                                    }}
                                    className='text-warning-500 hover:text-warning-600'
                                  >
                                    <TrashBinIcon />
                                  </button>
                                </div>
                              </TableCell>
                            </TableRow>

                            {isExpanded && (
                              <TableRow className='bg-gray-50 dark:bg-white/[0.02]'>
                                <TableCell colSpan={4}>
                                  <div className='p-4'>
                                    <div className='mb-4'>
                                      <h6 className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-200'>
                                        Bonus Amounts
                                      </h6>
                                      <div className='grid grid-cols-4 gap-4'>
                                        {wheelBonus.wheelBonusAmounts.map(
                                          (amount, index) => (
                                            <div
                                              key={index}
                                              className='rounded-lg bg-white p-3 shadow dark:bg-gray-800'
                                            >
                                              <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                Bonus {index + 1}
                                              </p>
                                              <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                                                {amount}
                                              </p>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <h6 className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-200'>
                                        Bonus Weights
                                      </h6>
                                      <div className='grid grid-cols-4 gap-4'>
                                        {wheelBonus.wheelBonusWeights.map(
                                          (weight, index) => (
                                            <div
                                              key={index}
                                              className='rounded-lg bg-white p-3 shadow dark:bg-gray-800'
                                            >
                                              <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                Weight {index + 1}
                                              </p>
                                              <p className='text-lg font-semibold text-gray-900 dark:text-white'>
                                                {weight}
                                              </p>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className='text-center'>
                          <p className='py-2 text-gray-500 dark:text-gray-400'>
                            No wheel bonuses found
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div className='mt-4 flex justify-end'>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      <ConfirmModal
        open={openConfirm}
        title='Delete Wheel Bonus'
        description='Are you sure you want to delete this wheel bonus?'
        handleConfirm={() => handleDelete(deleteId)}
        handleClose={handleClose}
      />
    </>
  )
}
