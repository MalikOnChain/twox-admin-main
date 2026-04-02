'use client'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

import { getGameProviderByCode } from '@/api/casino/game-providers'
import { getBlueOceanGamesList } from '@/api/casino/blueocean'

import { mapBlueOceanGamesToCasino } from '@/lib/blueocean-mapper'

import ComponentCard from '@/components/common/ComponentCard'
import { InputSearch } from '@/components/common/InputSearch'
import Loading from '@/components/common/Loading'
import SlotsTable from '@/components/tables/SlotsTable'

import { ICasino } from '@/types/casino/casino'
import { GameProvider } from '@/types/game-provider'

const GameListByProvider = () => {
  const { type, provider_code } = useParams<{
    type: string
    provider_code: string
  }>()
  const [tableData, setTableData] = useState<ICasino[]>([])
  const [provider, setProvider] = useState<GameProvider>(null)
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [totalPages, setTotalPages] = useState<number>(1)

  const fetchData = useCallback(
    async (filter?: string) => {
      try {
        setIsLoading(true)
        const providerRes = await getGameProviderByCode(type, provider_code)
        setProvider(providerRes)
        const response = await getBlueOceanGamesList({
          page,
          limit,
          filter: filter || '',
          code: provider_code,
        })
        setTableData(mapBlueOceanGamesToCasino(response.rows))
        setTotalPages(response.pagination.totalPages)
        setPage(response.pagination.currentPage)
      } catch (error) {
        console.error('Error fetching slots:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [page, limit, type, provider_code]
  )

  useEffect(() => {
    fetchData()
  }, [page, limit, fetchData])
  return (
    <div>
      <div className='space-y-6'>
        {isLoading ? (
          <Loading />
        ) : (
          <div className='grid grid-cols-1 rounded-2xl border border-gray-200 bg-white px-10 py-6 md:grid-cols-2 dark:border-gray-800 dark:bg-white/[0.03]'>
            <Image
              width={0}
              height={0}
              sizes='100vw'
              src={provider?.banner}
              alt={provider?.name}
              className='!h-[70px] !w-[70px]'
            />
            <div className='flex flex-col text-gray-100 dark:text-gray-400'>
              <h3 className='text-2xl font-bold'>{provider?.name}</h3>
              <span>Games: {provider?.countGames}</span>
              {provider?.status ? (
                <span>
                  Status: <span className='text-green-600'>Active</span>
                </span>
              ) : (
                <span>Status: Disabled</span>
              )}
            </div>
          </div>
        )}
        <ComponentCard
          title={`${provider?.name || ''} Games`}
          backUrl={`/game-providers/${type}`}
          inputSearchElement={<InputSearch fetchData={fetchData} />}
        >
          <SlotsTable
            backUrl={`/game-providers/${type}`}
            tableData={tableData}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            isLoading={isLoading}
            setTableData={setTableData}
          />
        </ComponentCard>
      </div>
    </div>
  )
}

export default GameListByProvider
