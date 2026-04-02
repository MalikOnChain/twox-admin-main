'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

import {
  getSegmentation,
  getFilterOptions,
  ISegmentationUser,
  ISegmentationStats,
  IFilterOptions,
} from '@/api/bonus-segmentation'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import Pagination from '@/components/tables/Pagination'
import SegmentationStatsCards from './segmentation/SegmentationStatsCards'
import SegmentationFilters from './segmentation/SegmentationFilters'
import SegmentationCharts from './segmentation/SegmentationCharts'
import SegmentationTable from './segmentation/SegmentationTable'

export default function SegmentationPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<ISegmentationUser[]>([])
  const [stats, setStats] = useState<ISegmentationStats | null>(null)
  const [filterOptions, setFilterOptions] = useState<IFilterOptions | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 50,
  })

  // Filters
  const [filters, setFilters] = useState({
    country: '',
    vip: '',
    risk: '',
    currency: '',
    provider: '',
    gameCategory: '',
    minBalance: '',
    maxBalance: '',
    depositFrequency: '',
  })

  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await getFilterOptions()
      setFilterOptions(response.data)
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  }, [])

  const fetchSegmentation = useCallback(async () => {
    try {
      setLoading(true)
      const params: any = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
      }

      if (filters.country) params.country = filters.country
      if (filters.vip) params.vip = filters.vip
      if (filters.risk) params.risk = filters.risk
      if (filters.currency) params.currency = filters.currency
      if (filters.provider) params.provider = filters.provider
      if (filters.gameCategory) params.gameCategory = filters.gameCategory
      if (filters.minBalance) params.minBalance = Number(filters.minBalance)
      if (filters.maxBalance) params.maxBalance = Number(filters.maxBalance)
      if (filters.depositFrequency) params.depositFrequency = filters.depositFrequency

      const response = await getSegmentation(params)
      setUsers(response.data)
      setStats(response.stats)
      setPagination(response.pagination)
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.currentPage, pagination.itemsPerPage])

  useEffect(() => {
    fetchFilterOptions()
  }, [fetchFilterOptions])

  useEffect(() => {
    fetchSegmentation()
  }, [fetchSegmentation])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }

  const handleResetFilters = () => {
    setFilters({
      country: '',
      vip: '',
      risk: '',
      currency: '',
      provider: '',
      gameCategory: '',
      minBalance: '',
      maxBalance: '',
      depositFrequency: '',
    })
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }

  if (loading && !stats) {
    return <Loading />
  }

  return (
    <div className='space-y-6'>
      <ComponentCard title='Segmentation'>
        <SegmentationStatsCards stats={stats} />
        <SegmentationFilters
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />
        <SegmentationCharts stats={stats} />
        <SegmentationTable users={users} loading={loading} />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className='mt-4 flex justify-center'>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </ComponentCard>
    </div>
  )
}
