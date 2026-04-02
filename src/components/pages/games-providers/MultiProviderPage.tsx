'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import {
  getMultiProviderCatalog,
  getProviderDetail,
  getVerticalManager,
  IProviderCatalogItem,
  IProviderDetail,
  IVerticalManagerItem,
} from '@/api/games-providers'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import ProviderCatalogTable from './multi-provider/ProviderCatalogTable'
import ProviderDetailModal from './multi-provider/ProviderDetailModal'
import VerticalManagerCards from './multi-provider/VerticalManagerCards'

export default function MultiProviderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [catalog, setCatalog] = useState<IProviderCatalogItem[]>([])
  const [verticals, setVerticals] = useState<IVerticalManagerItem[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [providerDetail, setProviderDetail] = useState<IProviderDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [days, setDays] = useState(30)
  const [catalogPage, setCatalogPage] = useState(1)
  const [catalogLimit] = useState(10)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [catalogResponse, verticalsResponse] = await Promise.all([
        getMultiProviderCatalog(days),
        getVerticalManager(days),
      ])
      setCatalog(catalogResponse.data)
      setVerticals(verticalsResponse.data)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching multi-provider data')
      }
    } finally {
      setLoading(false)
    }
  }, [days])

  const fetchProviderDetail = useCallback(
    async (providerCode: string) => {
      try {
        setDetailLoading(true)
        const response = await getProviderDetail(providerCode, days)
        setProviderDetail(response.data)
        setShowDetailModal(true)
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Error fetching provider detail')
        }
      } finally {
        setDetailLoading(false)
      }
    },
    [days]
  )

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleViewProvider = (providerCode: string) => {
    setSelectedProvider(providerCode)
    fetchProviderDetail(providerCode)
  }

  const handleViewGames = (providerCode: string) => {
    router.push(`/game-providers/blueocean?provider=${providerCode}`)
  }

  const paginatedCatalog = useMemo(() => {
    const start = (catalogPage - 1) * catalogLimit
    const end = start + catalogLimit
    return catalog.slice(start, end)
  }, [catalog, catalogPage, catalogLimit])

  const catalogTotalPages = Math.ceil(catalog.length / catalogLimit)

  if (loading) {
    return <Loading />
  }

  return (
    <div className='space-y-6'>
      <ComponentCard title='Multi-Provider & Multi-Vertical'>
        {/* Filters */}
        <div className='mb-6'>
          <label className='text-sm font-medium text-gray-400 mr-2'>Date Range (Days)</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className='mt-2 w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* Provider Catalog */}
        <div className='mb-8'>
          <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
            Provider Catalog
          </h3>
          <ProviderCatalogTable
            catalog={paginatedCatalog}
            currentPage={catalogPage}
            totalPages={catalogTotalPages}
            onPageChange={setCatalogPage}
            onViewProvider={handleViewProvider}
            onViewGames={handleViewGames}
          />
        </div>

        {/* Vertical Manager */}
        <div className='mt-8'>
          <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
            Vertical Manager
          </h3>
          <VerticalManagerCards verticals={verticals} />
        </div>
      </ComponentCard>

      <ProviderDetailModal
        isOpen={showDetailModal}
        providerDetail={providerDetail}
        loading={detailLoading}
        onClose={() => {
          setShowDetailModal(false)
          setProviderDetail(null)
          setSelectedProvider(null)
        }}
      />
    </div>
  )
}
