'use client'

import { useParams, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  createProviderInvoice,
  getProviderInvoices,
  updateProviderInvoice,
} from '@/api/operating-providers-invoice'

import { OperatingProviderInvoiceFormValues } from '@/lib/operating-provider'

import ComponentCard from '@/components/common/ComponentCard'
import Loading from '@/components/common/Loading'
import ProviderInvoiceModal from '@/components/operating-provider/ProviderInvoiceModal'
import OperatingProviderInvoiceTable from '@/components/pages/operating-provider/OperatingProviderInvoiceTable'
import Button from '@/components/ui/button/Button'

import { PlusIcon } from '@/icons'

import { IOperatingProviderInvoice } from '@/types/operating-provider'

const ProviderInvoicePage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [rows, setRows] = useState<IOperatingProviderInvoice[]>([])
  const [selectedRow, setSelectedRow] =
    useState<IOperatingProviderInvoice | null>(null)
  const { id } = useParams()
  const searchParams = useSearchParams()
  const providerName = searchParams.get('name')

  const handleOpenModal = useCallback(() => {
    setOpenModal(true)

    if (selectedRow) {
      setSelectedRow(null)
    }
  }, [selectedRow, setSelectedRow])

  const handleCloseModal = useCallback(() => {
    setOpenModal(false)
    if (selectedRow) {
      setSelectedRow(null)
    }
  }, [selectedRow, setSelectedRow])

  const fetchProviders = useCallback(async () => {
    try {
      const response = await getProviderInvoices({
        providerId: id as string,
        page,
        limit,
        filter: '',
      })
      setTotalPages(response.pagination.totalPages)
      setPage(response.pagination.currentPage)
      setRows(response.rows)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching provider invoices')
      }
    }
  }, [page, id, limit])

  const initialLoading = useCallback(async () => {
    await Promise.all([fetchProviders()])
    setIsLoading(false)
  }, [fetchProviders])

  const handleOnSubmit = async (data: OperatingProviderInvoiceFormValues) => {
    try {
      const payload = {
        ...data,
        issueDate: new Date(data.issueDate).toISOString(),
      }
      if (selectedRow) {
        await updateProviderInvoice(selectedRow._id, payload)
        toast.success('Provider updated successfully')
        fetchProviders()
        return true
      } else {
        await createProviderInvoice(payload)
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

  const handleOnEdit = (row: IOperatingProviderInvoice) => {
    setSelectedRow(row)
    handleOpenModal()
  }

  useEffect(() => {
    initialLoading()
  }, [initialLoading])

  if (!id) {
    return <div>Provider not found</div>
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <ComponentCard
      backUrl='/operating-providers'
      title={`${providerName} Invoices`}
      action={
        <Button onClick={handleOpenModal} size='xs'>
          <PlusIcon />
          Add Invoice
        </Button>
      }
    >
      <ProviderInvoiceModal
        isOpen={openModal}
        closeModal={handleCloseModal}
        selectedRow={selectedRow}
        providerId={id as string}
        onSubmit={handleOnSubmit}
      />

      <OperatingProviderInvoiceTable
        rows={rows}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        fetchProviders={fetchProviders}
        onEdit={handleOnEdit}
      />
    </ComponentCard>
  )
}

export default ProviderInvoicePage
