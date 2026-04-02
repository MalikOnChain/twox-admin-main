'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { deleteEmailTemplate } from '@/api/email-template'
import { EmailTemplate } from '@/api/email-template'

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

type EmailTemplateTableProps = {
  templateData: EmailTemplate[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  setIsLoading: (isLoading: boolean) => void
  isLoading: boolean
  fetchTemplates: () => void
  onEdit: (template: EmailTemplate) => void
}

export default function EmailTemplateTable({
  templateData,
  totalPages,
  page,
  setPage,
  isLoading,
  setIsLoading,
  fetchTemplates,
  onEdit,
}: EmailTemplateTableProps) {
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>('')

  const handleClose = useCallback(() => setOpenConfirm(false), [])

  const handleDelete = async (id: string) => {
    if (isLoading || !id) return
    try {
      setIsLoading(true)
      const res = await deleteEmailTemplate(id)
      if (res.success) {
        toast.success('Template deleted successfully')
        fetchTemplates()
      }
    } catch (error) {
      console.error('Error deleting template:', error)
    } finally {
      setIsLoading(false)
      setDeleteId(null)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [page, fetchTemplates])

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
                        Name
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Subject
                      </TableCell>
                      <TableCell
                        isHeader
                        className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                      >
                        Required Variables
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
                    {templateData &&
                      templateData.length > 0 &&
                      templateData.map((row) => {
                        return (
                          <React.Fragment key={row._id}>
                            <TableRow>
                              <TableCell className='px-5 py-1 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                                {row.name}
                              </TableCell>
                              <TableCell className='px-5 py-1 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                                {row.subject}
                              </TableCell>
                              <TableCell className='px-5 py-1 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                                {row.requiredVariables.join(', ')}
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
                    {templateData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className='text-center'>
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
