'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

import { getMiniAffiliates, IMiniAffiliate } from '@/api/affiliate-management'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import MiniAffiliatesFilters from './mini-affiliates/MiniAffiliatesFilters'
import MiniAffiliatesTable from './mini-affiliates/MiniAffiliatesTable'

export default function MiniAffiliatesPage() {
  const [loading, setLoading] = useState(true)
  const [miniAffiliates, setMiniAffiliates] = useState<IMiniAffiliate[]>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  })
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  })

  const fetchMiniAffiliates = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getMiniAffiliates({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...filters,
      })
      setMiniAffiliates(response.data)
      setPagination(response.pagination)
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [pagination.currentPage, pagination.itemsPerPage, filters])

  useEffect(() => {
    fetchMiniAffiliates()
  }, [fetchMiniAffiliates])

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }

  if (loading && miniAffiliates.length === 0) {
    return <Loading />
  }

  return (
    <div className='space-y-6'>
      <ComponentCard title='Mini-Affiliates (Players)'>
        <MiniAffiliatesFilters
          search={filters.search}
          status={filters.status}
          onSearchChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
          onStatusChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
        />

        <MiniAffiliatesTable
          miniAffiliates={miniAffiliates}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </ComponentCard>
    </div>
  )
}
