'use client'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { deleteAdmin, getAdmins } from '@/api/admin'

import { useModal } from '@/hooks/useModal'

import AdminDetail from '@/components/admin/details'
import ComponentCard from '@/components/common/ComponentCard'
import ConfirmModal from '@/components/common/ConfirmModal'
import UserAvatar from '@/components/ui/avatar/UserAvatar'
import Button from '@/components/ui/button/Button'

import { EyeIcon, PencilIcon, PlusIcon, TrashBinIcon, User2Icon } from '@/icons'

import Loading from '../common/Loading'
import Pagination from '../tables/Pagination'
import Badge from '../ui/badge/Badge'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'

import { IAdminDataCollection } from '@/types/admin'

export default function AdminsList() {
  const AdminFormModal = useModal()

  const [tableData, setTableData] = useState<IAdminDataCollection[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>(null)
  const [selectedAdminId, setSelectedAdminId] = useState<string>('create')
  const [selectedAdmin, setSelectedAdmin] = useState<IAdminDataCollection>(null)

  const handleClose = useCallback(() => setOpenConfirm(false), [])
  const fetchAdmins = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await getAdmins({ page, limit })
      setTableData(response.rows)
      setTotalPages(response.totalPages)
      setPage(response.currentPage)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }, [page, limit])

  useEffect(() => {
    fetchAdmins()
  }, [fetchAdmins])

  const handleDelete = async () => {
    if (isLoading || !deleteId) return
    try {
      setIsLoading(true)
      await deleteAdmin(deleteId)
      toast.success('Admin deleted successfully')
      const newAdmins = tableData.filter((admin) => admin._id !== deleteId)
      setTableData(newAdmins)
    } catch (error) {
      console.error('Error deleting admin:', error)
    } finally {
      setIsLoading(false)
      setDeleteId(null)
    }
  }

  const editAdmin = (admin: IAdminDataCollection) => {
    AdminFormModal.openModal()
    setSelectedAdminId(admin._id)
    setSelectedAdmin(admin)
  }

  const handleCloseModal = () => {
    AdminFormModal.closeModal()
    setSelectedAdminId('create')
    setSelectedAdmin(null)
  }
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <ComponentCard
          title='Admin Management'
          action={
            <Button onClick={AdminFormModal.openModal} size='xs'>
              <PlusIcon />
              Add Admin
            </Button>
          }
        >
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
                      Username
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Roles
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Email
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      OTP Status
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      2FA Status
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
                  {tableData.length < 1 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'
                      >
                        No data found
                      </TableCell>
                    </TableRow>
                  )}

                  {tableData.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell className='text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400'>
                        <Link
                          href={`/admins/${row._id}`}
                          className='hover:text-brand-500 flex items-center gap-3'
                        >
                          {row?.avatar ? (
                            <UserAvatar
                              src={row.avatar}
                              alt={row.username || 'Admin'}
                              size='large'
                              status='online'
                            />
                          ) : (
                            <span className='h-11 w-11 overflow-hidden rounded-full'>
                              <User2Icon className='text-brand-500' />
                            </span>
                          )}
                          <span>{row.username}</span>
                        </Link>
                      </TableCell>
                      <TableCell className='px-5 py-4 text-center sm:px-6'>
                        {row.roles?.map((r) => (
                          <Badge key={r._id} size='sm' color='success'>
                            {r.name}
                          </Badge>
                        ))}
                      </TableCell>
                      <TableCell className='text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400'>
                        {row.email}
                      </TableCell>
                      <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                        <Badge
                          size='sm'
                          color={row.isOTPEnabled ? 'success' : 'error'}
                        >
                          {row.isOTPEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                        <Badge
                          size='sm'
                          color={row.isTwoFAEnabled ? 'success' : 'error'}
                        >
                          {row.isTwoFAEnabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-theme-sm hover:text-brand-500 flex items-center justify-center gap-1 px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                        <button onClick={() => editAdmin(row)}>
                          <PencilIcon />
                        </button>
                        <Link href={`/admins/${row._id}`}>
                          <EyeIcon />
                        </Link>
                        <button
                          onClick={() => {
                            setDeleteId(row._id)
                            setOpenConfirm(true)
                          }}
                        >
                          <TrashBinIcon />
                        </button>
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
              handleConfirm={handleDelete}
              handleClose={handleClose}
            />
          </div>
          <AdminDetail
            id={selectedAdminId}
            isOpen={AdminFormModal.isOpen}
            closeModal={handleCloseModal}
            handleSave={fetchAdmins}
            detail={selectedAdmin}
          />
        </ComponentCard>
      )}
    </>
  )
}
