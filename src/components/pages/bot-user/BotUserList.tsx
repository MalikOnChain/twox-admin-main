'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { createBotUser, getBotUsers, updateBotUser } from '@/api/bot-users'

import { BotUserFormValues } from '@/lib/bot-user'

import BotUserModal from '@/components/bot-user/BotUserModal'
import ComponentCard from '@/components/common/ComponentCard'
import BotUsersTable from '@/components/tables/BotUsersTable'
import Button from '@/components/ui/button/Button'

import { PlusIcon } from '@/icons'

import { IBotUserData } from '@/types/bot-users'

export default function BotUserListPage() {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [tableData, setTableData] = useState<IBotUserData[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedBotUser, setSelectedBotUser] = useState<IBotUserData | null>(
    null
  )

  const handleOpenModal = useCallback(() => {
    setOpenModal(true)

    if (selectedBotUser) {
      setSelectedBotUser(null)
    }
  }, [selectedBotUser, setSelectedBotUser])

  const handleCloseModal = useCallback(() => {
    setOpenModal(false)
    if (selectedBotUser) {
      setSelectedBotUser(null)
    }
  }, [selectedBotUser, setSelectedBotUser])

  const fetchBotUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await getBotUsers({
        page,
        limit,
        filter: '',
      })
      if (response.success) {
        setTableData(response.rows)
        setTotalPages(response.pagination.totalPages)
        setPage(response.pagination.currentPage)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }, [page, limit])

  const handleOnEdit = (row: IBotUserData) => {
    setSelectedBotUser(row)
    handleOpenModal()
  }

  const handleOnSubmit = async (data: BotUserFormValues) => {
    if (selectedBotUser && data.avatar === '') {
      toast.error('Please upload bot user avatar')
      return false
    }
    try {
      if (selectedBotUser) {
        const res = await updateBotUser({
          id: selectedBotUser._id,
          data,
        })
        if (res.success) {
          toast.success('Bot user updated successfully')
        } else {
          toast.error(res.message)
        }
      } else {
        const res = await createBotUser({ data })
        if (res.success) {
          toast.success('Bot user created successfully')
        } else {
          toast.error(res.message)
        }
      }
      fetchBotUsers()
      return true
    } catch (error) {
      console.error('Error updating bot user detail:', error)
      return false
    }
  }

  useEffect(() => {
    fetchBotUsers()
  }, [fetchBotUsers])

  return (
    <ComponentCard
      title='Bot Users'
      action={
        <Button onClick={handleOpenModal} size='xs'>
          <PlusIcon />
          Add Bot User
        </Button>
      }
    >
      <BotUserModal
        isOpen={openModal}
        closeModal={handleCloseModal}
        selectedBotUser={selectedBotUser}
        onSubmit={handleOnSubmit}
      />
      <BotUsersTable
        tableData={tableData}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        fetchBotUsers={fetchBotUsers}
        onEdit={handleOnEdit}
      />
    </ComponentCard>
  )
}
