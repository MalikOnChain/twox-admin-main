'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  getGameProviders,
} from '@/api/casino/game-providers'
import { getProvidersList, getProviderAnalytics, getProvidersSummary, IProvider } from '@/api/games-providers'
import { useDebounce } from '@/hooks/useDebounce'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import MetricsCard from '@/components/metrics/MetricsCard'
import GameProvidersTable from '@/components/pages/game-providers/GameProvidersTable'
import ProviderFilters from '@/components/pages/games-providers/providers/ProviderFilters'
import GGRShareChart from '@/components/pages/games-providers/providers/GGRShareChart'
import UptimeChart from '@/components/pages/games-providers/providers/UptimeChart'

import { GameProvider } from '@/types/game-provider'

const ProviderManagementPage = () => {
  const type = 'blueocean'
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [limit] = useState<number>(20)
  const [providersPage, setProvidersPage] = useState<number>(1)
  const [providersTotalPages, setProvidersTotalPages] = useState<number>(1)
  const [gameProviders, setGameProviders] = useState<GameProvider[]>([])
  const [providers, setProviders] = useState<IProvider[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [days, setDays] = useState(30)
  const [totalProviders, setTotalProviders] = useState<number>(0)
  const [totalGames, setTotalGames] = useState<number>(0)
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [codeFilter, setCodeFilter] = useState<string>('')
  
  // Debounce search filters to prevent excessive API calls
  const debouncedSearchFilter = useDebounce(searchFilter, 500)
  const debouncedCodeFilter = useDebounce(codeFilter, 500)

  const fetchGameProviders = useCallback(async () => {
    try {
      const response = await getGameProviders()
      setGameProviders(response.rows)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching providers')
      }
    }
  }, [])

  const fetchProvidersData = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) {
        setIsLoading(true)
      }
      const [providersData, analyticsData, summaryData] = await Promise.all([
        getProvidersList({
          page: providersPage,
          limit,
          search: debouncedSearchFilter.trim() || undefined,
          code: debouncedCodeFilter.trim() || undefined,
        }),
        getProviderAnalytics(days),
        getProvidersSummary(),
      ])
      setProviders(providersData.data)
      setProvidersTotalPages(providersData.pagination.totalPages)
      setAnalytics(analyticsData.data)
      
      // Use summary data for totals (more efficient for large datasets)
      setTotalProviders(summaryData.data.totalProviders)
      setTotalGames(summaryData.data.totalGames)
    } catch (error: any) {
      // Only show error if it's not a network error or if it's a real error
      if (error?.response) {
        // Server responded with error
        const errorMessage = error.response?.data?.message || error.message || 'Error fetching providers data'
        toast.error(errorMessage)
      } else if (error?.message && !error.message.includes('Network error')) {
        // Other errors (but not network errors)
        toast.error(error.message)
      }
      // Silently handle network errors to avoid showing "check internet connection" unnecessarily
    } finally {
      if (showLoading) {
        setIsLoading(false)
      }
    }
  }, [days, providersPage, limit, debouncedSearchFilter, debouncedCodeFilter])

  const initialLoading = useCallback(async () => {
    try {
      setIsLoading(true)
      await Promise.all([fetchGameProviders(), fetchProvidersData(false)])
    } finally {
      setIsLoading(false)
    }
  }, [fetchGameProviders, fetchProvidersData])

  const [isInitialMount, setIsInitialMount] = useState(true)

  useEffect(() => {
    initialLoading()
    setIsInitialMount(false)
  }, [initialLoading])

  // Refetch when filters or pagination change (using debounced values)
  useEffect(() => {
    // Skip initial mount (handled by initialLoading)
    if (!isInitialMount) {
      fetchProvidersData(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, providersPage, limit, debouncedSearchFilter, debouncedCodeFilter])

  const handleProvidersPageChange = (pageNum: number) => {
    setProvidersPage(pageNum)
  }

  const handleSearchChange = (value: string) => {
    setSearchFilter(value)
    setProvidersPage(1) // Reset to first page when filter changes
  }

  const handleCodeFilterChange = (value: string) => {
    setCodeFilter(value)
    setProvidersPage(1) // Reset to first page when filter changes
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <MetricsCard title='Total Providers' value={totalProviders} />
        <MetricsCard title='Total Games' value={totalGames} />
      </div>

      <ComponentCard title='BlueOcean Providers'>
        <ProviderFilters
          searchFilter={searchFilter}
          codeFilter={codeFilter}
          days={days}
          onSearchChange={handleSearchChange}
          onCodeChange={handleCodeFilterChange}
          onDaysChange={setDays}
        />
        <div className='mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {analytics && <GGRShareChart ggrShare={analytics.ggrShare} />}
          {analytics && <UptimeChart uptimeTrend={analytics.uptimeTrend} />}
        </div>

        <GameProvidersTable
          type={type}
          gameProviders={gameProviders}
          totalPages={providersTotalPages}
          page={providersPage}
          setPage={handleProvidersPageChange}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          fetchGameProviders={fetchGameProviders}
          providers={providers}
        />
      </ComponentCard>
    </div>
  )
}

export default ProviderManagementPage
