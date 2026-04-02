'use client'

import { useRouter } from 'next/navigation'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { toast } from 'sonner'

import { getCashbacks } from '@/api/cashback'

import { useModal } from '@/hooks/useModal'

import ComponentCard from '@/components/common/ComponentCard'
import CashbackDetailModal from '@/components/pages/cashback/CashbackDetailModal'
import CashbackTable from '@/components/pages/cashback/CashbackTable'
import Button from '@/components/ui/button/Button'

import { PlusIcon } from '@/icons'

import { ICashbackData, ICashbackTableData } from '@/types/cashback'

export default function CashbackList() {
  const [tableData, setTableData] = useState<ICashbackTableData>({
    cashbacks: [],
    tiers: [],
  })
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedCashback, setSelectedCashback] =
    useState<ICashbackData | null>(null)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const CreateCashbackModal = useModal()
  const router = useRouter()

  const fetchCashbacks = useCallback(
    async (filter?: string) => {
      try {
        setIsLoading(true)
        const response = await getCashbacks({
          page,
          limit,
          filter: filter || '',
        })
        if (response.success) {
          setTableData(response.rows)
          setTotalPages(response.pagination.totalPages)
          setPage(response.pagination.currentPage)
        } else {
          toast.error('Failed to fetch cashbacks')
        }
      } catch (error) {
        console.error('Error fetching cashbacks:', error)
        toast.error('An error occurred while fetching cashbacks')
      } finally {
        setIsLoading(false)
      }
    },
    [page, limit]
  )

  const handleEdit = (cashback: ICashbackData) => {
    setSelectedCashback(cashback)
    CreateCashbackModal.openModal()
  }

  const onShowCashbackLogs = () => {
    router.push('/cashback/logs')
  }

  useLayoutEffect(() => {
    fetchCashbacks()
  }, [fetchCashbacks])

  return (
    <>
      {tableData.tiers.length > 0 ? (
        <div>
          <div className='space-y-6'>
            <ComponentCard
              title='Cashback'
              action={
                <div className='flex gap-2'>
                  <Button onClick={CreateCashbackModal.openModal} size='xs'>
                    <PlusIcon />
                    Add Cashback
                  </Button>
                  <Button
                    className='bg-gray-600'
                    size='xs'
                    onClick={onShowCashbackLogs}
                  >
                    Show cashback logs
                  </Button>
                </div>
              }
            >
              <CashbackTable
                tableData={tableData}
                totalPages={totalPages}
                page={page}
                setPage={setPage}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                fetchCashbacks={fetchCashbacks}
                onEdit={handleEdit}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
              />
              <CashbackDetailModal
                isOpen={CreateCashbackModal.isOpen}
                closeModal={CreateCashbackModal.closeModal}
                detail={selectedCashback}
                setSelectedCashback={setSelectedCashback}
                setIsEdit={setIsEdit}
                tiers={tableData.tiers}
              />
            </ComponentCard>
          </div>
        </div>
      ) : (
        <div className='flex h-[200px] items-center justify-center'>
          <p className='text-gray-500 dark:text-gray-400'>
            Please create tiers first to manage cashbacks
          </p>
        </div>
      )}
    </>
  )
}
