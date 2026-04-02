'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  createProvider,
  getProviders,
  updateProvider,
} from '@/api/operating-providers'

import { OperatingProviderFormValues } from '@/lib/operating-provider'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import MetricsCard from '@/components/metrics/MetricsCard'
import ProviderSettingModal from '@/components/operating-provider/ProviderSettingModal'
import OperatingProviderTable from '@/components/pages/operating-provider/OperatingProviderTable'
import Button from '@/components/ui/button/Button'

import { PlusIcon } from '@/icons'

import { IOperatingProvider } from '@/types/operating-provider'

const ProviderManagementPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [providers, setProviders] = useState<IOperatingProvider[]>([])
  const [selectedProvider, setSelectedProvider] =
    useState<IOperatingProvider | null>(null)

  const handleOpenModal = useCallback(() => {
    setOpenModal(true)

    if (selectedProvider) {
      setSelectedProvider(null)
    }
  }, [selectedProvider, setSelectedProvider])

  const handleCloseModal = useCallback(() => {
    setOpenModal(false)
    if (selectedProvider) {
      setSelectedProvider(null)
    }
  }, [selectedProvider, setSelectedProvider])

  const fetchProviders = useCallback(async () => {
    try {
      const response = await getProviders({
        page,
        limit,
        filter: '',
      })
      setTotalPages(response.pagination.totalPages)
      setPage(response.pagination.currentPage)
      setProviders(response.rows)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching providers')
      }
    }
  }, [page, limit])

  const initialLoading = useCallback(async () => {
    await Promise.all([fetchProviders()])
    setIsLoading(false)
  }, [fetchProviders])

  const handleOnSubmit = async (data: OperatingProviderFormValues) => {
    try {
      if (selectedProvider) {
        await updateProvider(selectedProvider._id, data)
        toast.success('Provider updated successfully')
        fetchProviders()
        return true
      } else {
        await createProvider(data)
        toast.success('Provider created successfully')
        fetchProviders()
        return true
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error creating provider')
      }
      return false
    }
  }

  const handleOnEdit = (provider: IOperatingProvider) => {
    setSelectedProvider(provider)
    handleOpenModal()
  }

  useEffect(() => {
    initialLoading()
  }, [initialLoading])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <MetricsCard title='Total Providers' value={providers.length} />
        <MetricsCard
          title='Total Amount'
          value={`R$${providers.reduce(
            (acc, provider) => acc + (provider.totalAmount || 0),
            0
          )}`}
        />
      </div>

      <ComponentCard
        title='Providers'
        action={
          <Button onClick={handleOpenModal} size='xs'>
            <PlusIcon />
            Add Provider
          </Button>
        }
      >
        <ProviderSettingModal
          isOpen={openModal}
          closeModal={handleCloseModal}
          selectedProvider={selectedProvider}
          onSubmit={handleOnSubmit}
        />
        <OperatingProviderTable
          providers={providers}
          totalPages={totalPages}
          page={page}
          setPage={setPage}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          fetchProviders={fetchProviders}
          onEdit={handleOnEdit}
        />
      </ComponentCard>
    </div>
  )
}

export default ProviderManagementPage
