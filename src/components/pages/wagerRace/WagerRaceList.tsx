'use client'

import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import {
  createWagerRace,
  getWagerRaces,
  updateWagerRace,
} from '@/api/wagerRace'

import { WagerRaceFormValues } from '@/lib/wager-race'
import { useModal } from '@/hooks/useModal'

import ComponentCard from '@/components/common/ComponentCard'
import WagerRaceDetailModal from '@/components/pages/wagerRace/WagerRaceDetailModal'
import WagerRaceTable from '@/components/pages/wagerRace/WagerRaceTable'
import Button from '@/components/ui/button/Button'

import { PlusIcon } from '@/icons'

import { ITierData } from '@/types/tier'
import { IWagerRace } from '@/types/wagerRace'

export default function WagerRaceListPage() {
  const [tableData, setTableData] = useState<IWagerRace[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedWagerRace, setSelectedWagerRace] = useState<IWagerRace>(null)
  const CreateWagerRaceModal = useModal()
  const [options, setOptions] = useState<{
    tiers: ITierData[]
  }>({
    tiers: [],
  })
  const handleEdit = (wagerRace: IWagerRace) => {
    setSelectedWagerRace(wagerRace)
    CreateWagerRaceModal.openModal()
  }

  const fetchWagerRace = useCallback(
    async (filter?: string) => {
      try {
        setIsLoading(true)
        const response = await getWagerRaces({
          page,
          limit,
          filter: filter || '',
        })
        if (response.success) {
          setTableData(response.rows)
          setTotalPages(response.pagination.totalPages)
          setPage(response.pagination.currentPage)
          setOptions({
            tiers: response.options.tiers,
          })
        }
      } catch (error) {
        console.error('Error fetching tiers:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [page, limit]
  )

  const handleModalClose = () => {
    CreateWagerRaceModal.closeModal()
    if (selectedWagerRace) {
      setSelectedWagerRace(null)
    }
  }

  const handleOnSubmit = async (data: WagerRaceFormValues) => {
    try {
      if (selectedWagerRace) {
        const response = await updateWagerRace({
          id: selectedWagerRace._id,
          wagerRace: data as IWagerRace,
        })
        if (response.success) {
          toast.success('Wager Race updated successfully')
        } else {
          toast.error(response.message)
        }
      } else {
        const response = await createWagerRace(data as IWagerRace)
        if (response.success) {
          toast.success('Wager Race created successfully')
        } else {
          toast.error(response.message)
        }
      }
      fetchWagerRace()
      return true
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error creating wager race')
      }
      return false
    }
  }

  return (
    <div>
      <div className='space-y-6'>
        <ComponentCard
          title='Wager Races'
          action={
            <Button onClick={CreateWagerRaceModal.openModal} size='xs'>
              <PlusIcon />
              Add Wager Race
            </Button>
          }
        >
          <WagerRaceTable
            tableData={tableData}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            fetchWagerRace={fetchWagerRace}
            onEdit={handleEdit}
          />
          <WagerRaceDetailModal
            isOpen={CreateWagerRaceModal.isOpen}
            closeModal={handleModalClose}
            selectedWagerRace={selectedWagerRace}
            onSubmit={handleOnSubmit}
            options={options}
          />
        </ComponentCard>
      </div>
    </div>
  )
}
