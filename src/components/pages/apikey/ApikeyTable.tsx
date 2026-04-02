'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { deleteApikey } from '@/api/apikey'

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

import { IApikeyData, IApikeyHistory } from '@/types/apikey'

type ApikeyTableProps = {
  tableData: IApikeyData[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  fetchApikeys: () => void
  onEdit: (tier: IApikeyData) => void
}

export default function ApikeyTable({
  tableData,
  totalPages,
  page,
  setPage,
  isLoading,
  setIsLoading,
  fetchApikeys,
  onEdit,
}: ApikeyTableProps) {
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<{
    id: string
    apiKey?: string
  } | null>(null)

  const [expandedRows, setExpandedRows] = useState<{
    [key: string]: IApikeyHistory[]
  }>({})

  const toggleRow = (history: IApikeyHistory[], id: string) => {
    setExpandedRows((prev) => {
      if (prev[id]?.length > 0) return { ...prev, [id]: [] }
      return { [id]: history }
    })
  }

  const handleClose = useCallback(() => setOpenConfirm(false), [])

  const handleDelete = async (id: string, apiKey?: string) => {
    if (isLoading || !id) return
    try {
      setIsLoading(true)
      const res = await deleteApikey(id, apiKey)
      if (res.success) {
        toast.success('API Key deleted successfully')
        fetchApikeys()
      }
    } catch (error) {
      console.error('Error deleting API Key:', error)
    } finally {
      setIsLoading(false)
      setDeleteId(null)
    }
  }

  useEffect(() => {
    fetchApikeys()
  }, [page, fetchApikeys])

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
                        Label
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        API Key
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
                        ExpiryDate
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Created By
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
                                  {row.history.length > 0 && (
                                    <span
                                      className='text-theme-xs cursor-pointer text-gray-500 dark:text-gray-400'
                                      onClick={() =>
                                        toggleRow(row.history, row._id)
                                      }
                                    >
                                      <ChevronDownIcon
                                        className={`transform transition-transform ${
                                          isExpanded ? 'rotate-180' : ''
                                        }`}
                                      />
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className='py-4 text-center text-gray-500 dark:text-gray-400'>
                                {row.name}
                              </TableCell>
                              <TableCell className='py-4 text-center text-gray-500 dark:text-gray-400'>
                                {row.label}
                              </TableCell>
                              <TableCell className='text-theme-sm cursor-default py-3 text-center text-gray-500 dark:text-gray-400'>
                                {row.apiKey}
                              </TableCell>
                              <TableCell className='text-theme-sm cursor-default py-3 text-center text-gray-500 dark:text-gray-400'>
                                {row.status ? (
                                  <span className='text-green-300'>Active</span>
                                ) : (
                                  <span className='text-error-300'>
                                    Disable
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className='text-theme-sm cursor-default py-3 text-center text-gray-500 dark:text-gray-400'>
                                {row.expiryDate
                                  ? new Date(row.expiryDate).toDateString()
                                  : '—'}
                              </TableCell>
                              <TableCell className='text-theme-sm cursor-default py-3 text-center text-gray-500 dark:text-gray-400'>
                                {row.createdBy?.username}
                              </TableCell>
                              <TableCell className='text-theme-sm py-3 text-center text-gray-500 dark:text-gray-400'>
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
                                <TableCell colSpan={8}>
                                  <Table className='w-full'>
                                    <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                                      <TableRow>
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
                                          Label
                                        </TableCell>
                                        <TableCell
                                          isHeader
                                          className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                                        >
                                          API Key
                                        </TableCell>
                                        <TableCell
                                          isHeader
                                          className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                                        >
                                          Created At
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
                                      {row.history.length > 0 ? (
                                        row.history.map((item) => (
                                          <TableRow key={item.apiKey}>
                                            <TableCell className='bg-gray-50 px-5 py-3 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                                              <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                {item.name}
                                              </p>
                                            </TableCell>
                                            <TableCell className='bg-gray-50 px-5 py-3 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                                              <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                {item.label}
                                              </p>
                                            </TableCell>
                                            <TableCell className='bg-gray-50 px-5 py-3 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                                              <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                {item.apiKey}
                                              </p>
                                            </TableCell>
                                            <TableCell className='bg-gray-50 px-5 py-3 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                                              <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                {item.createdAt
                                                  ? new Date(
                                                      item.createdAt
                                                    ).toDateString()
                                                  : '—'}
                                              </p>
                                            </TableCell>
                                            <TableCell className='text-theme-sm px-5 py-4 text-center text-black dark:bg-white/[0.02] dark:text-gray-400'>
                                              <div className='flex items-center justify-center gap-2'>
                                                <a
                                                  className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                                                  onClick={() => {
                                                    setDeleteId({
                                                      id: row._id,
                                                      apiKey: item.apiKey,
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
                                              No history found
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
                handleDelete(deleteId?.id, deleteId?.apiKey)
              }}
              handleClose={handleClose}
            />
          </div>
        </>
      )}
    </>
  )
}
