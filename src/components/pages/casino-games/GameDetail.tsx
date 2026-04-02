'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import {
  getBlueOceanGameDetail,
  updateBlueOceanCasinoImage,
  updateBlueOceanGameDetail,
} from '@/api/casino/blueocean'

import { mapBlueOceanGameToCasino } from '@/lib/blueocean-mapper'
import getBase64Image from '@/lib/file-utils'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Switch from '@/components/form/switch/Switch'
import Button from '@/components/ui/button/Button'

import { ChevronLeftIcon, PencilIcon } from '@/icons'

import { ICasino } from '@/types/casino/casino'

const GameDetailPage = ({
  game_code,
  backUrl,
}: {
  game_code: string
  backUrl: string
}) => {
  const [detail, setDetail] = useState<ICasino | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [banner, setBanner] = useState<string | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  useEffect(() => {
    const fetchGameDetail = async () => {
      try {
        setIsLoading(true)
        const response = await getBlueOceanGameDetail(game_code)
        setDetail(mapBlueOceanGameToCasino(response))
      } catch (error) {
        console.error('Error fetching game detail:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchGameDetail()
  }, [game_code])

  const updateBanner = async () => {
    if (!bannerFile) return
    try {
      const base64Image = await getBase64Image(bannerFile)
      if (base64Image) {
        setIsUploading(true)
        await updateBlueOceanCasinoImage(game_code, base64Image)
        setIsUploading(false)
      }
    } catch (error) {
      console.error('Error updating game detail:', error)
    }
  }

  const handleStatusChange = async (value: boolean) => {
    if (!detail) return
    await updateBlueOceanGameDetail(game_code, {
      property: 'status',
      value: value ? 'active' : 'inactive',
    })
    setDetail({
      ...detail,
      status: value ? '1' : '0',
    })
  }

  const handleOnChangeBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      if (file.type.startsWith('image/')) {
        setBannerFile(file)
        setBanner(URL.createObjectURL(file))
      }
    } catch (error) {
      console.error('Error updating game detail:', error)
    }
  }

  const handleOnAddToHomePage = async (value: boolean) => {
    if (!detail) return

    await updateBlueOceanGameDetail(game_code, {
      property: 'isFeatured',
      value: value,
    })
    setDetail({
      ...detail,
      home_page: value,
    })
  }

  const handleOrderNumberChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!detail) return
    const value = parseInt(e.target.value) || 0
    await updateBlueOceanGameDetail(game_code, {
      property: 'order',
      value: value,
    })
    setDetail({
      ...detail,
      order: value,
    })
  }

  const handlePinnedChange = async (value: boolean) => {
    if (!detail) return
    await updateBlueOceanGameDetail(game_code, {
      property: 'isFeatured',
      value: value,
    })
    setDetail({
      ...detail,
      is_pinned: value,
    })
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        detail && (
          <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
            <div className='w-full max-w-md px-5 sm:pt-5'>
              <Link
                href={backUrl}
                className='inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              >
                <ChevronLeftIcon />
                Back to list
              </Link>
            </div>

            <div className='max-w-full overflow-x-auto p-5'>
              <div className='grid grid-cols-1 gap-y-4 sm:grid-cols-9 sm:gap-4'>
                <div className='col-span-3 flex flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]'>
                  <div className='px-6 py-5'>
                    <h3 className='text-base font-medium text-gray-800 dark:text-white/90'>
                      Banner
                    </h3>
                  </div>
                  <div className='flex flex-1 flex-col border-t border-gray-100 p-4 !pt-0 sm:p-6 dark:border-gray-800'>
                    <div className='relative flex flex-1 items-center'>
                      <Image
                        src={banner || detail.banner}
                        alt={detail.game_code}
                        width={200}
                        height={200}
                        className='!h-[100%] w-full rounded-lg object-cover'
                      />
                      <div
                        className='absolute top-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white opacity-80 hover:bg-gray-100 dark:hover:bg-gray-800'
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <PencilIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                      </div>
                    </div>
                    <Button
                      className={`mt-2 w-full ${bannerFile ? '!block' : '!hidden'}`}
                      size='sm'
                      disabled={isUploading}
                      onClick={updateBanner}
                    >
                      {isUploading ? 'Uploading...' : 'Edit'}
                    </Button>
                    <input
                      type='file'
                      onChange={handleOnChangeBanner}
                      ref={fileInputRef}
                      className='hidden'
                    />
                  </div>
                </div>

                <div className='col-span-6'>
                  <ComponentCard title='Information' className='h-full'>
                    <div>
                      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                        <div>
                          <Label>Game Name</Label>
                          <Input
                            type='text'
                            placeholder='Name'
                            value={detail.game_name}
                            disabled={true}
                          />
                        </div>
                        <div>
                          <Label>Add to home page</Label>
                          <div className='h-11 w-auto rounded-lg px-4 py-2.5'>
                            <Switch
                              label={detail.home_page ? 'Add' : 'Remove'}
                              defaultChecked={detail.home_page}
                              onChange={handleOnAddToHomePage}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Game Code</Label>
                          <Input
                            type='text'
                            placeholder='Game Code'
                            value={detail.game_code}
                            disabled={true}
                          />
                        </div>

                        <div>
                          <Label>Status</Label>
                          <div className='h-11 w-auto rounded-lg px-4 py-2.5'>
                            <Switch
                              label={
                                detail.status == '1' ? 'Active' : 'Inactive'
                              }
                              defaultChecked={detail.status == '1'}
                              onChange={handleStatusChange}
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Provider</Label>
                          <Input
                            type='text'
                            placeholder='Provider'
                            value={detail.provider_code}
                            disabled={true}
                          />
                        </div>

                        <div>
                          <Label>Pinned</Label>
                          <div className='h-11 w-auto rounded-lg px-4 py-2.5'>
                            <Switch
                              label={detail.is_pinned ? 'Pinned' : 'Unpinned'}
                              defaultChecked={detail.is_pinned}
                              onChange={handlePinnedChange}
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Order Number</Label>
                          <Input
                            type='number'
                            placeholder='Order Number'
                            value={detail.order || 0}
                            onChange={handleOrderNumberChange}
                          />
                        </div>
                      </div>
                    </div>
                  </ComponentCard>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  )
}

export default GameDetailPage
