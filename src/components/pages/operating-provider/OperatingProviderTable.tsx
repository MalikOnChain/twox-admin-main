'use client'
import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { deleteProvider } from '@/api/operating-providers'

import { formatNumber } from '@/lib/utils'

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

import { PencilIcon, TrashBinIcon } from '@/icons'

import { IOperatingProvider } from '@/types/operating-provider'

type ProviderTableProps = {
  providers: IOperatingProvider[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  fetchProviders: () => void
  onEdit: (provider: IOperatingProvider) => void
}

export default function OperatingProviderTable({
  providers,
  totalPages,
  page,
  setPage,
  isLoading,
  setIsLoading,
  fetchProviders,
  onEdit,
}: ProviderTableProps) {
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>(null)

  const handleClose = useCallback(() => setOpenConfirm(false), [])

  const handleDelete = async (id: string) => {
    if (isLoading || !id) return
    try {
      setIsLoading(true)
      const res = await deleteProvider(id)
      if (res.message) {
        toast.success('Provider deleted successfully')
        fetchProviders()
      }
    } catch (error) {
      console.error('Error deleting provider:', error)
      toast.error(error.message || 'Failed to delete provider')
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
                        Name
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Description
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Total Amount
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
                    {providers &&
                      providers.length > 0 &&
                      providers.map((provider) => (
                        <TableRow key={provider._id}>
                          <TableCell className='text-theme-sm cursor-default px-4 py-3 text-left'>
                            <Link
                              href={`/operating-providers/${provider._id}?name=${provider.name}`}
                              className='text-gray-500 dark:text-gray-400 dark:hover:text-gray-300'
                            >
                              {provider.name}
                            </Link>
                          </TableCell>
                          <TableCell className='px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                            {provider.description}
                          </TableCell>
                          <TableCell className='px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                            {`R$${formatNumber(provider.totalAmount || 0)}`}
                          </TableCell>
                          <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                            <div className='flex items-center justify-center gap-2'>
                              <a
                                className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                                onClick={() => {
                                  onEdit(provider)
                                }}
                              >
                                <PencilIcon />
                              </a>
                              <a
                                className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                                onClick={() => {
                                  setDeleteId(provider._id)
                                  setOpenConfirm(true)
                                }}
                              >
                                <TrashBinIcon />
                              </a>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}

                    {providers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className='text-center'>
                          <p className='py-2 text-gray-500 dark:text-gray-400'>
                            No providers found
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
              description='You can not restore deleted bonus.'
              handleConfirm={() => handleDelete(deleteId)}
              handleClose={handleClose}
            />
          </div>
        </>
      )}
    </>
  )
}
