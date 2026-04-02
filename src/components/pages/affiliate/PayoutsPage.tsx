'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'

import {
  getPayouts,
  getPartners,
  overridePayout,
  IPayout,
  IPartner,
} from '@/api/affiliate-management'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import PayoutsFilters from './payouts/PayoutsFilters'
import PayoutsTable from './payouts/PayoutsTable'
import OverridePayoutModal from './payouts/OverridePayoutModal'
import { useModal } from '@/hooks/useModal'

export default function PayoutsPage() {
  const [loading, setLoading] = useState(true)
  const [payouts, setPayouts] = useState<IPayout[]>([])
  const [partners, setPartners] = useState<IPartner[]>([])
  const [selectedPayout, setSelectedPayout] = useState<IPayout | null>(null)
  const [overrideAmount, setOverrideAmount] = useState('')
  const [overrideNotes, setOverrideNotes] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
  })
  const [filters, setFilters] = useState({
    partnerId: '',
    status: '',
    startDate: '',
    endDate: '',
  })
  const overrideModal = useModal()

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

  const fetchPayouts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getPayouts({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...filters,
      })
      setPayouts(response.data)
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
    fetchPayouts()
  }, [fetchPayouts])

  const handleOverride = async () => {
    if (!selectedPayout || !overrideAmount) {
      toast.error('Please enter an amount')
      return
    }

    try {
      await overridePayout(selectedPayout._id, {
        amount: Number(overrideAmount),
        notes: overrideNotes,
      })
      toast.success('Payout overridden successfully')
      overrideModal.closeModal()
      setSelectedPayout(null)
      setOverrideAmount('')
      setOverrideNotes('')
      fetchPayouts()
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  }

  const handleExport = () => {
    toast.info('Export functionality coming soon')
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }))
  }

  const handleOpenOverride = (payout: IPayout) => {
    setSelectedPayout(payout)
    setOverrideAmount(payout.amount.toString())
    setOverrideNotes(payout.notes || '')
    overrideModal.openModal()
  }

  if (loading && payouts.length === 0) {
    return <Loading />
  }

  return (
    <div className='space-y-6'>
      <ComponentCard title='Payouts'>
        <PayoutsFilters
          partners={partners}
          partnerId={filters.partnerId}
          status={filters.status}
          startDate={filters.startDate}
          endDate={filters.endDate}
          onPartnerChange={(value) => setFilters((prev) => ({ ...prev, partnerId: value }))}
          onStatusChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
          onStartDateChange={(value) => setFilters((prev) => ({ ...prev, startDate: value }))}
          onEndDateChange={(value) => setFilters((prev) => ({ ...prev, endDate: value }))}
          onExport={handleExport}
        />

        <PayoutsTable
          payouts={payouts}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onOverride={handleOpenOverride}
        />
      </ComponentCard>

      <OverridePayoutModal
        isOpen={overrideModal.isOpen}
        payout={selectedPayout}
        amount={overrideAmount}
        notes={overrideNotes}
        onClose={() => {
          overrideModal.closeModal()
          setSelectedPayout(null)
          setOverrideAmount('')
          setOverrideNotes('')
        }}
        onAmountChange={setOverrideAmount}
        onNotesChange={setOverrideNotes}
        onSubmit={handleOverride}
      />
    </div>
  )
}
