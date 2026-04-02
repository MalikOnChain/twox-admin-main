import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { uploadBotUserAvatar } from '@/api/bot-users'

import { botUserFormSchema, BotUserFormValues } from '@/lib/bot-user'

import BotUserAvatarUpload from '@/components/bot-user/BotUserAvatarUpload'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

import { BOT_USER_AVATAR_UPLOAD_STATUS, IBotUserData } from '@/types/bot-users'

const BotUserModal = ({
  isOpen,
  closeModal,
  selectedBotUser,
  onSubmit,
}: {
  selectedBotUser: IBotUserData
  isOpen: boolean
  closeModal: () => void
  onSubmit: (data: BotUserFormValues) => Promise<boolean>
}) => {
  const botUserImageRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [fileToUpload, setFileToUpload] = useState<File | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<BotUserFormValues>({
    resolver: zodResolver(botUserFormSchema),
    defaultValues: {
      username: selectedBotUser?.username || '',
      avatar: selectedBotUser?.avatar || '',
      wager: selectedBotUser?.wager || 1,
      rank: selectedBotUser?.rank || '',
      minMultiplier: selectedBotUser?.minMultiplier || 1.1,
      maxMultiplier: selectedBotUser?.maxMultiplier || 50,
      minBet: selectedBotUser?.minBet || 0.2,
      maxBet: selectedBotUser?.maxBet || 20,
    },
  })

  const handleOnClose = () => {
    reset({
      username: '',
      avatar: '',
      wager: 1,
      rank: '',
      minMultiplier: 1.1,
      maxMultiplier: 50,
      minBet: 0.2,
      maxBet: 20,
    })
    setAvatarUrl(null)
    setFileToUpload(null)
    closeModal()
  }

  const handleOnChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      if (file.type.startsWith('image/')) {
        setFileToUpload(file)
        setAvatarUrl(URL.createObjectURL(file))
      } else {
        toast.error('Please select a valid image file')
      }
    } catch (error) {
      console.error('Error handling image change:', error)
      toast.error('Error processing image')
    }
  }

  const updateAvatar = async () => {
    const updatedData = { ...getValues() }

    try {
      if (!updatedData.avatar && !fileToUpload) {
        return {
          status: BOT_USER_AVATAR_UPLOAD_STATUS.SELECT_BOT_USER_AVATAR,
          data: null,
        }
      }

      if (fileToUpload) {
        const formData = new FormData()
        formData.append('file', fileToUpload)
        const result = await uploadBotUserAvatar(formData)
        updatedData.avatar = result.url
      }

      return {
        status: BOT_USER_AVATAR_UPLOAD_STATUS.BOT_USER_AVATAR_UPLOAD_SUCCESS,
        data: updatedData,
      }
    } catch (error) {
      console.error('Error updating bot user avatar:', error)
      return {
        status:
          error instanceof Error
            ? error.message
            : BOT_USER_AVATAR_UPLOAD_STATUS.BOT_USER_AVATAR_UPLOAD_FAILED,
        data: null,
      }
    }
  }

  const handleOnSubmit = async () => {
    setIsLoading(true)

    try {
      const formData = getValues()

      // Validate required fields
      if (!formData.username?.trim()) {
        toast.error('Username is required')
        return
      }

      // Process custom bonus data - remove null/undefined values for cleaner payload
      const processedData = { ...formData }

      // Handle image upload
      const { status, data: updatedData } = await updateAvatar()

      switch (status) {
        case BOT_USER_AVATAR_UPLOAD_STATUS.BOT_USER_AVATAR_UPLOAD_SUCCESS:
          if (updatedData) {
            // Merge processed data with updated image
            const finalData = { ...processedData, avatar: updatedData.avatar }

            const isSuccess = await onSubmit(finalData)
            if (isSuccess) {
              handleOnClose()
            }
          }
          break
        case BOT_USER_AVATAR_UPLOAD_STATUS.BOT_USER_AVATAR_UPLOAD_FAILED:
          toast.error('Failed to upload bot user avatar')
          break
        case BOT_USER_AVATAR_UPLOAD_STATUS.SELECT_BOT_USER_AVATAR:
          toast.error('Please select a bot user avatar')
          break
        default:
          toast.error('Bot user avatar upload failed')
          break
      }
    } catch (error) {
      console.error('Error submitting bot user:', error)
      toast.error('Failed to save bot user')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedBotUser) {
      reset({
        username: selectedBotUser.username,
        wager: selectedBotUser.wager || 0,
        rank: selectedBotUser.rank || '',
        minMultiplier: selectedBotUser.minMultiplier || 0,
        maxMultiplier: selectedBotUser.maxMultiplier || 0,
        minBet: selectedBotUser.minBet || 0,
        maxBet: selectedBotUser.maxBet || 0,
        avatar: selectedBotUser.avatar,
      })
      setAvatarUrl(selectedBotUser.avatar || null)
    } else {
      reset({
        username: '',
        avatar: '',
        wager: 1,
        rank: '',
        minMultiplier: 1.1,
        maxMultiplier: 50,
        minBet: 0.2,
        maxBet: 20,
      })
      setAvatarUrl(null)
    }
  }, [selectedBotUser, reset])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleOnClose}
      className='m-4 max-w-[700px]'
    >
      <div className='no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900'>
        <div className='px-2 pr-14'>
          <h4 className='mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
            {selectedBotUser?._id ? 'Edit Bot User' : 'Add Bot User'}
          </h4>
        </div>

        <form
          className='flex flex-col'
          onSubmit={(e) => {
            e.preventDefault()
          }}
          noValidate
        >
          <div className='custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3'>
            <BotUserAvatarUpload
              image={avatarUrl}
              detailInfo={selectedBotUser}
              onImageChange={handleOnChangeImage}
              imageRef={botUserImageRef}
            />

            <div className='mt-7'>
              <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2'>
                {/* Username */}
                <div className='col-span-2'>
                  <Label> Username</Label>
                  <Controller
                    name='username'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='text'
                        error={Boolean(errors.username?.message)}
                        errorMessage={errors.username?.message || ''}
                      />
                    )}
                  />
                </div>

                {/* Rank */}
                <div className='col-span-1'>
                  <Label> Rank</Label>
                  <Controller
                    name='rank'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='text'
                        error={Boolean(errors.rank?.message)}
                        errorMessage={errors.rank?.message || ''}
                      />
                    )}
                  />
                </div>

                {/* Wager */}
                <div className='col-span-1'>
                  <Label>Wager</Label>
                  <Controller
                    name='wager'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='number'
                        min={0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        error={Boolean(errors.wager?.message)}
                        errorMessage={errors.wager?.message || ''}
                      />
                    )}
                  />
                </div>

                <div className='col-span-1'>
                  <Label>Min Multiplier</Label>
                  <Controller
                    name='minMultiplier'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='number'
                        min={0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        error={Boolean(errors.minMultiplier?.message)}
                        errorMessage={errors.minMultiplier?.message || ''}
                      />
                    )}
                  />
                </div>

                <div className='col-span-1'>
                  <Label>Max Multiplier</Label>
                  <Controller
                    name='maxMultiplier'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='number'
                        min={0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        error={Boolean(errors.maxMultiplier?.message)}
                        errorMessage={errors.maxMultiplier?.message || ''}
                      />
                    )}
                  />
                </div>

                <div className='col-span-1'>
                  <Label>Min Bet</Label>
                  <Controller
                    name='minBet'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='number'
                        min={0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        error={Boolean(errors.minBet?.message)}
                        errorMessage={errors.minBet?.message || ''}
                      />
                    )}
                  />
                </div>

                <div className='col-span-1'>
                  <Label>Max Bet</Label>
                  <Controller
                    name='maxBet'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='number'
                        min={0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        error={Boolean(errors.maxBet?.message)}
                        errorMessage={errors.maxBet?.message || ''}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='mt-6 flex items-center gap-3 px-2 lg:justify-end'>
            <Button
              size='sm'
              variant='outline'
              type='button'
              onClick={handleOnClose}
            >
              Close
            </Button>

            <Button
              size='sm'
              disabled={isLoading}
              type='button'
              onClick={async () => {
                try {
                  setIsLoading(true)
                  await handleSubmit(handleOnSubmit)()
                } catch (error) {
                  console.error('Submit error:', error)
                } finally {
                  setIsLoading(false)
                }
              }}
            >
              {isLoading ? (
                <LoadingSpinner className='mx-auto size-5' />
              ) : selectedBotUser?._id ? (
                'Update'
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default BotUserModal
