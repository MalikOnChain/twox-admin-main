'use client'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { deleteTier } from '@/api/tier'

import ConfirmModal from '@/components/common/ConfirmModal'
import Loading from '@/components/common/Loading'
import Pagination from '@/components/tables/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ChevronDownIcon, PencilIcon, TrashBinIcon } from '@/icons'

import { ITierData, ITierLevel } from '@/types/tier'

type TierTableProps = {
  tableData: ITierData[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  fetchTiers: () => void
  onEdit: (tier: ITierData) => void
}

export default function TierTable({
  tableData,
  totalPages,
  page,
  setPage,
  isLoading,
  setIsLoading,
  fetchTiers,
  onEdit,
}: TierTableProps) {
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<{
    id: string
    levelId?: string
  } | null>(null)

  const [expandedRows, setExpandedRows] = useState<{
    [key: string]: ITierLevel[]
  }>({})

  const toggleRow = (levels: ITierLevel[], id: string) => {
    setExpandedRows((prev) => {
      if (prev[id]?.length > 0) return { ...prev, [id]: [] }
      return { [id]: levels }
    })
  }

  const handleClose = useCallback(() => setOpenConfirm(false), [])

  const handleDelete = async (id: string, levelId?: string) => {
    if (isLoading || !id) return
    try {
      setIsLoading(true)
      const res = await deleteTier(id, levelId)
      if (res.success) {
        toast.success('Tier deleted successfully')
        fetchTiers()
      }
    } catch (error) {
      console.error('Error deleting tier:', error)
    } finally {
      setIsLoading(false)
      setDeleteId(null)
    }
  }

  useEffect(() => {
    fetchTiers()
  }, [page, fetchTiers])

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
                      />
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Name
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Downgrade Period
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
                      tableData.map((row, index) => {
                        const isExpanded = expandedRows[row._id]?.length > 0
                        return (
                          <React.Fragment key={row._id}>
                            <TableRow key={index}>
                              <TableCell className='px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                                <div className='flex items-center gap-2'>
                                  {row.levels.length > 0 && (
                                    <span
                                      className='text-theme-xs cursor-pointer text-gray-500 dark:text-gray-400'
                                      onClick={() =>
                                        toggleRow(row.levels, row._id)
                                      }
                                    >
                                      <ChevronDownIcon
                                        className={`transform transition-transform ${
                                          isExpanded ? 'rotate-180' : ''
                                        }`}
                                      />
                                    </span>
                                  )}
                                  <span>
                                    <Image
                                      src={row.icon}
                                      alt={row.name}
                                      width={0}
                                      height={0}
                                      sizes='100vw'
                                      className='h-10 w-10 rounded-full object-contain'
                                    />
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className='px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                                {row.name}
                              </TableCell>
                              <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                                {row.downgradePeriod}
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
                                      setDeleteId({ id: row._id })
                                      setOpenConfirm(true)
                                    }}
                                  >
                                    <TrashBinIcon />
                                  </a>
                                </div>
                              </TableCell>
                            </TableRow>
                            {isExpanded && (
                              <TableRow className='bg-black'>
                                <TableCell colSpan={4}>
                                  <Table className=''>
                                    <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                                      <TableRow>
                                        <TableCell
                                          isHeader
                                          className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                                        />
                                        <TableCell
                                          isHeader
                                          className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                                        >
                                          Level
                                        </TableCell>
                                        <TableCell
                                          isHeader
                                          className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                                        >
                                          Name
                                        </TableCell>
                                        <TableCell
                                          isHeader
                                          className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                                        >
                                          Min XP
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
                                      {row.levels.length > 0 ? (
                                        row.levels.map((level) => (
                                          <TableRow key={level.level}>
                                            <TableCell className='bg-gray-50 px-5 py-3 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                                              <div className='flex items-center justify-center'>
                                                <Image
                                                  src={level.icon}
                                                  alt={level.name}
                                                  width={0}
                                                  height={0}
                                                  sizes='100vw'
                                                  className='h-10 w-10 rounded-full object-contain'
                                                />
                                              </div>
                                            </TableCell>
                                            <TableCell className='bg-gray-50 px-5 py-3 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                                              <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                {level.level}
                                              </p>
                                            </TableCell>
                                            <TableCell className='bg-gray-50 px-5 py-3 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                                              <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                {level.name}
                                              </p>
                                            </TableCell>
                                            <TableCell className='bg-gray-50 px-5 py-3 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                                              <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                {level.minXP}
                                              </p>
                                            </TableCell>
                                            <TableCell className='text-theme-sm px-5 py-4 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                                              <div className='flex items-center justify-center gap-2'>
                                                <a
                                                  className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                                                  onClick={() => {
                                                    setDeleteId({
                                                      id: row._id,
                                                      levelId: level._id,
                                                    })
                                                    setOpenConfirm(true)
                                                  }}
                                                >
                                                  <TrashBinIcon />
                                                </a>
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                        ))
                                      ) : (
                                        <TableRow>
                                          <TableCell
                                            colSpan={4}
                                            className='px-5 py-4 text-center'
                                          >
                                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                              No levels found
                                            </p>
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        )
                      })}
                    {tableData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className='text-center'>
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
                handleDelete(deleteId?.id, deleteId?.levelId)
              }}
              handleClose={handleClose}
            />
          </div>
        </>
      )}
    </>
  )
}
