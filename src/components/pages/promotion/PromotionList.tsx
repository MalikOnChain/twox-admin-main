'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'

import Loading from '@/components/common/Loading'
import Pagination from '@/components/tables/Pagination'

import { IPromotionData } from '@/types/promotion'

type TierTableProps = {
  promotionData: IPromotionData[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading: boolean
  fetchPromotions: () => void
}

export default function PromotionList({
  promotionData,
  totalPages,
  page,
  setPage,
  isLoading,
  fetchPromotions,
}: TierTableProps) {
  useEffect(() => {
    fetchPromotions()
  }, [page, fetchPromotions])

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className=''>
            <div className='max-w-full'>
              <div className='grid w-full gap-x-6 gap-y-8 lg:grid-cols-2 xl:grid-cols-3'>
                {promotionData &&
                  promotionData.length > 0 &&
                  promotionData.map((row) => {
                    return (
                      <Link key={row._id} href={`/promotion/${row._id}`}>
                        <h2 className='p-2 font-bold text-black dark:text-white'>
                          {row.name}
                        </h2>
                        <div className='flex h-64 justify-center rounded-xl border-2 border-gray-300'>
                          <Image
                            src={row.image}
                            alt={row.name}
                            width={0}
                            height={0}
                            sizes='100vw'
                            className='h-full w-auto rounded-xl object-cover'
                          />
                        </div>
                      </Link>
                    )
                  })}
                {promotionData.length === 0 && (
                  <p className='py-2 text-gray-500 dark:text-gray-400'>
                    No data found
                  </p>
                )}
              </div>
              {totalPages > 1 && (
                <Pagination
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={setPage}
                  className='mb-5 justify-center'
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
