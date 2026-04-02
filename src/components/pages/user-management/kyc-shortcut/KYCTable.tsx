'use client'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { IKYCShortcut, updateKYCStatus } from '@/api/user-management'

import Badge from '@/components/ui/badge/Badge'
import Button from '@/components/ui/button/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface KYCTableProps {
  kycList: IKYCShortcut[]
  onUpdate: () => void
}

export default function KYCTable({ kycList, onUpdate }: KYCTableProps) {
  const router = useRouter()

  const handleApprove = async (kycId: string) => {
    try {
      await updateKYCStatus(kycId, 'approved', 'Approved by admin')
      toast.success('KYC approved successfully')
      onUpdate()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  const handleReject = async (kycId: string) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (reason) {
      try {
        await updateKYCStatus(kycId, 'rejected', reason)
        toast.success('KYC rejected')
        onUpdate()
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        }
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success'
      case 'rejected':
        return 'error'
      default:
        return 'warning'
    }
  }

  return (
    <div className='overflow-x-auto'>
      <Table>
        <TableHeader>
          <TableRow className='text-white'>
            <TableCell isHeader>User</TableCell>
            <TableCell isHeader>Status</TableCell>
            <TableCell isHeader>KYC Status</TableCell>
            <TableCell isHeader>SLA</TableCell>
            <TableCell isHeader>Submitted</TableCell>
            <TableCell isHeader>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {kycList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className='text-center text-gray-500 dark:text-gray-400'>
                No KYC records found
              </TableCell>
            </TableRow>
          ) : (
            kycList.map((kyc) => (
              <TableRow key={kyc._id}>
                <TableCell className='text-center'>
                  <div>
                    <p className='font-medium text-gray-800 dark:text-white/90'>
                      {kyc.user?.username || 'N/A'}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      {kyc.user?.email || 'N/A'}
                    </p>
                  </div>
                </TableCell>
                <TableCell className='text-center'>
                  <Badge color={getStatusColor(kyc.adminReview?.status || 'pending')} size='sm'>
                    {kyc.adminReview?.status || 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell className='text-center'>
                  <Badge color={kyc.status === 'completed' ? 'success' : 'warning'} size='sm'>
                    {kyc.status}
                  </Badge>
                </TableCell>
                <TableCell className='text-center'>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        kyc.sla.isOverSLA
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}
                    >
                      {kyc.sla.hoursRemaining.toFixed(1)}h remaining
                    </p>
                    {kyc.sla.isOverSLA && (
                      <p className='text-xs text-red-600 dark:text-red-400'>Over SLA</p>
                    )}
                  </div>
                </TableCell>
                <TableCell className='text-center text-gray-500 dark:text-gray-400'>{moment(kyc.createdAt).format('MMM DD, YYYY HH:mm')}</TableCell>
                <TableCell className='text-center'>
                  <div className='flex gap-2 justify-center p-2'>
                    {kyc.adminReview?.status === 'pending' && (
                      <>
                        <Button
                          size='sm'
                          variant='outline'
                          className='text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
                          onClick={() => handleApprove(kyc._id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          className='text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                          onClick={() => handleReject(kyc._id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => {
                        router.push(`/user-management/player-profile/${kyc.userId}`)
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

