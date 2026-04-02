import { useEffect, useState } from 'react'

import Input from '@/components/form/input/InputField'
import TextArea from '@/components/form/input/TextArea'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

import { ADMIN_REVIEW_STATUS } from '@/types/kyc'
import { IUserWithProfile } from '@/types/users'

const ReviewModal = ({
  isOpen,
  closeModal,
  handleSave,
  user,
}: {
  isOpen: boolean
  closeModal: () => void
  handleSave: (reviewData: {
    status: ADMIN_REVIEW_STATUS
    comment: string
  }) => void
  user: IUserWithProfile
}) => {
  const [reviewStatus, setReviewStatus] = useState<ADMIN_REVIEW_STATUS>(
    user.profile.adminReviewResult?.status || ADMIN_REVIEW_STATUS.PENDING
  )
  const [comment, setComment] = useState(
    user.profile.adminReviewResult?.notes || ''
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSave({ status: reviewStatus, comment })
  }

  useEffect(() => {
    setReviewStatus(
      user.profile.adminReviewResult?.status || ADMIN_REVIEW_STATUS.PENDING
    )
  }, [user.profile.adminReviewResult?.status])

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className='m-4 max-w-[700px]'>
      <div className='no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900'>
        <div className='px-2 pr-14'>
          <h4 className='mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
            Admin Review
          </h4>
          <p className='mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400'>
            Review user verification status and provide feedback.
          </p>
        </div>
        <form className='flex flex-col' onSubmit={onSubmit}>
          <div className='custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3'>
            <div className='mb-6'>
              <h5 className='mb-5 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90'>
                Review Status
              </h5>
              <div className='relative inline-block w-full'>
                <Select
                  options={Object.values(ADMIN_REVIEW_STATUS).map((status) => ({
                    label: status.charAt(0).toUpperCase() + status.slice(1),
                    value: status,
                  }))}
                  placeholder='Select review status'
                  defaultValue={reviewStatus}
                  onChange={(value) =>
                    setReviewStatus(value as ADMIN_REVIEW_STATUS)
                  }
                />
              </div>
            </div>

            <div className='mb-6'>
              <Label>Review Comment</Label>
              <TextArea
                rows={4}
                value={comment}
                onChange={(value) => setComment(value)}
                placeholder='Enter your review comments here...'
              />
            </div>

            <div>
              <h5 className='mb-5 text-lg font-medium text-gray-800 lg:mb-6 dark:text-white/90'>
                User Information
              </h5>
              <div className='grid grid-cols-1 gap-4'>
                <div>
                  <Label>Email</Label>
                  <Input type='text' value={user.email} disabled />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    type='text'
                    value={user.profile?.phone || 'Not provided'}
                    disabled
                  />
                </div>
                <div>
                  <Label>Verification Level</Label>
                  <Input
                    type='text'
                    value={user.verified?.join(', ') || 'None'}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='mt-6 flex items-center gap-3 px-2 lg:justify-end'>
            <Button size='sm' variant='outline' onClick={closeModal}>
              Cancel
            </Button>
            <Button size='sm' type='submit'>
              Submit Review
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default ReviewModal
