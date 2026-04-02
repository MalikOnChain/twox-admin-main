'use client'

import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { createTier, getTiers, updateTier } from '@/api/tier'

import { TierFormValues } from '@/lib/tier'
import { useModal } from '@/hooks/useModal'

import ComponentCard from '@/components/common/ComponentCard'
import TierDetailModal from '@/components/pages/tier/TierDetailModal'
import TierTable from '@/components/pages/tier/TierTable'
import Button from '@/components/ui/button/Button'

import { PlusIcon } from '@/icons'

import { ITierData } from '@/types/tier'

export default function TierListPage() {
  const [tableData, setTableData] = useState<ITierData[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedTier, setSelectedTier] = useState<ITierData>(null)
  const CreateTierModal = useModal()

  const handleEdit = (tier: ITierData) => {
    setSelectedTier(tier)
    CreateTierModal.openModal()
  }

  const fetchTiers = useCallback(
    async (filter?: string) => {
      try {
        setIsLoading(true)
        const response = await getTiers({
          page,
          limit,
          filter: filter || '',
        })
        if (response.success) {
          setTableData(response.rows)
          setTotalPages(response.pagination.totalPages)
          setPage(response.pagination.currentPage)
        }
      } catch (error) {
        console.error('Error fetching tiers:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [page, limit]
  )

  const handleOnSubmit = async (data: TierFormValues) => {
    if (selectedTier && data.icon === '') {
      toast.error('Please upload tier icon')
      return false
    }
    try {
      if (selectedTier) {
        const res = await updateTier(selectedTier._id, data as ITierData)
        if (res.success) {
          toast.success('Tier updated successfully')
        } else {
          toast.error(res.message)
        }
      } else {
        const res = await createTier(data as ITierData)
        if (res.success) {
          toast.success('Tier created successfully')
        } else {
          toast.error(res.message)
        }
      }
      fetchTiers()
      return true
    } catch (error) {
      console.error('Error updating tier detail:', error)
      return false
    }
  }

  const handleModalClose = () => {
    CreateTierModal.closeModal()
    if (selectedTier) {
      setSelectedTier(null)
    }
  }

  return (
    <div>
      <div className='space-y-6'>
        <ComponentCard
          title='Tiers'
          action={
            <Button onClick={CreateTierModal.openModal} size='xs'>
              <PlusIcon />
              Add Tier
            </Button>
          }
        >
          <TierTable
            tableData={tableData}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            fetchTiers={fetchTiers}
            onEdit={handleEdit}
          />
          <TierDetailModal
            isOpen={CreateTierModal.isOpen}
            closeModal={handleModalClose}
            detail={selectedTier}
            onSubmit={handleOnSubmit}
          />
        </ComponentCard>
      </div>
    </div>
  )
}
