'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

import {
  getPartners,
  getPartnerDetails,
  syncPartner,
  getNGRByPartner,
  getConversionFunnel,
  getROI,
  IPartner,
  IPartnerMetrics,
} from '@/api/affiliate-management'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import PartnersFilters from './partners/PartnersFilters'
import PartnersCharts from './partners/PartnersCharts'
import PartnersTable from './partners/PartnersTable'
import PartnerDetailsView from './partners/PartnerDetailsView'

export default function PartnersPage() {
  const [loading, setLoading] = useState(true)
  const [partners, setPartners] = useState<IPartner[]>([])
  const [selectedPartner, setSelectedPartner] = useState<IPartner | null>(null)
  const [partnerMetrics, setPartnerMetrics] = useState<IPartnerMetrics | null>(null)
  const [ngrByPartner, setNgrByPartner] = useState<Array<{ partner: string; partnerCode: string; ngr: number }>>([])
  const [funnel, setFunnel] = useState<{
    visitors: number
    registered: number
    deposited: number
    ftds: number
  } | null>(null)
  const [roi, setRoi] = useState<Array<{ date: string; cost: number; revenue: number; roi: number }>>([])
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
  const [days, setDays] = useState(30)
  const [syncing, setSyncing] = useState<string | null>(null)

  const fetchPartners = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getPartners({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...filters,
      })
      setPartners(response.data)
      setPagination(response.pagination)
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [pagination.currentPage, pagination.itemsPerPage, filters])

  const fetchPartnerDetails = useCallback(async (partnerId: string) => {
    try {
      const endDate = new Date().toISOString()
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
      const response = await getPartnerDetails(partnerId, { startDate, endDate })
      if (response.success && response.data?.metrics) {
        setPartnerMetrics(response.data.metrics)
      } else {
        setPartnerMetrics(null)
      }
    } catch (err) {
      console.error('Error fetching partner details:', err)
      setPartnerMetrics(null)
      if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  }, [days])

  const fetchAnalytics = useCallback(async () => {
    try {
      const endDate = new Date().toISOString()
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

      const [ngrRes, funnelRes, roiRes] = await Promise.allSettled([
        getNGRByPartner({ startDate, endDate }),
        getConversionFunnel({ startDate, endDate }),
        getROI({ startDate, endDate }),
      ])

      if (ngrRes.status === 'fulfilled' && ngrRes.value.success) {
        setNgrByPartner(ngrRes.value.data || [])
      } else if (ngrRes.status === 'rejected') {
        console.error('Error fetching NGR by partner:', ngrRes.reason)
      }

      if (funnelRes.status === 'fulfilled' && funnelRes.value.success) {
        setFunnel(funnelRes.value.data || {
          visitors: 0,
          registered: 0,
          deposited: 0,
          ftds: 0,
        })
      } else if (funnelRes.status === 'rejected') {
        console.error('Error fetching conversion funnel:', funnelRes.reason)
      }

      if (roiRes.status === 'fulfilled' && roiRes.value.success) {
        setRoi(roiRes.value.data || [])
      } else if (roiRes.status === 'rejected') {
        console.error('Error fetching ROI:', roiRes.reason)
      }
    } catch (err) {
      console.error('Error in fetchAnalytics:', err)
      if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  }, [days])

  useEffect(() => {
    fetchPartners()
  }, [fetchPartners])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  useEffect(() => {
    if (selectedPartner) {
      fetchPartnerDetails(selectedPartner._id)
    }
  }, [selectedPartner, fetchPartnerDetails])

  const handleSync = async (partnerId: string) => {
    try {
      setSyncing(partnerId)
      await syncPartner(partnerId)
      toast.success('Partner synced successfully')
      fetchPartners()
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      setSyncing(null)
    }
  }

  const handleExport = () => {
    toast.info('Export functionality coming soon')
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }

  if (loading && partners.length === 0) {
    return <Loading />
  }

  return (
    <div className='space-y-6'>
      <ComponentCard title='Partners'>
        <PartnersFilters
          search={filters.search}
          status={filters.status}
          days={days}
          onSearchChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
          onStatusChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
          onDaysChange={setDays}
          onExport={handleExport}
        />

        <PartnersCharts ngrByPartner={ngrByPartner} funnel={funnel} roi={roi} />

        <PartnersTable
          partners={partners}
          loading={loading}
          pagination={pagination}
          syncing={syncing}
          onPageChange={handlePageChange}
          onViewDetails={setSelectedPartner}
          onSync={handleSync}
        />

        {selectedPartner && partnerMetrics && (
          <PartnerDetailsView
            partner={selectedPartner}
            metrics={partnerMetrics}
            onClose={() => {
              setSelectedPartner(null)
              setPartnerMetrics(null)
            }}
          />
        )}
      </ComponentCard>
    </div>
  )
}
