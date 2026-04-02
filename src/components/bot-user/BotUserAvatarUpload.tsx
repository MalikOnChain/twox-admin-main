import Image from 'next/image'

import { PencilIcon } from '@/icons'

import { IBotUserData } from '@/types/bot-users'

const BotUserAvatarUpload = ({
  image,
  detailInfo,
  onImageChange,
  imageRef,
}: {
  image: string
  detailInfo: IBotUserData
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  imageRef: React.RefObject<HTMLInputElement>
}) => {
  return (
    <div className='m-auto my-2 flex h-auto flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]'>
      <div className='relative flex flex-1 flex-col p-4 sm:p-6'>
        <div className='flex h-[250px] flex-col items-center justify-center gap-2'>
          <Image
            src={image || detailInfo?.avatar || '/images/preview.png'}
            alt={detailInfo?.username || ''}
            width={0}
            height={0}
            sizes='100vw'
            className='h-full w-full rounded-lg object-contain'
          />
        </div>
        <input
          type='file'
          onChange={onImageChange}
          ref={imageRef}
          className='hidden'
        />
        <div
          className='absolute top-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white opacity-80 hover:bg-gray-100 dark:hover:bg-gray-800'
          onClick={() => imageRef.current?.click()}
        >
          <PencilIcon className='h-5 w-5 text-gray-500 dark:text-gray-400' />
        </div>
      </div>
    </div>
  )
}

export default BotUserAvatarUpload
