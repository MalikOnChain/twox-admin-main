import Link from 'next/link'

import Loading from '@/components/common/Loading'
import Pagination from '@/components/tables/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ChevronLeftIcon } from '@/icons'

import { IAffiliateMetrics, IReferredUser } from '@/types/affiliate'

type ReferredUserProps = {
  metrics: IAffiliateMetrics
  tableData: IReferredUser[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading: boolean
  backUrl: string
}

const ReferredUsers = ({
  metrics,
  tableData,
  isLoading,
  totalPages,
  page,
  setPage,
  backUrl,
}: ReferredUserProps) => {
  return isLoading ? (
    <Loading />
  ) : (
    <>
      <Link
        href={backUrl}
        className='inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
      >
        <ChevronLeftIcon />
        Back
      </Link>
      <div className='flex flex-wrap justify-center gap-6'>
        {metrics &&
          metrics.metrics.map((metrics, i) => {
            return (
              <div
                key={i}
                className='flex flex-col items-center justify-center rounded-lg border border-gray-600 bg-white px-6 py-4 shadow-md dark:bg-gray-800'
              >
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  {metrics.key}
                </span>
                <span className='font-medium text-gray-800 dark:text-white'>
                  {metrics.value}
                </span>
              </div>
            )
          })}
      </div>
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
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                >
                  Total Deposit
                </TableCell>
                <TableCell
                  isHeader
                  className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                >
                  Total Withdraw
                </TableCell>
                <TableCell
                  isHeader
                  className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                >
                  Total Wager
                </TableCell>
                <TableCell
                  isHeader
                  className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                >
                  Total Win
                </TableCell>
                <TableCell
                  isHeader
                  className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                >
                  Total Profit
                </TableCell>
                <TableCell
                  isHeader
                  className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                >
                  Self Profit
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
              {tableData &&
                tableData.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell className='text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400'>
                      {row.username}
                    </TableCell>
                    <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                      {row.metrics.totalDeposit}
                    </TableCell>
                    <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                      {row.metrics.totalWithdraw}
                    </TableCell>
                    <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                      {row.metrics.totalWager}
                    </TableCell>
                    <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                      {row.metrics.totalWin}
                    </TableCell>
                    <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                      {row.metrics.totalProfit}
                    </TableCell>
                    <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                      {row.metrics.selfProfit}
                    </TableCell>
                  </TableRow>
                ))}
              {tableData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className='text-center'>
                    <p className='py-2 text-gray-500 dark:text-gray-400'>
                      No Refferred User found
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
    </>
  )
}
export default ReferredUsers
