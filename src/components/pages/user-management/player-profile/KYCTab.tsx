'use client'
import moment from 'moment'

import { IPlayerProfile } from '@/api/user-management'

import Badge from '@/components/ui/badge/Badge'

interface KYCTabProps {
  kyc: IPlayerProfile['data']['kyc']
}

export default function KYCTab({ kyc }: KYCTabProps) {
  return (
    <div className='space-y-4'>
      {kyc.length > 0 ? (
        kyc.map((kycItem: any) => (
          <div key={kycItem._id} className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-medium text-gray-800 dark:text-white/90'>Status: {kycItem.status}</p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Submitted: {moment(kycItem.createdAt).format('MMM DD, YYYY')}
                </p>
              </div>
              <Badge
                color={
                  kycItem.adminReview?.status === 'approved'
                    ? 'success'
                    : kycItem.adminReview?.status === 'rejected'
                      ? 'error'
                      : 'warning'
                }
              >
                {kycItem.adminReview?.status || 'Pending'}
              </Badge>
            </div>
          </div>
        ))
      ) : (
        <p className='text-gray-500 dark:text-gray-400'>No KYC records found</p>
      )}
    </div>
  )
}

