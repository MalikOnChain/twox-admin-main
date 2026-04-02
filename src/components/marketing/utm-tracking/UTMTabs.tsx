import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { cn, getUtmSourceOptions } from '@/lib/utils'

const UTM_SOURCE_OPTIONS = getUtmSourceOptions(true)

UTM_SOURCE_OPTIONS.unshift({
  label: 'All',
  value: 'all',
  icon: '/images/icons/user-group.png',
})

const UTMTabs = ({
  utmSource,
  onClick,
  className,
}: {
  utmSource: string
  onClick: (value: string) => void
  className?: string
}) => {
  const swiperOptions = {
    modules: [Navigation],
    slidesPerView: 'auto' as const,
    loop: false,
    spaceBetween: 3,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      768: {
        slidesPerView: 'auto' as const,
      },
      1280: {
        slidesPerView: 'auto' as const,
      },
      1536: {
        slidesPerView: 'auto' as const,
      },
    },
  }

  return (
    <div
      className={cn(
        'relative flex w-[300px] items-center gap-2 px-10',
        className
      )}
    >
      <div className='relative w-full'>
        <Swiper {...swiperOptions} className='h-full'>
          {UTM_SOURCE_OPTIONS.map((option) => (
            <SwiperSlide
              key={option.value}
              className='flex !w-auto items-center justify-center'
            >
              <div
                className={cn(
                  'flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-400 p-1',
                  'border-gray-800 bg-white dark:border-gray-600 dark:bg-white/[0.03]',
                  utmSource === option.value &&
                    'border-gray-800 bg-white dark:border-gray-600 dark:bg-amber-200'
                )}
                onClick={() => onClick(option.value)}
              >
                <Image
                  src={option.icon}
                  alt={option.label}
                  width={35}
                  height={35}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className='swiper-button-prev'>
        <ChevronLeftIcon className='h-2 w-2' />
      </div>
      <div className='swiper-button-next'>
        <ChevronRightIcon className='h-5 w-5' />
      </div>
    </div>
  )
}

export default UTMTabs
