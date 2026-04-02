'use client'

import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { banUser, getUsers, muteUser, updateUserBalance } from '@/api/users'

import ComponentCard from '@/components/common/ComponentCard'
import { InputSearch } from '@/components/common/InputSearch'
import UsersTable from '@/components/tables/UsersTable'

import { IUserData } from '@/types/users'

export default function UserListPage() {
  const [tableData, setTableData] = useState<IUserData[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchUsers = useCallback(
    async (filter?: string) => {
      try {
        setIsLoading(true)
        const response = await getUsers({
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
        console.error('Error fetching users:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [page, limit]
  )

  const handleBanStatusChange = async (userId: string, status: boolean) => {
    try {
      const response = await banUser({ id: userId, ban: status })
      if (response.success) {
        fetchUsers()
        if (status) {
          toast.success('User banned successfully')
        } else {
          toast.success('User unbanned successfully')
        }
      }
    } catch (error) {
      console.error('Error banning user:', error)
    }
  }

  const handleMuteStatusChange = async (userId: string, status: boolean) => {
    try {
      const response = await muteUser({ id: userId, mute: status })
      if (response.success) {
        fetchUsers()
        if (status) {
          toast.success('User muted successfully')
        } else {
          toast.success('User unmuted successfully')
        }
      }
    } catch (error) {
      console.error('Error muting user:', error)
    }
  }

  const handleBalanceChange = async (userId: string, balance: string) => {
    try {
      const response = await updateUserBalance({
        id: userId,
        balance: parseFloat(balance),
      })
      if (response.success) {
        fetchUsers()
        toast.success('User balance updated successfully')
      }
    } catch (error) {
      console.error('Error updating user balance:', error)
    }
  }

  return (
    <ComponentCard
      title='Users'
      inputSearchElement={<InputSearch fetchData={fetchUsers} />}
    >
      <UsersTable
        tableData={tableData}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        isLoading={isLoading}
        onBanStatusChange={handleBanStatusChange}
        onMuteStatusChange={handleMuteStatusChange}
        onBalanceChange={handleBalanceChange}
      />
    </ComponentCard>
  )
}
