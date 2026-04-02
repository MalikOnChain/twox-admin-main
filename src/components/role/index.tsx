'use client'
import moment from 'moment'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { deleteRole, getRoles } from '@/api/role'

import ConfirmModal from '@/components/common/ConfirmModal'

import { PencilIcon, TrashBinIcon } from '@/icons'

import Loading from '../common/Loading'
import Pagination from '../tables/Pagination'
import Badge from '../ui/badge/Badge'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'

import { IRoleCollection } from '@/types/role'

export default function RolesList() {
  const [tableData, setTableData] = useState<IRoleCollection[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>(null)

  const handleClose = useCallback(() => setOpenConfirm(false), [])

  useEffect(() => {
    const fetchRoles = async ({
      page,
      limit,
    }: {
      page: number
      limit: number
    }) => {
      try {
        setIsLoading(true)
        const response = await getRoles({ page, limit })
        setTableData(response.rows)
        setTotalPages(response.totalPages)
        setPage(response.currentPage)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRoles({ page, limit })
  }, [page, limit])

  const handleDelete = async (id: string) => {
    if (isLoading || !id) return
    try {
      setIsLoading(true)
      await deleteRole(id)
      toast.success('Role deleted successfully')
      const newRoles = tableData.filter((role) => role._id !== id)
      setTableData(newRoles)
    } catch (error) {
      console.error('Error deleting role:', error)
    } finally {
      setIsLoading(false)
      setDeleteId(null)
    }
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
          <div className='max-w-full overflow-x-auto'>
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
                    Permissions
                  </TableCell>
                  <TableCell
                    isHeader
                    className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
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

              {/* Table Body */}
              <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                {tableData.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell className='text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400'>
                      {row.name}
                    </TableCell>
                    <TableCell className='text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400'>
                      <div className='flex flex-wrap gap-2'>
                        {row.permissions.map((permission, index) => {
                          return typeof permission === 'string' ? (
                            <></>
                          ) : (
                            <Badge key={index} color='success'>
                              {permission.name}
                            </Badge>
                          )
                        })}
                      </div>
                    </TableCell>
                    <TableCell className='text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400'>
                      {moment(row.updatedAt).format('YYYY-MM-DD HH:mm:ss')}
                    </TableCell>
                    <TableCell className='text-theme-sm flex items-center justify-center gap-1 px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                      <Link href={`/roles/${row._id}`}>
                        <PencilIcon />
                      </Link>
                      <a
                        className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                        onClick={() => {
                          setDeleteId(row._id)
                          setOpenConfirm(true)
                        }}
                      >
                        <TrashBinIcon />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

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
