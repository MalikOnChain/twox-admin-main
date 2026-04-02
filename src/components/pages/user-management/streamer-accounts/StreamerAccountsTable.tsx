'use client'
import moment from 'moment'
import { useState } from 'react'

import { IStreamerAccount } from '@/api/user-management'
import { formatNumber } from '@/lib/utils'

import UserAvatar from '@/components/ui/avatar/UserAvatar'
import Badge from '@/components/ui/badge/Badge'
import Button from '@/components/ui/button/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import AddFundsModal from './AddFundsModal'
import AssignCampaignModal from './AssignCampaignModal'
import SetOverrideModal from './SetOverrideModal'
import UpdateStatusModal from './UpdateStatusModal'

interface StreamerAccountsTableProps {
  streamers: IStreamerAccount[]
  onRefresh?: () => void
}

type StreamerAction = 'funds' | 'override' | 'campaign' | 'status' | null

export default function StreamerAccountsTable({ streamers, onRefresh }: StreamerAccountsTableProps) {
  const [activeModal, setActiveModal] = useState<{ type: StreamerAction; streamer: IStreamerAccount | null }>({
    type: null,
    streamer: null,
  })

  const openModal = (type: StreamerAction, streamer: IStreamerAccount) => {
    setActiveModal({ type, streamer })
  }

  const closeModal = () => {
    setActiveModal({ type: null, streamer: null })
  }

  const handleSuccess = () => {
    onRefresh?.()
    closeModal()
  }

  return (
    <>
      <div className='overflow-x-auto'>
      <Table>
        <TableHeader>
          <TableRow className='text-white'>
            <TableCell isHeader>Account</TableCell>
            <TableCell isHeader>Channel</TableCell>
            <TableCell isHeader>Performance</TableCell>
            <TableCell isHeader>Created</TableCell>
            <TableCell isHeader>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {streamers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className='text-center text-gray-500 dark:text-gray-400'>
                No streamer accounts found
              </TableCell>
            </TableRow>
          ) : (
            streamers.map((streamer) => (
              <TableRow key={streamer._id}>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <UserAvatar
                      src={streamer.avatar || '/images/default-avatar.png'}
                      alt={streamer.username}
                      size='small'
                    />
                    <div>
                      <p className='font-medium text-gray-800 dark:text-white/90'>
                        {streamer.username}
                      </p>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>{streamer.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className='text-center'>
                  <Badge color='info' size='sm'>
                    {streamer.username}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className='space-y-1 items-left justify-center items-center py-2'>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      Clicks: {streamer.performance.clicks}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      Signups: {streamer.performance.signups}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      FTDs: {streamer.performance.ftds}
                    </p>
                    <p className='text-xs font-semibold text-green-600 dark:text-green-400'>
                      Revenue: ${formatNumber(streamer.performance.revenue)}
                    </p>
                  </div>
                </TableCell>
                <TableCell className='text-center text-gray-500 dark:text-gray-400'>{moment(streamer.createdAt).format('MMM DD, YYYY')}</TableCell>
                <TableCell className='text-center'>
                  <div className='flex gap-2 justify-center items-center'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => openModal('funds', streamer)}
                    >
                      Add Funds
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => openModal('override', streamer)}
                    >
                      Set Override
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => openModal('campaign', streamer)}
                    >
                      Assign Campaign
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => openModal('status', streamer)}
                    >
                      {streamer.streamerSettings?.status === 'paused' ? 'Activate' : 'Pause'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      </div>

      <AddFundsModal
        streamer={activeModal.streamer}
        isOpen={activeModal.type === 'funds'}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
      <SetOverrideModal
        streamer={activeModal.streamer}
        isOpen={activeModal.type === 'override'}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
      <AssignCampaignModal
        streamer={activeModal.streamer}
        isOpen={activeModal.type === 'campaign'}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
      <UpdateStatusModal
        streamer={activeModal.streamer}
        isOpen={activeModal.type === 'status'}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
    </>
  )
}

