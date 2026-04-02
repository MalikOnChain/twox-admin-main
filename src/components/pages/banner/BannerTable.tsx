'use client'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { deleteBanner } from '@/api/banner'

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

import { IBannerData } from '@/types/banner'

type BannerTableProps = {
  bannerData: IBannerData[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  setIsLoading: (isLoading: boolean) => void
  isLoading: boolean
  fetchBanners: () => void
  onEdit: (banner: IBannerData) => void
}

export default function BannerTable({
  bannerData,
  totalPages,
  page,
  setPage,
  isLoading,
  setIsLoading,
  fetchBanners,
  onEdit,
}: BannerTableProps) {
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>('')

  const handleClose = useCallback(() => setOpenConfirm(false), [])

  const handleDelete = async (id: string) => {
    if (isLoading || !id) return
    try {
      setIsLoading(true)
      const res = await deleteBanner(id)
      if (res.success) {
        toast.success('Tier deleted successfully')
        fetchBanners()
      }
    } catch (error) {
      console.error('Error deleting tier:', error)
    } finally {
      setIsLoading(false)
      setDeleteId(null)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [page, fetchBanners])

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
                      />
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Position
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        language
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Device
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Section
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
                    {bannerData &&
                      bannerData.length > 0 &&
                      bannerData.map((row, index) => {
                        return (
                          <React.Fragment key={row._id}>
                            <TableRow key={index}>
                              <TableCell className='px-5 py-1 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                                {row.title}
                              </TableCell>
                              <TableCell className='px-5 py-1 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                                <div className='flex items-center gap-2'>
                                  <span>
                                    <Image
                                      src={row.image}
                                      alt={row.title}
                                      width={0}
                                      height={0}
                                      sizes='100vw'
                                      className='h-20 w-30 object-contain'
                                    />
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className='px-5 py-1 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                                {row.position}
                              </TableCell>
                              <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                                {row.language.name}
                              </TableCell>
                              <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                                {row.device}
                              </TableCell>
                              <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                                {row.section}
                              </TableCell>
                              <TableCell className='text-theme-sm px-1 py-3 text-center text-gray-500 dark:text-gray-400'>
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
                          </React.Fragment>
                        )
                      })}
                    {bannerData.length === 0 && (
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
