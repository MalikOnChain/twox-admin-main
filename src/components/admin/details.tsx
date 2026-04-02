'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  createAdmin,
  deleteAdmin,
  updateAdmin,
  uploadAvatar,
} from '@/api/admin'
import { getAllRoles } from '@/api/role'

import { useAuth } from '@/context/AuthContext'

import ConfirmModal from '@/components/common/ConfirmModal'
import MultiSelect from '@/components/form/MultiSelect'
import Switch from '@/components/form/switch/Switch'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

import { EyeCloseIcon, EyeIcon, PencilIcon } from '@/icons'

import Loading from '../common/Loading'
import Label from '../form/Label'

import { IAdmin, IAdminDataCollection } from '@/types/admin'
import { IRole } from '@/types/role'

const AdminDetail = ({
  id,
  isOpen,
  closeModal,
  handleSave,
  detail,
}: {
  id: string
  isOpen: boolean
  closeModal?: () => void
  handleSave?: () => void
  detail?: IAdminDataCollection
}) => {
  const router = useRouter()
  const { user, setUser } = useAuth()
  const isCreate = id === 'create'
  const [roles, setRoles] = useState<IRole[] | null>(null)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)

  const avatarFileRef = useRef<HTMLInputElement>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const handleCloseConfirm = useCallback(() => setOpenConfirm(false), [])

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<IAdmin>()

  const formValues = watch()

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setIsLoading(true)
        const response = await getAllRoles()
        setRoles(response)
      } catch (err) {
        toast.error('Not found Roles')
        router.push('/roles')
        console.error('Failed to fetch roles data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRoles()
  }, [router])

  useEffect(() => {
    if (isOpen && !isCreate && detail) {
      Object.entries(detail).forEach(([key, value]) => {
        if (key === 'password') return
        if (key === 'roles') {
          setValue(
            key as keyof IAdmin,
            value.map((r) => r._id)
          )
        } else {
          setValue(key as keyof IAdmin, value)
        }
        if (key === 'avatar') {
          setAvatarUrl(value)
        }
      })
    } else {
      setValue('isOTPEnabled', true)
      setValue('isTwoFAEnabled', true)
    }
  }, [isCreate, detail, setValue, isOpen])

  const uploadAvatarImage = async () => {
    try {
      const file = avatarFileRef.current?.files?.[0]

      if (!file) {
        return {
          status: true,
          image: undefined,
        }
      }

      const formData = new FormData()
      formData.append('file', file)
      const result = await uploadAvatar(formData)

      return {
        status: true,
        image: result.url,
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      return {
        status: false,
        image: null,
      }
    }
  }

  const onSubmit: SubmitHandler<IAdmin> = async (data) => {
    try {
      if (isLoading) return
      setIsLoading(true)

      const { status, image } = await uploadAvatarImage()
      if (!status) return

      const result = isCreate
        ? await createAdmin({ ...data, avatar: image })
        : await updateAdmin(id, { ...data, avatar: image })
      if (result) {
        toast.success('Admin saved successfully.')
        handleSave()

        if (!isCreate && user._id === detail?._id) {
          setUser((prev) => ({ ...prev, avatar: image }))
        }
      }
    } catch (error: any) {
      toast.error(error?.message || 'Unexpected error occurred.')
    } finally {
      setIsLoading(false)
      handleClose()
    }
  }

  const handleDelete = async (id: string) => {
    if (isLoading) return
    try {
      setIsLoading(true)
      await deleteAdmin(id)
      toast.success('Admin deleted successfully')
      handleClose()
    } catch (error) {
      console.error('Error deleting admin:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeRoles = (selectedRoles) => {
    setValue('roles', selectedRoles)
  }

  const generateRandomPassword = (length = 12) => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?'
    let password = ''
    while (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,64}$/.test(password)
    ) {
      password = ''
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length)
        password += chars[randomIndex]
      }
    }
    return password
  }

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword()
    setValue('password', newPassword)
    toast.success('Password generated successfully!')
  }

  const handleSelectAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type.startsWith('image/')) {
      setAvatarUrl(URL.createObjectURL(file))
    }
  }

  const handleClose = () => {
    closeModal()
    reset()
    setAvatarUrl(null)
    if (avatarFileRef.current) {
      avatarFileRef.current.value = null
    }
  }

  const inputClass =
    'h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className='m-4 max-w-[600px]'>
      {isLoading ? (
        <Loading />
      ) : (
        <div className='no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900'>
          <div className='px-2 pr-14'>
            <h4 className='mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
              {isCreate ? 'Create' : 'Edit'} Admin Details
            </h4>
            <p className='mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400'></p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='custom-scrollbar grid max-h-[600px] grid-cols-1 gap-6 overflow-auto px-2 sm:grid-cols-2'
          >
            <div>
              <Label>Username</Label>
              <span className='text-error-500 text-xs'>
                {errors?.username?.message || ''}
              </span>
              <input
                className={inputClass}
                {...register('username', {
                  required: 'Username required',
                  minLength: { value: 3, message: 'Min 3 characters' },
                  pattern: {
                    value: /^[a-zA-Z0-9]{3,}$/,
                    message: 'Invalid username format',
                  },
                })}
              />
            </div>
            <div>
              <Label>Email</Label>
              <span className='text-error-500 text-xs'>
                {errors?.email?.message || ''}
              </span>
              <input
                className={inputClass}
                type='email'
                {...register('email', {
                  required: 'Email required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email',
                  },
                })}
              />
            </div>
            <div>
              <Label className='flex justify-between'>
                Password
                <span
                  className='hover:cursor-pointer hover:text-blue-500'
                  onClick={handleGeneratePassword}
                >
                  Auto generate
                </span>
              </Label>
              <span className='text-error-500 text-xs'>
                {errors?.password?.message || ''}
              </span>
              <div className='relative'>
                <input
                  className={inputClass}
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: isCreate ? 'Password required' : false,
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,64}$/,
                      message:
                        'Include uppercase, lowercase, number and special character (6-64 chars)',
                    },
                  })}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute top-6 right-4 z-30 -translate-y-1/2 cursor-pointer'
                >
                  {showPassword ? (
                    <EyeIcon className='fill-gray-500 dark:fill-gray-400' />
                  ) : (
                    <EyeCloseIcon className='fill-gray-500 dark:fill-gray-400' />
                  )}
                </span>
              </div>
            </div>
            <div>
              <span className='text-error-500 text-xs'>
                {errors?.roles?.message || ''}
              </span>
              {detail?.roles?.length > 0 ? (
                formValues?.roles && (
                  <MultiSelect
                    label='Roles'
                    placeHolderText='Select Roles'
                    options={roles?.map((r) => ({
                      value: r._id,
                      text: r.name,
                      selected: formValues.roles?.includes(r._id) || false,
                    }))}
                    defaultSelected={formValues.roles}
                    onChange={(values) => handleChangeRoles(values)}
                  />
                )
              ) : (
                <MultiSelect
                  label='Roles'
                  placeHolderText='Select Roles'
                  options={roles?.map((r) => ({
                    value: r._id,
                    text: r.name,
                    selected: formValues.roles?.includes(r._id) || false,
                  }))}
                  defaultSelected={formValues.roles}
                  onChange={(values) => handleChangeRoles(values)}
                />
              )}
            </div>
            <div className='flex h-auto flex-col rounded-2xl border border-gray-200 bg-white sm:col-span-2 dark:border-gray-800 dark:bg-white/[0.03]'>
              <div className='relative flex flex-1 flex-col p-4 sm:p-6'>
                <div className='flex h-[250px] flex-col items-center justify-center gap-2'>
                  <Image
                    src={avatarUrl || '/images/preview.png'}
                    alt={formValues?.username || ''}
                    width={0}
                    height={0}
                    sizes='100vw'
                    className='h-full w-full rounded-lg object-contain'
                  />
                </div>
                <input
                  type='file'
                  onChange={handleSelectAvatar}
                  ref={avatarFileRef}
                  className='hidden'
                />
                <button
                  type='button'
                  className='absolute top-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-white opacity-80 hover:bg-gray-100 dark:hover:bg-gray-800'
                  onClick={() => avatarFileRef.current?.click()}
                >
                  <PencilIcon className='h-5 w-5 text-gray-500' />
                </button>
              </div>
            </div>
            <div className='sm:col-span-2'>
              <Label>Notes</Label>
              <textarea
                className={inputClass}
                {...register('notes')}
              ></textarea>
            </div>
            <div className='col-span-2'>
              <Switch
                label='OTP Enable'
                labelClassName='flex-row-reverse justify-between'
                defaultChecked={formValues.isOTPEnabled}
                onChange={(checked) => setValue('isOTPEnabled', checked)}
              />
            </div>
            <div className='col-span-2'>
              <Switch
                label='Two-Step Verification'
                labelClassName='flex-row-reverse justify-between'
                defaultChecked={formValues.isTwoFAEnabled}
                onChange={(checked) => setValue('isTwoFAEnabled', checked)}
              />
            </div>
            <div className='col-span-2'>
              <Switch
                label='Status'
                labelClassName='flex-row-reverse justify-between'
                defaultChecked={formValues.isActive}
                onChange={(checked) => setValue('isActive', checked)}
              />
            </div>

            <div className='col-span-2 mt-6 flex items-center gap-3 lg:justify-end'>
              {detail && (
                <Button
                  className='bg-error-500 hover:bg-error-600'
                  disabled={isLoading}
                  onClick={() => setOpenConfirm(true)}
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </Button>
              )}
              <Button variant='outline' onClick={handleClose}>
                Close
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Submit'}
              </Button>
            </div>
          </form>

          {detail && (
            <ConfirmModal
              open={openConfirm}
              title='Are you Sure?'
              description='You can not restore deleted record.'
              handleConfirm={() => {
                handleDelete(detail._id)
              }}
              handleClose={handleCloseConfirm}
            />
          )}
        </div>
      )}
    </Modal>
  )
}

export default AdminDetail
