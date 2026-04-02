import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  createRole,
  deleteRole,
  getPermissions,
  getRoleById,
  updateRole,
} from '@/api/role'

import ComponentCard from '@/components/common/ComponentCard'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loading from '@/components/common/Loading'
import Checkbox from '@/components/form/input/Checkbox'
import Label from '@/components/form/Label'
import Button from '@/components/ui/button/Button'

import { CheckCircleIcon, ChevronLeftIcon, TrashBinIcon } from '@/icons'

import { IPermission, IRole } from '@/types/role'

const RoleDetail = ({ id }: { id: string }) => {
  const router = useRouter()
  const isCreate = id === 'create'
  const [detail, setDetail] = useState<IRole | null>(null)
  const [permissions, setPermissions] = useState<IPermission[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)

  const handleClose = useCallback(() => setOpenConfirm(false), [])

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IRole>()

  const formValues = watch()

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setIsLoading(true)
        const response = await getPermissions()
        setPermissions(response)
      } catch (err) {
        toast.error('Not found Permissions')
        router.push('/roles')
        console.error('Failed to fetch permissions data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPermissions()
  }, [router])

  useEffect(() => {
    if (!isCreate) {
      const fetchDetail = async () => {
        try {
          setIsLoading(true)
          const response = await getRoleById(id)
          setDetail(response)
        } catch (err) {
          toast.error('Not found role')
          router.push('/roles')
          console.error('Failed to fetch role data:', err)
        } finally {
          setIsLoading(false)
        }
      }
      fetchDetail()
    }
  }, [id, isCreate, router])

  useEffect(() => {
    if (detail) {
      Object.entries(detail).forEach(([key, value]) => {
        if (key === 'permissions') {
          setValue(
            key as keyof IRole,
            value.map((p) => p._id)
          )
        } else {
          setValue(key as keyof IRole, value)
        }
      })
    }
  }, [detail, setValue])

  const onSubmit: SubmitHandler<IRole> = async (data) => {
    try {
      if (isLoading) return
      setIsLoading(true)
      const result = isCreate
        ? await createRole(data)
        : await updateRole(id, data)
      if (result) {
        toast.success('Role saved successfully.')
      }
    } catch (error: any) {
      toast.error(error?.message || 'Unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (isLoading) return
    try {
      setIsLoading(true)
      await deleteRole(id)
      toast.success('Role deleted successfully')
      router.push('/roles')
    } catch (error) {
      console.error('Error deleting role:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePermissions = (permissionId: string, checked: boolean) => {
    let selectedPermissions = (formValues.permissions || []) as string[]
    if (checked) {
      if (selectedPermissions.includes(permissionId)) return
      selectedPermissions.push(permissionId)
      setValue('permissions', selectedPermissions)
    } else {
      selectedPermissions = selectedPermissions.filter(
        (p) => p !== permissionId
      )
      setValue('permissions', selectedPermissions)
    }
  }

  return isLoading ? (
    <Loading />
  ) : (
    <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
      <div className='w-full max-w-md px-5 sm:pt-5'>
        <Link
          href='/roles'
          className='inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        >
          <ChevronLeftIcon />
          Back to list
        </Link>
      </div>

      <div className='p-5'>
        <ComponentCard title='Information'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-1 gap-6 sm:grid-cols-2'
          >
            <div>
              <Label>Name</Label>
              <span className='text-error-500 text-xs'>
                {errors?.name?.message || ''}
              </span>
              <input
                className='shadow-theme-xs h-11 w-full rounded-lg border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
                {...register('name', {
                  required: 'Name required',
                  minLength: { value: 3, message: 'Min 3 characters' },
                  pattern: {
                    value: /^[a-zA-Z0-9]{3,}$/,
                    message: 'Invalid name format',
                  },
                })}
                disabled={!isCreate}
              />
            </div>
            <div className='sm:col-span-2'>
              <Label>Permissions</Label>
              <div className='grid grid-cols-2 gap-2'>
                {/* :TODO: fix this */}
                {permissions &&
                  permissions.map((permission: IPermission, index: number) => (
                    <Checkbox
                      key={index}
                      checked={
                        (formValues?.permissions as string[])?.includes(
                          permission._id
                        ) || false
                      }
                      onChange={(checked) =>
                        handleChangePermissions(permission._id, checked)
                      }
                      label={permission.name}
                    />
                  ))}
              </div>
            </div>
            <div className='flex gap-2 sm:col-span-2'>
              <Button
                type='submit'
                startIcon={<CheckCircleIcon />}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Submit'}
              </Button>
              {detail && (
                <Button
                  className='bg-error-500 hover:bg-error-600'
                  startIcon={<TrashBinIcon />}
                  disabled={isLoading}
                  onClick={() => setOpenConfirm(true)}
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </Button>
              )}
            </div>
          </form>
          <ConfirmModal
            open={openConfirm}
            title='Are you Sure?'
            description='You can not restore deleted record.'
            handleConfirm={() => {
              handleDelete(detail._id)
            }}
            handleClose={handleClose}
          />
        </ComponentCard>
      </div>
    </div>
  )
}

export default RoleDetail
