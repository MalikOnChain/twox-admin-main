'use client'
import { useState } from 'react'

import { IVIPTier } from '@/api/user-management'

import Badge from '@/components/ui/badge/Badge'
import Button from '@/components/ui/button/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import GrantCompModal from './GrantCompModal'
import ScheduleReviewModal from './ScheduleReviewModal'

interface VIPTiersTableProps {
  tiers: IVIPTier[]
  onRefresh?: () => void
}

export default function VIPTiersTable({ tiers, onRefresh }: VIPTiersTableProps) {
  const [grantCompModal, setGrantCompModal] = useState<{ tierId: string; tierName: string } | null>(null)
  const [scheduleReviewModal, setScheduleReviewModal] = useState<{ tierId: string; tierName: string } | null>(null)

  return (
    <>
    <div className='mb-6 overflow-x-auto'>
      <Table>
        <TableHeader>
          <TableRow className='text-white'>
            <TableCell isHeader>Tier Name</TableCell>
            <TableCell isHeader>Icon</TableCell>
            <TableCell isHeader>User Count</TableCell>
            <TableCell isHeader>Levels</TableCell>
            <TableCell isHeader>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tiers.map((tier) => (
            <TableRow key={tier._id}>
              <TableCell className='text-center'>
                <div className='flex items-center gap-2'>
                  <Badge color='info'>{tier.name}</Badge>
                </div>
              </TableCell>
              <TableCell>
                <img src={tier.icon} alt={tier.name} className='h-8 w-8' />
              </TableCell>
              <TableCell className='font-semibold text-gray-800 dark:text-white/90 text-center'>
                {tier.userCount}
              </TableCell>
              <TableCell className='text-center'>
                <div className='flex flex-wrap gap-1 justify-center'>
                  {tier.levels.slice(0, 3).map((level, idx) => (
                    <Badge key={idx} size='sm' variant='light'>
                      {level.name}
                    </Badge>
                  ))}
                  {tier.levels.length > 3 && (
                    <Badge size='sm' variant='light'>
                      +{tier.levels.length - 3}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className='text-center'>
                <div className='flex gap-2 justify-center p-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => setGrantCompModal({ tierId: tier._id, tierName: tier.name })}
                  >
                    Grant Comp
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => setScheduleReviewModal({ tierId: tier._id, tierName: tier.name })}
                  >
                    Schedule Review
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

    {grantCompModal && (
      <GrantCompModal
        tierId={grantCompModal.tierId}
        tierName={grantCompModal.tierName}
        isOpen={!!grantCompModal}
        onClose={() => setGrantCompModal(null)}
        onSuccess={onRefresh}
      />
    )}

    {scheduleReviewModal && (
      <ScheduleReviewModal
        tierId={scheduleReviewModal.tierId}
        tierName={scheduleReviewModal.tierName}
        isOpen={!!scheduleReviewModal}
        onClose={() => setScheduleReviewModal(null)}
        onSuccess={onRefresh}
      />
    )}
    </>
  )
}

