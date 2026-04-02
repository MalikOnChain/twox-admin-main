'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  getGamesList,
  getProvidersList,
  IGame,
  IProvider,
  updateGameStatus,
} from '@/api/games-providers'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import { InputSearch } from '@/components/common/InputSearch'
import Pagination from '@/components/tables/Pagination'
import GamesFilters from './games/GamesFilters'
import GamesTable from './games/GamesTable'

export default function GamesPage() {
  const [loading, setLoading] = useState(true)
  const [games, setGames] = useState<IGame[]>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  })
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState('')
  const [providerFilter, setProviderFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [providers, setProviders] = useState<IProvider[]>([])

  const fetchProviders = useCallback(async () => {
    try {
      const response = await getProvidersList()
      setProviders(response.data)
    } catch (err) {
      console.error('Error fetching providers:', err)
    }
  }, [])

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getGamesList({
        page,
        limit,
        search: search || undefined,
        provider: providerFilter || undefined,
        status: statusFilter || undefined,
      })
      setGames(response.data)
      setPagination(response.pagination)
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('Error fetching games')
      }
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, providerFilter, statusFilter])

  useEffect(() => {
    fetchProviders()
  }, [fetchProviders])

  useEffect(() => {
    fetchGames()
  }, [fetchGames])

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value)
      setPage(1)
    },
    []
  )

  const handleToggleStatus = useCallback(
    async (game: IGame) => {
      try {
        await updateGameStatus(game._id, {
          isEnabled: !game.isEnabled,
          status: !game.isEnabled ? 'active' : 'inactive',
        })
        toast.success(`Game ${!game.isEnabled ? 'enabled' : 'disabled'} successfully`)
        fetchGames()
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message)
        } else {
          toast.error('Error updating game status')
        }
      }
    },
    [fetchGames]
  )

  const handleChangePage = (pageNum: number) => {
    setPage(pageNum)
  }

  if (loading && games.length === 0) {
    return <Loading />
  }

  return (
    <div className='space-y-6'>
      <ComponentCard
        title='Games / Game Detail'
        inputSearchElement={<InputSearch fetchData={handleSearch} />}
      >
        <GamesFilters
          providers={providers}
          providerFilter={providerFilter}
          statusFilter={statusFilter}
          onProviderChange={(value) => {
            setProviderFilter(value)
            setPage(1)
          }}
          onStatusChange={(value) => {
            setStatusFilter(value)
            setPage(1)
          }}
        />

        <GamesTable games={games} onToggleStatus={handleToggleStatus} />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className='mt-6'>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handleChangePage}
              className='justify-center'
            />
          </div>
        )}
      </ComponentCard>
    </div>
  )
}

