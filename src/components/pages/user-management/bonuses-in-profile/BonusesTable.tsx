'use client'
import moment from 'moment'
import { useMemo } from 'react'

import { IBonusInProfile } from '@/api/user-management'
import { formatNumber } from '@/lib/utils'

import Badge from '@/components/ui/badge/Badge'
import Button from '@/components/ui/button/Button'
import UserAvatar from '@/components/ui/avatar/UserAvatar'

interface BonusesTableProps {
  bonuses: IBonusInProfile[]
  primaryUser?: {
    _id?: string
    username?: string
    email?: string
    avatar?: string
  }
  onForfeit?: (bonusId: string) => void
  onExtend?: (bonusId: string) => void
  onConvert?: (bonusId: string) => void
}

type BonusUserSummary = {
  _id?: string
  username?: string
  email?: string
  avatar?: string
}

export default function BonusesTable({
  bonuses,
  primaryUser,
  onForfeit,
  onExtend,
  onConvert,
}: BonusesTableProps) {
  const groupedBonuses = useMemo(() => {
    if (!bonuses.length) {
      return primaryUser
        ? [{ id: primaryUser._id ?? 'user', user: primaryUser, bonuses: [] as IBonusInProfile[] }]
        : []
    }

    const map = new Map<
      string,
      {
        user: BonusUserSummary | undefined
        bonuses: IBonusInProfile[]
      }
    >()

    bonuses.forEach((bonus) => {
      const key = bonus.user?._id || bonus.userId || primaryUser?._id || 'unknown'
      const existing = map.get(key)
      const userMeta = bonus.user || existing?.user || primaryUser || { _id: key }

      if (!existing) {
        map.set(key, { user: userMeta, bonuses: [bonus] })
      } else {
        existing.bonuses.push(bonus)
      }
    })

    return Array.from(map.entries()).map(([id, value]) => ({ id, ...value }))
  }, [bonuses, primaryUser])

  if (!groupedBonuses.length) {
    return (
      <div className='rounded-xl border border-dashed border-gray-200 p-6 text-center dark:border-white/[0.08]'>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          No bonuses found for the current selection.
        </p>
      </div>
    )
  }

  const formatCurrency = (value?: number) => `$${formatNumber(value || 0)}`

  return (
    <div className='space-y-6'>
      {groupedBonuses.map((group) => (
        <div
          key={group.id}
          className='rounded-2xl border border-gray-100 bg-white p-5 md:p-6 dark:border-white/[0.05] dark:bg-white/[0.03]'
        >
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <UserAvatar
                size='medium'
                src={group.user?.avatar || '/images/default-avatar.png'}
                alt={group.user?.username || group.user?._id || 'User'}
              />
              <div>
                <p className='text-base font-semibold text-gray-800 dark:text-white/90'>
                  {group.user?.username || 'Unknown User'}
                </p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {group.user?.email || group.user?._id || '—'}
                </p>
              </div>
            </div>
            <div className='text-sm text-gray-500 dark:text-gray-400'>
              {group.bonuses.length} bonus{group.bonuses.length === 1 ? '' : 'es'} tracked
            </div>
          </div>

          {group.bonuses.length === 0 ? (
            <div className='mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-500 dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-gray-400'>
              No bonuses assigned yet.
            </div>
          ) : (
            <div className='mt-5 space-y-4'>
              {group.bonuses.map((bonus) => (
                <div
                  key={bonus._id}
                  className='rounded-2xl border border-gray-100 p-4 md:p-5 dark:border-white/[0.05]'
                >
                  <div className='flex flex-wrap items-start justify-between gap-4'>
                    <div>
                      <p className='text-lg font-semibold text-gray-800 dark:text-white/90'>
                        {bonus.bonusId?.name || 'Bonus'}
                      </p>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        Bonus ID: {bonus._id}
                      </p>
                    </div>
                    <Badge
                      color={
                        bonus.status === 'active'
                          ? 'success'
                          : bonus.status === 'completed'
                            ? 'info'
                            : 'primary'
                      }
                      size='sm'
                    >
                      {bonus.status}
                    </Badge>
                  </div>

                  <div className='mt-4 grid gap-4 md:grid-cols-4'>
                    <div>
                      <p className='text-xs uppercase text-gray-500 dark:text-gray-400'>Balance</p>
                      <p className='text-base font-semibold text-gray-800 dark:text-white/90'>
                        {formatCurrency(bonus.bonusBalance)}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs uppercase text-gray-500 dark:text-gray-400'>
                        Initial Amount
                      </p>
                      <p className='text-base font-semibold text-gray-800 dark:text-white/90'>
                        {formatCurrency(bonus.initialAmount)}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs uppercase text-gray-500 dark:text-gray-400'>
                        Remaining Wager
                      </p>
                      <p className='text-base font-semibold text-gray-800 dark:text-white/90'>
                        {formatCurrency(bonus.remainingWager)}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs uppercase text-gray-500 dark:text-gray-400'>
                        Expires
                      </p>
                      <p className='text-base font-semibold text-gray-800 dark:text-white/90'>
                        {bonus.expiresAt ? moment(bonus.expiresAt).format('MMM DD, YYYY') : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className='mt-4'>
                    <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400'>
                      <span>Wagering Progress</span>
                      <span>{bonus.progress.toFixed(1)}%</span>
                    </div>
                    <div className='mt-2 h-2 rounded-full bg-gray-100 dark:bg-gray-800'>
                      <div
                        className='h-2 rounded-full bg-indigo-500 transition-all dark:bg-indigo-400'
                        style={{ width: `${Math.min(100, bonus.progress)}%` }}
                      />
                    </div>
                  </div>

                  <div className='mt-4 flex flex-wrap gap-2'>
                    {bonus.status === 'active' ? (
                      <>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => onForfeit?.(bonus._id)}
                        >
                          Forfeit
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => onExtend?.(bonus._id)}
                        >
                          Extend
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => onConvert?.(bonus._id)}
                        >
                          Convert
                        </Button>
                      </>
                    ) : (
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        No actions available for {bonus.status} bonuses.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

