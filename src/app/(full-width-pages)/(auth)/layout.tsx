'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import GridShape from '@/components/common/GridShape'

// import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <div className='relative z-1 bg-white px-6 sm:p-0 dark:bg-gray-900'>
      <div className='relative flex h-[100dvh] w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900'>
        {children}
        <div className='bg-brand-950 hidden h-full w-full items-center lg:grid lg:w-1/2 dark:bg-white/5'>
          <div className='relative z-1 flex items-center justify-center'>
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className='flex max-w-xs flex-col items-center'>
              <Link href='/' className='mb-4 block'>
                <Image
                  width={0}
                  height={0}
                  sizes='100vw'
                  className='h-auto w-auto'
                  src='/images/logo/main-logo.png'
                  alt='Logo'
                />
              </Link>
              <p className='text-center text-gray-400 dark:text-white/60'>
                Two X Dashboard
              </p>
            </div>
          </div>
        </div>
        {/* <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div> */}
      </div>
    </div>
  )
}
