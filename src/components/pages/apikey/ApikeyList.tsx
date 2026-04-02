'use client'

import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { createApikey, getApikeys, updateApikey } from '@/api/apikey'

import { ApikeyFormValues } from '@/lib/apikey'
import { useModal } from '@/hooks/useModal'

import ChartTab from '@/components/common/ChartTab'
import ComponentCard from '@/components/common/ComponentCard'
import ApikeyDetailModal from '@/components/pages/apikey/ApikeyDetailModal'
import ApikeyTable from '@/components/pages/apikey/ApikeyTable'
import Button from '@/components/ui/button/Button'

import { PlusIcon } from '@/icons'

import {
  APIKeysFilterOptions,
  IApikeyData,
  scopeFilterOptions,
} from '@/types/apikey'

export default function ApikeyListPage() {
  const [tableData, setTableData] = useState<IApikeyData[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedApikey, setSelectedApikey] = useState<IApikeyData>(null)
  const [selectedFilter, setSelectedFilter] = useState<APIKeysFilterOptions>(
    APIKeysFilterOptions.MainFrontEnd
  )
  const CreateApikeyModal = useModal()

  const handleEdit = (tier: IApikeyData) => {
    setSelectedApikey(tier)
    CreateApikeyModal.openModal()
  }

  const fetchApikeys = useCallback(
    async (filter?: string) => {
      try {
        setIsLoading(true)
        const response = await getApikeys({
          page,
          limit,
          filter: filter || '',
          scope: selectedFilter,
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
    [page, limit, selectedFilter]
  )

  const handleOnSubmit = async (data: ApikeyFormValues) => {
    try {
      if (selectedApikey) {
        const res = await updateApikey(selectedApikey._id, data as IApikeyData)
        if (res.success) {
          toast.success('Apikey updated successfully')
        } else {
          toast.error(res.message)
        }
      } else {
        const res = await createApikey(data as IApikeyData)
        if (res.success) {
          toast.success('Apikey created successfully')
        } else {
          toast.error(res.message)
        }
      }
      fetchApikeys()
      return true
    } catch (error) {
      console.error('Error updating apikey detail:', error)
      return false
    }
  }

  const handleFilterChange = (value: APIKeysFilterOptions) => {
    setSelectedFilter(value)
  }

  const handleModalClose = () => {
    CreateApikeyModal.closeModal()
    if (selectedApikey) {
      setSelectedApikey(null)
    }
  }

  return (
    <div>
      <div className='space-y-6'>
        <ComponentCard
          title='API Keys'
          action={
            <Button onClick={CreateApikeyModal.openModal} size='xs'>
              <PlusIcon />
              Add API Key
            </Button>
          }
          tabs={
            <ChartTab
              options={scopeFilterOptions}
              selected={selectedFilter}
              setSelected={handleFilterChange}
            />
          }
        >
          <ApikeyTable
            tableData={tableData}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            fetchApikeys={fetchApikeys}
            onEdit={handleEdit}
          />
          <ApikeyDetailModal
            isOpen={CreateApikeyModal.isOpen}
            closeModal={handleModalClose}
            detail={selectedApikey}
            onSubmit={handleOnSubmit}
          />
        </ComponentCard>
      </div>
    </div>
  )
}
