'use client'

import moment from 'moment'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  deleteGameCategory,
  getGameCategories,
} from '@/api/casino/game-category'

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

import { IGameCategory } from '@/types/game-category'

export default function GameCategoriesList() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [tableData, setTableData] = useState<IGameCategory[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)

  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchData = async (params?: { page?: number }) => {
    try {
      setIsLoading(true)
      const response = await getGameCategories({
        limit,
        page: params?.page ?? page,
      })

      if (response.success) {
        setTableData(response.data)
        setTotalPages(response.pagination.totalPages)
        setPage(response.pagination.page)
      } else {
        console.error('Failed to fetch categories:', response.message)
        toast.error(response.message || 'Failed to fetch categories')
      }
    } catch (error) {
      console.error('Error fetching game categories:', error)
      toast.error('Failed to fetch categories')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setPage(page)
    fetchData({ page })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClose = useCallback(() => setDeleteId(null), [])

  const handleDelete = async () => {
    if (!deleteId || isDeleting) return

    setIsDeleting(true)
    try {
      const result = await deleteGameCategory(deleteId)
      if (result.success) {
        await fetchData()
        setDeleteId(null)
        toast.success('Game category deleted successfully')
      } else {
        toast.error(result.message || 'Failed to delete game category')
      }
    } catch (error) {
      console.error('Error deleting game category:', error)
      toast.error('Failed to delete game category')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className='space-y-4'>
        <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
          <div className='max-w-full overflow-x-auto'>
            <Table>
              <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                <TableRow>
                  <TableCell
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    isHeader
                  >
                    Title
                  </TableCell>
                  <TableCell
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    isHeader
                  >
                    Display Order
                  </TableCell>
                  <TableCell
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    isHeader
                  >
                    Status
                  </TableCell>
                  <TableCell
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    isHeader
                  >
                    Games Count
                  </TableCell>
                  <TableCell
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    isHeader
                  >
                    Modified At
                  </TableCell>
                  <TableCell
                    isHeader
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center'>
                      <Loading />
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {tableData.map((row) => (
                      <TableRow key={row._id}>
                        <TableCell className='text-theme-sm px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                          <div className='flex items-center gap-2'>
                            {row.isPinned && (
                              <span className='inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'>
                                Pinned
                              </span>
                            )}
                            <p className='font-medium'>{row.title}</p>
                          </div>
                        </TableCell>
                        <TableCell className='text-theme-sm px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                          {row.displayOrder}
                        </TableCell>
                        <TableCell className='text-theme-sm px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              row.isActive
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {row.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell className='text-theme-sm px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                          {row.games.length}
                        </TableCell>
                        <TableCell className='text-theme-sm px-5 py-3 text-center text-gray-500 dark:text-gray-400'>
                          {moment(row.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                        </TableCell>
                        <TableCell className='flex items-center justify-center gap-1 px-5 py-3'>
                          <Link
                            href={`/games/categories/${row._id}`}
                            className='text-brand-500 hover:text-brand-600'
                          >
                            <PencilIcon />
                          </Link>
                          <button
                            className='cursor-pointer text-red-500 hover:text-red-600'
                            onClick={() => setDeleteId(row._id)}
                            disabled={isDeleting}
                          >
                            <TrashBinIcon />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {tableData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className='text-center'>
                          <p className='py-2 text-gray-500 dark:text-gray-400'>
                            No record found
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={page}
                onPageChange={handlePageChange}
                className='mb-5 justify-center'
              />
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteId}
        title='Are you Sure?'
        description='You can not restore deleted record.'
        handleConfirm={handleDelete}
        handleClose={handleClose}
      />
    </>
  )
}
