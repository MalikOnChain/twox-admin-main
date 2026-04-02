'use client'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  getPlayerList,
  IPlayerListFilters,
} from '@/api/user-management'
import { getTiers } from '@/api/tier'

import Loading from '@/components/common/Loading'

import PlayerListFilters from './player-list/PlayerListFilters'
import PlayerListTable from './player-list/PlayerListTable'
import RetentionChart from './player-list/RetentionChart'
import TopCountriesChart from './player-list/TopCountriesChart'

export default function PlayerListPage() {
  const [players, setPlayers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<IPlayerListFilters>({
    page: 1,
    limit: 20,
  })
  const [retentionData, setRetentionData] = useState<any[]>([])
  const [topCountries, setTopCountries] = useState<any[]>([])
  const [vipTiers, setVipTiers] = useState<Array<{ name: string }>>([])

  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getPlayerList(filters)
      setPlayers(response.data)
      setTotalPages(response.pagination.totalPages)
      setPage(response.pagination.currentPage)
      setRetentionData(response.charts.retention)
      setTopCountries(response.charts.topCountries)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching players')
      }
    } finally {
      setLoading(false)
    }
  }, [filters])

  const fetchVipTiers = useCallback(async () => {
    try {
      const response = await getTiers({ page: 1, limit: -1 })
      if (response.success && response.rows) {
        setVipTiers(response.rows.map((tier) => ({ name: tier.name })))
      }
    } catch (error) {
      console.error('Error fetching VIP tiers:', error)
      // Fallback to empty array if fetch fails
      setVipTiers([])
    }
  }, [])

  useEffect(() => {
    fetchPlayers()
  }, [fetchPlayers])

  useEffect(() => {
    fetchVipTiers()
  }, [fetchVipTiers])

  const handleFilterChange = (key: keyof IPlayerListFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  return (
    <div className='grid grid-cols-12 gap-4 md:gap-6'>
      {/* Filters */}
      <div className='col-span-12'>
        <PlayerListFilters
          filters={filters}
          vipTiers={vipTiers}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Charts */}
      <div className='col-span-12 lg:col-span-6'>
        <RetentionChart data={retentionData} />
      </div>

      <div className='col-span-12 lg:col-span-6'>
        <TopCountriesChart data={topCountries} />
      </div>

      {/* Table */}
      <div className='col-span-12'>
        {loading ? (
          <Loading />
        ) : (
          <PlayerListTable
            players={players}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )
}
