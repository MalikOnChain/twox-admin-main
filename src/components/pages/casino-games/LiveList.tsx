'use client'
import React, { useCallback, useEffect, useState } from 'react'

import { getBlueOceanGamesList } from '@/api/casino/blueocean'

import { mapBlueOceanGamesToCasino } from '@/lib/blueocean-mapper'

import ComponentCard from '@/components/common/ComponentCard'
import { InputSearch } from '@/components/common/InputSearch'
import SlotsTable from '@/components/tables/SlotsTable'

import { CasinoType, ICasino } from '@/types/casino/casino'

const LiveListPage = () => {
  const [tableData, setTableData] = useState<ICasino[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [totalPages, setTotalPages] = useState<number>(1)

  const fetchData = useCallback(
    async (filter?: string) => {
      try {
        setIsLoading(true)
        const response = await getBlueOceanGamesList({
          page,
          limit,
          type: CasinoType.LIVE,
          filter: filter || '',
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
    [page, limit]
  )

  useEffect(() => {
    fetchData()
  }, [page, limit, fetchData])

  return (
    <div>
      <div className='space-y-6'>
        <ComponentCard
          title='Live Casino Games'
          inputSearchElement={<InputSearch fetchData={fetchData} />}
        >
          <SlotsTable
            tableData={tableData}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            isLoading={isLoading}
            setTableData={setTableData}
            type={CasinoType.LIVE}
          />
        </ComponentCard>
      </div>
    </div>
  )
}

export default LiveListPage
