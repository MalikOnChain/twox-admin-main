'use client'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

import { getGameProviderByCode } from '@/api/casino/game-providers'
import { getBlueOceanGamesList } from '@/api/casino/blueocean'

import { mapBlueOceanGamesToCasino } from '@/lib/blueocean-mapper'

import ComponentCard from '@/components/common/ComponentCard'
import { InputSearch } from '@/components/common/InputSearch'
import SlotsTable from '@/components/tables/SlotsTable'

import { ICasino } from '@/types/casino/casino'
import { GameProvider } from '@/types/game-provider'

const GameListByProvider = () => {
  const { provider_code } = useParams()
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
        const providerRes = await getGameProviderByCode(
          'blueocean',
          provider_code as string
        )
        setProvider(providerRes)
        const response = await getBlueOceanGamesList({
          page,
          limit,
          filter: filter || '',
          code: provider_code as string,
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
    [page, limit, provider_code]
  )

  useEffect(() => {
    fetchData()
  }, [page, limit, fetchData])

  return (
    <div>
      <div className='space-y-6'>
        <ComponentCard
          title={`${provider?.name || ''} Games`}
          backUrl='/game-providers'
          inputSearchElement={<InputSearch fetchData={fetchData} />}
        >
          <SlotsTable
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
