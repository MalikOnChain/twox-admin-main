'use client'
import React, { useEffect } from 'react'

import { useModal } from '@/hooks/useModal'

import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

export default function ConfirmModal({
  open,
  title,
  description,
  handleConfirm,
  handleClose,
}: {
  open: boolean
  title: string
  description: string
  handleConfirm: () => void
  handleClose: () => void
}) {
  const { isOpen, openModal, closeModal } = useModal()
  useEffect(() => {
    if (open) {
      openModal()
    } else {
      closeModal()
    }
  }, [open, openModal, closeModal])
  useEffect(() => {
    if (!isOpen) {
      handleClose()
    }
  }, [isOpen, handleClose])
  const handleSave = () => {
    closeModal()
    handleConfirm()
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      showCloseButton={false}
      className='max-w-[507px] p-6 lg:p-10'
    >
      <div className='text-center'>
        <h4 className='sm:text-title-sm mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
          {title}
        </h4>
        <p className='text-sm leading-6 text-gray-500 dark:text-gray-400'>
          {description}
        </p>

        <div className='mt-8 flex w-full items-center justify-center gap-3'>
          <Button size='sm' variant='outline' onClick={closeModal}>
            Cancel
          </Button>
          <Button size='sm' onClick={handleSave}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  )
}
