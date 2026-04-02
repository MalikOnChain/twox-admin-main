import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getMetricsByUser, getReferredUsersByUser } from '@/api/user-affiliate'

import ReferredUsers from '@/components/affiliate/referred-users'
import ComponentCard from '@/components/common/ComponentCard'

import { IAffiliateMetrics, IReferredUser } from '@/types/affiliate'

const ReferredUsersByUser = ({ id }: { id: string }) => {
  const [tableData, setTableData] = useState<IReferredUser[]>([])
  const [metrics, setMetrics] = useState<IAffiliateMetrics>(null)
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchMetrics = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await getMetricsByUser({ id })
      setMetrics(response)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
      console.error('Error fetching metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  const fetchRefferedUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await getReferredUsersByUser({ page, limit, id })
      setTableData(response.rows)
      setTotalPages(response.totalPages)
      setPage(response.currentPage)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }, [page, limit, id])

  const initialLoading = useCallback(async () => {
    await Promise.all([fetchMetrics(), fetchRefferedUsers()])
    setIsLoading(false)
  }, [fetchMetrics, fetchRefferedUsers])

  useEffect(() => {
    initialLoading()
  }, [initialLoading])

  return (
    <ComponentCard title='Affiliate Details'>
      <ReferredUsers
        isLoading={isLoading}
        metrics={metrics}
        totalPages={totalPages}
        tableData={tableData}
        page={page}
        setPage={setPage}
        backUrl='/user-affiliate'
      />
    </ComponentCard>
  )
}
export default ReferredUsersByUser
