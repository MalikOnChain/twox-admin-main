'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  getAllUserAffiliates,
  getUserAffiliateSettings,
  storeUserAffiliateSetting,
} from '@/api/user-affiliate'

import ComponentCard from '@/components/common/ComponentCard'
import { Skeleton } from '@/components/common/Skeleton'
import Label from '@/components/form/Label'
import Pagination from '@/components/tables/Pagination'
import Badge from '@/components/ui/badge/Badge'
import Button from '@/components/ui/button/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { IUserAffiliateCollection } from '@/types/user-affiliate'

// ✅ Zod schema
const schema = z.object({
  depositCommissionRate: z
    .number({ required_error: 'Deposit commission is required' })
    .min(0, 'Minimum is 0')
    .max(12, 'Maximum is 12'),
})

type FormData = z.infer<typeof schema>
const UserAffiliate = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [tableData, setTableData] = useState<IUserAffiliateCollection[]>([])
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      depositCommissionRate: 0,
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      await storeUserAffiliateSetting({
        depositCommissionRate: data.depositCommissionRate,
      })
      toast.success('Saved successfully!')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to save')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserAffiliateSettings = useCallback(async () => {
    const settings = await getUserAffiliateSettings()
    reset({
      depositCommissionRate: settings?.depositCommissionRate || 0,
    })
  }, [reset])

  const fetchUserAffiliates = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await getAllUserAffiliates({ page, limit })
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
  }, [page, limit])
  useEffect(() => {
    fetchUserAffiliateSettings()
    fetchUserAffiliates()
  }, [fetchUserAffiliateSettings, fetchUserAffiliates])

  return (
    <div className='grid grid-cols-1 gap-6 xl:grid-cols-1'>
      {isLoading ? (
        <Skeleton />
      ) : (
        <ComponentCard title='User Affiliate Setting'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
              <div>
                <Label>Deposit Commission Rate</Label>
                <input
                  type='number'
                  step={0.1}
                  min={0}
                  max={1.2}
                  className='shadow-theme-xs h-11 w-full rounded-lg border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:ring-3 focus:outline-none dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30'
                  {...register('depositCommissionRate', {
                    valueAsNumber: true,
                  })}
                />
                {errors.depositCommissionRate && (
                  <p className='text-error-500 mt-1 text-xs'>
                    {errors.depositCommissionRate.message}
                  </p>
                )}
              </div>
              <div className='flex items-end justify-start'>
                <Button
                  type='submit'
                  size='sm'
                  disabled={!isDirty || isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </div>
          </form>
        </ComponentCard>
      )}
      {isLoading ? (
        <Skeleton />
      ) : (
        <ComponentCard title='User Affiliates'>
          <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
            <div className='max-w-full overflow-x-auto'>
              <Table>
                {/* Table Header */}
                <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                  <TableRow>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                    >
                      User Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                    >
                      Refferal Code
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Refferred Users
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                  {tableData.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell className='text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400'>
                        <Link
                          href={`/user-affiliate/${row._id}`}
                          className='hover:text-brand-500'
                        >
                          <Badge variant='light' color='info'>
                            {row.username}
                          </Badge>
                        </Link>
                      </TableCell>
                      <TableCell className='text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400'>
                        {row.referralCode}
                      </TableCell>
                      <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                        {row.userCount}
                      </TableCell>
                    </TableRow>
                  ))}
                  {tableData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className='text-center'>
                        <p className='py-2 text-gray-500 dark:text-gray-400'>
                          No User Afffiliate found
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {tableData.length > 0 && (
                <Pagination
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={setPage}
                  className='mb-5 justify-center'
                />
              )}
            </div>
          </div>
        </ComponentCard>
      )}
    </div>
  )
}

export default UserAffiliate
