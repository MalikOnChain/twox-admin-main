'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

import { getDeals, getPartners, IDeal, IPartner } from '@/api/affiliate-management'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import DealsFilters from './deals/DealsFilters'
import DealsTable from './deals/DealsTable'

export default function DealsPage() {
  const [loading, setLoading] = useState(true)
  const [deals, setDeals] = useState<IDeal[]>([])
  const [partners, setPartners] = useState<IPartner[]>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  })
  const [filters, setFilters] = useState({
    partnerId: '',
    status: '',
  })

  const fetchPartners = useCallback(async () => {
    try {
      const response = await getPartners({ page: 1, limit: 1000 })
      setPartners(response.data)
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  }, [])

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getDeals({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...filters,
      })
      setDeals(response.data)
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
    fetchPartners()
  }, [fetchPartners])

  useEffect(() => {
    fetchDeals()
  }, [fetchDeals])

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }

  const handleCreateDeal = () => {
    toast.info('Create deal functionality coming soon')
  }

  if (loading && deals.length === 0) {
    return <Loading />
  }

  return (
    <div className='space-y-6'>
      <ComponentCard title='Deals'>
        <DealsFilters
          partners={partners}
          partnerId={filters.partnerId}
          status={filters.status}
          onPartnerChange={(value) => setFilters((prev) => ({ ...prev, partnerId: value }))}
          onStatusChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
          onCreateDeal={handleCreateDeal}
        />

        <DealsTable deals={deals} loading={loading} pagination={pagination} onPageChange={handlePageChange} />
      </ComponentCard>
    </div>
  )
}
