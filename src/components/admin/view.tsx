'use client'

import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { deleteAdmin, getAdminById } from '@/api/admin'

import { useModal } from '@/hooks/useModal'

import AdminDetail from '@/components/admin/details'
import ConfirmModal from '@/components/common/ConfirmModal'
import UserAvatar from '@/components/ui/avatar/UserAvatar'
import Badge from '@/components/ui/badge/Badge'
import Button from '@/components/ui/button/Button'

import {
  CheckLineIcon,
  ChevronLeftIcon,
  CloseLineIcon,
  PencilIcon,
  TrashBinIcon,
  User2Icon,
} from '@/icons'

import Loading from '../common/Loading'
import Label from '../form/Label'

import { IAdminDataCollection } from '@/types/admin'

const AdminDetailView = ({ id }: { id: string }) => {
  const router = useRouter()
  const EditAdminModal = useModal()
  const [detail, setDetail] = useState<IAdminDataCollection | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)

  const handleClose = useCallback(() => setOpenConfirm(false), [])
  const fetchDetail = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await getAdminById(id)
      setDetail(response)
    } catch (err) {
      toast.error('Not found user')
      router.push('/admins')
      console.error('Failed to fetch admin data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  const handleDelete = async (id: string) => {
    if (isLoading) return
    try {
      setIsLoading(true)
      await deleteAdmin(id)
      toast.success('Admin deleted successfully')
      router.push('/admins')
    } catch (error) {
      console.error('Error deleting admin:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return isLoading && !detail ? (
    <Loading />
  ) : (
    <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
      <div className='flex w-full justify-between px-5 sm:pt-5'>
        <Link
          href='/admins'
          className='inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        >
          <ChevronLeftIcon />
          Back to list
        </Link>
        <div className='flex gap-2'>
          <Button
            onClick={EditAdminModal.openModal}
            variant='outline'
            size='sm'
          >
            <PencilIcon />
            Edit Admin
          </Button>
          <Button
            className='bg-error-500 hover:bg-error-600'
            size='sm'
            disabled={isLoading}
            onClick={() => setOpenConfirm(true)}
          >
            <TrashBinIcon />
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
      <AdminDetail
        id={id}
        isOpen={EditAdminModal.isOpen}
        closeModal={EditAdminModal.closeModal}
        detail={detail}
        handleSave={fetchDetail}
      />
      <div className='p-5'>
        <Label>Admin Information</Label>
        <hr className='my-2' />
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32'>
          <div>
            <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
              Username
            </p>
            <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
              {detail?.username}
            </p>
          </div>
          <div>
            <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
              Email
            </p>
            <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
              {detail?.email}
            </p>
          </div>
          <div>
            <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
              Avatar
            </p>
            {detail?.avatar ? (
              <UserAvatar
                src={detail.avatar}
                alt={detail?.username || 'Admin'}
                size='large'
                status='online'
              />
            ) : (
              <div className='h-11 w-11 overflow-hidden rounded-full'>
                <User2Icon className='text-brand-500' />
              </div>
            )}
          </div>

          <div>
            <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
              Roles
            </p>
            <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
              {detail?.roles.map((r) => (
                <Badge key={r._id} color='info'>
                  {r.name}
                </Badge>
              ))}
            </p>
          </div>
          <div>
            <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
              Notes
            </p>
            <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
              {detail?.notes}
            </p>
          </div>
          <div>
            <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
              Permissions
            </p>
            <p className='flex flex-wrap gap-2'>
              {detail?.roles.map((r) =>
                r.permissions.map((p) => (
                  <Badge key={p._id} color='info'>
                    {p.name}
                  </Badge>
                ))
              )}
            </p>
          </div>

          <div>
            <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
              OTP Enable
            </p>
            <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
              {detail?.isOTPEnabled && (
                <Badge color='success' startIcon={<CheckLineIcon />}>
                  Enabled
                </Badge>
              )}
              {!detail?.isOTPEnabled && (
                <Badge color='error' startIcon={<CloseLineIcon />}>
                  Disabled
                </Badge>
              )}
            </p>
          </div>

          <div>
            <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
              Two-Step Verification
            </p>
            <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
              {detail?.isTwoFAEnabled && (
                <Badge color='success' startIcon={<CheckLineIcon />}>
                  Enabled
                </Badge>
              )}
              {!detail?.isTwoFAEnabled && (
                <Badge color='error' startIcon={<CloseLineIcon />}>
                  Disabled
                </Badge>
              )}
            </p>
          </div>

          <div>
            <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
              Status
            </p>
            <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
              {detail?.isActive && (
                <Badge color='success' startIcon={<CheckLineIcon />}>
                  Active
                </Badge>
              )}
              {!detail?.isActive && (
                <Badge color='error' startIcon={<CloseLineIcon />}>
                  Disabled
                </Badge>
              )}
            </p>
          </div>
        </div>

        <div className='mt-8'>
          <Label>Other Information</Label>
          <hr className='my-2' />
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label>Member Since</Label>
              <span className='text-gray-500 dark:text-gray-400'>
                {moment(detail?.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            </div>
            <div>
              <Label>Granted At</Label>
              <span className='text-gray-500 dark:text-gray-400'>
                {moment(detail?.grantedAt).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            </div>
            <div>
              <Label>Last Login At</Label>
              <span className='text-gray-500 dark:text-gray-400'>
                {detail?.lastAdminLogin &&
                  moment(detail?.lastAdminLogin).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            </div>
            <div className='sm:col-span-2'>
              <Label>Action Logs</Label>
              <hr />
              {detail?.actionLogs?.map((log, idx) => (
                <div key={idx}>
                  <span className='text-gray-500 dark:text-gray-400'>
                    {log.action}
                  </span>{' '}
                  -{' '}
                  <span className='text-gray-500 dark:text-gray-400'>
                    {moment(log.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <ConfirmModal
          open={openConfirm}
          title='Are you Sure?'
          description='You can not restore deleted record.'
          handleConfirm={() => {
            handleDelete(detail?._id)
          }}
          handleClose={handleClose}
        />
      </div>
    </div>
  )
}

export default AdminDetailView
