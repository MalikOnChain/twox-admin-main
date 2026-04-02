'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  createGameCategory,
  deleteGameCategory,
  getGameCategory,
  updateGameCategory,
  uploadIcon,
} from '@/api/casino/game-category'

import ComponentCard from '@/components/common/ComponentCard'
import ConfirmModal from '@/components/common/ConfirmModal'
import Label from '@/components/form/Label'
import Switch from '@/components/form/switch/Switch'
import GamesSortList from '@/components/game-categories/GamesSortList'
import GamesTable from '@/components/game-categories/GamesTable'
import Button from '@/components/ui/button/Button'

import { CheckCircleIcon, ChevronLeftIcon, TrashBinIcon } from '@/icons'

import { GameCategoryFormData, IConvertedGame } from '@/types/game-category'

interface FormData {
  title: string
  displayOrder: number
  isPinned: boolean
}

const GameCategoriesDetail = ({ id }: { id: string }) => {
  const router = useRouter()
  const isCreate = id === 'create'
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [selectedGameIds, setSelectedGameIds] = useState<Set<string>>(
    new Set([])
  )
  const [selectedGames, setSelectedGames] = useState<IConvertedGame[]>([])
  const [iconUrl, setIconUrl] = useState<string | null>(null)
  const iconFileRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      displayOrder: 0,
      isPinned: false,
    },
  })

  const isPinned = watch('isPinned')

  const handleSelectIcon = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type.startsWith('image/')) {
      setIconUrl(URL.createObjectURL(file))
    }
  }

  const uploadImage = async (): Promise<{ status: boolean; icon?: string }> => {
    try {
      const file = iconFileRef.current?.files?.[0]

      if (!file) {
        return {
          status: true,
          icon: undefined,
        }
      }

      const formData = new FormData()
      formData.append('file', file)
      const result = await uploadIcon(formData)

      if (iconFileRef.current) {
        iconFileRef.current.value = ''
      }

      return {
        status: result.success,
        icon: result.url,
      }
    } catch (error) {
      console.error('Error uploading icon:', error)
      toast.error('Failed to upload icon')
      return {
        status: false,
        icon: undefined,
      }
    }
  }

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    if (selectedGameIds.size < 1) {
      toast.error('Please select at least one game.')
      return
    }

    if (isLoading) return
    setIsLoading(true)

    try {
      const { status, icon } = await uploadImage()
      if (!status) {
        setIsLoading(false)
        return
      }

      const payload: GameCategoryFormData = {
        title: formData.title,
        displayOrder: formData.displayOrder,
        isPinned: formData.isPinned,
        isActive: true, // Default to active
        games: Array.from(selectedGameIds).map((id) => ({
          type: 'blueocean', // Assuming all games are blueocean for now
          id,
        })),
        ...(icon && { icon }),
      }

      const result = isCreate
        ? await createGameCategory(payload)
        : await updateGameCategory(id, payload)

      if (result.success) {
        toast.success(
          `Category ${isCreate ? 'created' : 'updated'} successfully.`
        )
        router.push('/games/categories')
      } else {
        toast.error(result.message || 'Failed to save category')
      }
    } catch (error: any) {
      toast.error(error?.message || 'Unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = useCallback(() => setOpenConfirm(false), [])

  const handleDelete = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const result = await deleteGameCategory(id)
      if (result.success) {
        toast.success('Category deleted successfully.')
        router.push('/games/categories')
      } else {
        toast.error(result.message || 'Failed to delete category')
      }
    } catch (error: any) {
      toast.error(error?.message || 'Unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveGame = (gameId: string) => {
    const newSelectedGameIds = new Set(selectedGameIds)
    newSelectedGameIds.delete(gameId)
    setSelectedGameIds(newSelectedGameIds)
    setSelectedGames((prev) => prev.filter((game) => game.id !== gameId))
  }

  useEffect(() => {
    if (isCreate) return

    const fetchData = async () => {
      try {
        const response = await getGameCategory(id)
        if (response.success) {
          const category = response.data
          const games = response.games

          setSelectedGameIds(new Set(category.games.map((game) => game.id)))
          setValue('title', category.title)
          setValue('displayOrder', category.displayOrder)
          setValue('isPinned', category.isPinned)
          setIconUrl(category.icon || null)
          setSelectedGames(games)
        } else {
          toast.error(response.message || 'Failed to fetch category')
        }
      } catch (error) {
        console.error('Error fetching category:', error)
        toast.error('Failed to fetch category')
      }
    }

    fetchData()
  }, [isCreate, id, setValue])

  return (
    <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
      <div className='w-full max-w-md px-5 sm:pt-5'>
        <Link
          href='/games/categories'
          className='flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        >
          <ChevronLeftIcon />
          Back to list
        </Link>
      </div>

      <div className='p-5'>
        <ComponentCard title='Information'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='grid grid-cols-1 gap-6 sm:grid-cols-4'
          >
            <div>
              <Label>Title</Label>
              <span className='text-error-500 text-xs'>
                {errors?.title?.message || ''}
              </span>
              <input
                className='shadow-theme-xs h-11 w-full rounded-lg border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
                {...register('title', {
                  required: 'Title required',
                  minLength: { value: 3, message: 'Min 3 characters' },
                })}
              />
            </div>
            <div>
              <Label>Icon</Label>
              <div className='flex h-11 w-fit items-center justify-center gap-2'>
                <button
                  type='button'
                  onClick={() => iconFileRef.current?.click()}
                >
                  <Image
                    src={iconUrl || '/images/preview.png'}
                    alt='Category icon'
                    width={24}
                    height={24}
                    className='h-6 w-6 rounded-lg object-contain'
                  />
                </button>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleSelectIcon}
                  ref={iconFileRef}
                  className='hidden'
                />
              </div>
            </div>
            <div>
              <Label>Order</Label>
              <input
                type='number'
                min={0}
                className='shadow-theme-xs h-11 w-full rounded-lg border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
                {...register('displayOrder', {
                  valueAsNumber: true,
                  min: { value: 0, message: 'Order must be 0 or greater' },
                })}
              />
            </div>
            <div>
              <Switch
                label='Pinned'
                labelClassName='flex-col-reverse items-start'
                defaultChecked={isPinned}
                onChange={(checked) => setValue('isPinned', checked)}
              />
            </div>
            <div className='sm:col-span-3'>
              <GamesTable
                selectedGameIds={selectedGameIds}
                onSelectedChange={setSelectedGameIds}
                selectedGames={selectedGames}
                setSelectedGames={setSelectedGames}
              />
            </div>
            <div>
              <GamesSortList
                selected={selectedGameIds}
                gamesData={selectedGames}
                onOrderChange={setSelectedGameIds}
                onRemove={handleRemoveGame}
              />
            </div>
            <div className='flex gap-2 sm:col-span-4'>
              <Button
                type='submit'
                startIcon={<CheckCircleIcon />}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Submit'}
              </Button>
              {!isCreate && (
                <Button
                  type='button'
                  className='bg-error-500 hover:bg-error-600'
                  startIcon={<TrashBinIcon />}
                  disabled={isLoading}
                  onClick={() => setOpenConfirm(true)}
                >
                  Delete
                </Button>
              )}
            </div>
          </form>
          <ConfirmModal
            open={openConfirm}
            title='Are you Sure?'
            description='You can not restore deleted record.'
            handleConfirm={handleDelete}
            handleClose={handleClose}
          />
        </ComponentCard>
      </div>
    </div>
  )
}

export default GameCategoriesDetail
