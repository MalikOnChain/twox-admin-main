'use client'
import Image from 'next/image'
import React from 'react'
import { toast } from 'sonner'

import { adminReview } from '@/api/users'

import ReviewModal from '@/components/pages/profile/ReviewModal'
import Badge from '@/components/ui/badge/Badge'
import KnownInfo from '@/components/ui/badge/KnownInfo'
import UnknownInfo from '@/components/ui/badge/UnknownInfo'

import { useModal } from '../../hooks/useModal'

import { ADMIN_REVIEW_STATUS, KYC_STATUS } from '@/types/kyc'
import { IUserWithProfile } from '@/types/users'

const ReviewHeader = ({ user }: { user: IUserWithProfile }) => {
  const getBadgeColor = (status: KYC_STATUS) => {
    switch (status) {
      case KYC_STATUS.COMPLETED:
        return 'success'
      case KYC_STATUS.REJECTED:
        return 'error'
      case KYC_STATUS.PENDING:
        return 'warning'
      case KYC_STATUS.ON_HOLD:
        return 'info'
      case KYC_STATUS.INIT:
        return 'primary'
      default:
        return 'primary'
    }
  }

  const getAdminReviewBadgeColor = (status: ADMIN_REVIEW_STATUS) => {
    switch (status) {
      case ADMIN_REVIEW_STATUS.APPROVED:
        return 'success'
      case ADMIN_REVIEW_STATUS.REJECTED:
        return 'error'
      case ADMIN_REVIEW_STATUS.PENDING:
        return 'warning'
      default:
        return 'primary'
    }
  }

  return (
    <div className='text-gray-800 lg:mb-6 dark:text-white/90'>
      <h4 className='text-lg font-semibold'>Reviews</h4>
      <div className='mb-1 flex gap-2'>
        <div className='min-w-[160px] pr-2 text-sm text-gray-500 dark:text-gray-400'>
          Sumsub Review (Level 1)
        </div>
        <Badge
          color={getBadgeColor(user.profile.sumsubStatus)}
          size='sm'
          className='capitalize'
        >
          {user.profile.sumsubStatus || 'N/A'}
        </Badge>
      </div>
      <div className='flex gap-2'>
        <div className='min-w-[160px] pr-2 text-sm text-gray-500 dark:text-gray-400'>
          Admin Review (Level 2)
        </div>
        <Badge
          color={getAdminReviewBadgeColor(
            user.profile.adminReviewResult?.status
          )}
          size='sm'
          className='capitalize'
        >
          {user.profile.adminReviewResult?.status || 'N/A'}
        </Badge>
      </div>
    </div>
  )
}

export default function UserReviewCard({
  user,
  fetchUser,
}: {
  user: IUserWithProfile
  fetchUser: () => void
}) {
  const { isOpen, openModal, closeModal } = useModal()
  const handleSave = async ({
    status,
    comment,
  }: {
    status: string
    comment: string
  }) => {
    closeModal()
    const response = await adminReview({
      id: user._id,
      status,
      comment,
    })
    if (response.success) {
      toast.success('Admin review updated successfully')
      await fetchUser()
    } else {
      toast.error('Failed to update admin review')
    }
  }

  return (
    <div className='rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800'>
      <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
        <div>
          <ReviewHeader user={user} />

          <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32'>
            {user.profile?.identityDocument && (
              <>
                <div>
                  <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                    Front Image
                  </p>
                  <div className='aspect-[16/9] w-full rounded-lg bg-gray-200'>
                    {user.profile?.identityDocument?.frontImagePath ? (
                      <Image
                        src={user.profile?.identityDocument?.frontImagePath}
                        alt='Front Image'
                        width={100}
                        height={100}
                        className='h-full w-full object-cover'
                      />
                    ) : (
                      <UnknownInfo text='Unknown Front Image' />
                    )}
                  </div>
                </div>

                <div>
                  <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                    Back Image
                  </p>
                  <div className='aspect-[16/9] w-full rounded-lg bg-gray-200'>
                    {user.profile?.identityDocument?.backImagePath ? (
                      <Image
                        src={user.profile?.identityDocument?.backImagePath}
                        alt='Back Image'
                        width={100}
                        height={100}
                        className='h-full w-full object-cover'
                      />
                    ) : (
                      <UnknownInfo text='Unknown Back Image' />
                    )}
                  </div>
                </div>
              </>
            )}

            <div>
              <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                Email Verified
              </p>
              <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                {user.isEmailVerified ? (
                  <KnownInfo text='Verified' />
                ) : (
                  <UnknownInfo text='Unverified' />
                )}
              </p>
            </div>

            <div>
              <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                Phone Verified
              </p>
              <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                {user.profile?.phone ? (
                  <KnownInfo text='Verified' />
                ) : (
                  <UnknownInfo text='Unverified' />
                )}
              </p>
            </div>

            {user.verified && user.verified.length > 0 && (
              <div>
                <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                  Verification
                </p>
                <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                  {user.verified.map((verification, index) => {
                    return (
                      <KnownInfo
                        text={verification}
                        size='sm'
                        key={index + '_verification'}
                      />
                    )
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {user.profile.sumsubStatus === KYC_STATUS.COMPLETED && (
          <button
            onClick={openModal}
            className='shadow-theme-xs flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 lg:inline-flex lg:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200'
          >
            <svg
              className='fill-current'
              width='18'
              height='18'
              viewBox='0 0 18 18'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z'
                fill=''
              />
            </svg>
            Admin Review
          </button>
        )}
      </div>
      <ReviewModal
        user={user}
        isOpen={isOpen}
        closeModal={closeModal}
        handleSave={handleSave}
      />
    </div>
  )
}
