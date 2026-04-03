'use client'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getPlayerProfile, IPlayerProfile } from '@/api/user-management'

import { formatNumber } from '@/lib/utils'

import Loading from '@/components/common/Loading'
import UserAvatar from '@/components/ui/avatar/UserAvatar'
import Badge from '@/components/ui/badge/Badge'
import Button from '@/components/ui/button/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ChevronLeftIcon } from '@/icons'

import ResetMemberPasswordModal from './ResetMemberPasswordModal'
import BetsTab from './player-profile/BetsTab'
import BonusesTab from './player-profile/BonusesTab'
import EngagementTab from './player-profile/EngagementTab'
import KYCTab from './player-profile/KYCTab'
import NotesTab from './player-profile/NotesTab'
import OverviewTab from './player-profile/OverviewTab'
import ReferralsTab from './player-profile/ReferralsTab'
import RiskTab from './player-profile/RiskTab'
import SessionsTab from './player-profile/SessionsTab'
import TournamentsTab from './player-profile/TournamentsTab'
import TransactionsTab from './player-profile/TransactionsTab'

interface PlayerProfilePageProps {
  userId: string
}

export default function PlayerProfilePage({ userId }: PlayerProfilePageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<IPlayerProfile['data'] | null>(null)
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)

  const fetchProfile = useCallback(async () => {
    if (!userId || userId === 'undefined' || userId === 'null') {
      toast.error('User ID is required')
      router.push('/user-management/player-list')
      return
    }
    try {
      setLoading(true)
      const response = await getPlayerProfile(userId)
      setProfile(response.data)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching player profile')
      }
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  if (loading) {
    return <Loading />
  }

  if (!profile) {
    return (
      <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
        <p className='text-gray-500 dark:text-gray-400'>Player not found</p>
      </div>
    )
  }

  const { user, vip, kyc, transactions, bets, bonuses, sessions, referrals, risk, balances, vipProgress, loginInfo } = profile

  return (
    <div className='space-y-6'>
      {/* Back Button */}
      <button
        onClick={() => router.push('/user-management/player-list')}
        className='inline-flex items-center text-sm text-gray-600 transition-colors duration-200 hover:text-blue-600 dark:text-gray-400'
      >
        <ChevronLeftIcon />
        Back to Player List
      </button>

      {/* Header */}
      <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
        <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
          <div className='flex items-start gap-4'>
            <UserAvatar
              src={user.avatar || '/images/default-avatar.png'}
              alt={user.username}
              size='large'
            />
            <div>
              <div className='flex items-center gap-2'>
                <h1 className='text-2xl font-bold text-gray-800 dark:text-white/90'>
                  {user.username}
                </h1>
                {user.countryCode && (
                  <img
                    src={`https://flagpedia.net/data/flags/w40/${user.countryCode.toLowerCase()}.png`}
                    alt={user.country || 'Country flag'}
                    className='h-6 w-8 rounded object-cover'
                    onError={(e) => {
                      // Hide flag if image fails to load
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
              </div>
              <p className='text-gray-500 dark:text-gray-400'>{user.email}</p>
              <div className='mt-2 flex flex-wrap gap-2'>
                <Badge color={vip ? 'info' : 'primary'}>{vip?.currentTier || 'No VIP'}</Badge>
                <Badge color={risk.level === 'high' ? 'error' : risk.level === 'medium' ? 'warning' : 'success'}>
                  Risk: {risk.level}
                </Badge>
                {user.isBanned && <Badge color='error'>Banned</Badge>}
                {user.lock_bet && <Badge color='warning'>Bet Locked</Badge>}
                {user.lock_transaction && <Badge color='warning'>Transaction Locked</Badge>}
                {kyc[0]?.status === 'completed' && kyc[0]?.adminReview?.status === 'approved' && (
                  <Badge color='success'>KYC Verified</Badge>
                )}
              </div>
            </div>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => toast.info('Credit/Debit functionality to be implemented')}
            >
              Credit/Debit
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => toast.info('Freeze functionality to be implemented')}
            >
              {user.lock_bet || user.lock_transaction ? 'Unfreeze' : 'Freeze'}
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => toast.info('Ban functionality to be implemented')}
            >
              {user.isBanned ? 'Unban' : 'Ban'}
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => setResetPasswordOpen(true)}
            >
              Reset password
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => toast.info('Message functionality to be implemented')}
            >
              Message
            </Button>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-12 gap-4 md:gap-6'>
        {/* Main Content */}
        <div className='col-span-12 lg:col-span-8'>
          <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
            <Tabs defaultValue='overview'>
              <TabsList className='custom-scrollbar [&::-webkit-scrollbar]:block [scrollbar-width:thin]'>
                <TabsTrigger value='overview'>Overview</TabsTrigger>
                <TabsTrigger value='transactions'>Transactions</TabsTrigger>
                <TabsTrigger value='bets'>Bets</TabsTrigger>
                <TabsTrigger value='bonuses'>Bonuses</TabsTrigger>
                <TabsTrigger value='risk'>Risk</TabsTrigger>
                <TabsTrigger value='kyc'>KYC</TabsTrigger>
                <TabsTrigger value='sessions'>Sessions</TabsTrigger>
                <TabsTrigger value='notes'>Notes/Audit</TabsTrigger>
                <TabsTrigger value='referrals'>Referrals & Earnings</TabsTrigger>
                <TabsTrigger value='tournaments'>Tournaments/Raffles</TabsTrigger>
                <TabsTrigger value='engagement'>Engagement</TabsTrigger>
              </TabsList>

              <TabsContent value='overview'>
                <OverviewTab user={user} loginInfo={loginInfo} />
              </TabsContent>

              <TabsContent value='transactions'>
                <TransactionsTab transactions={transactions} />
              </TabsContent>

              <TabsContent value='bets'>
                <BetsTab bets={bets} />
              </TabsContent>

              <TabsContent value='bonuses'>
                <BonusesTab bonuses={bonuses} />
              </TabsContent>

              <TabsContent value='risk'>
                <RiskTab risk={risk} />
              </TabsContent>

              <TabsContent value='kyc'>
                <KYCTab kyc={kyc} />
              </TabsContent>

              <TabsContent value='sessions'>
                <SessionsTab sessions={sessions} />
              </TabsContent>

              <TabsContent value='notes'>
                <NotesTab />
              </TabsContent>

              <TabsContent value='referrals'>
                <ReferralsTab referrals={referrals} />
              </TabsContent>

              <TabsContent value='tournaments'>
                <TournamentsTab />
              </TabsContent>

              <TabsContent value='engagement'>
                <EngagementTab userId={userId} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Panel */}
        <div className='col-span-12 lg:col-span-4'>
          <div className='space-y-4'>
            {/* Balances */}
            <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
              <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>Balances</h3>
              <div className='space-y-3'>
                <div>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>Cash</p>
                  <p className='text-xl font-bold text-gray-800 dark:text-white/90'>
                    ${formatNumber(balances.cash)}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>Bonus</p>
                  <p className='text-xl font-bold text-green-600 dark:text-green-400'>
                    ${formatNumber(balances.bonus)}
                  </p>
                </div>
                <div className='border-t border-gray-200 pt-3 dark:border-gray-700'>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>Total</p>
                  <p className='text-xl font-bold text-gray-800 dark:text-white/90'>
                    ${formatNumber(balances.total)}
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Score */}
            <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
              <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>Risk Score</h3>
              <div className='text-center'>
                <div className='mb-2 text-4xl font-bold text-gray-800 dark:text-white/90'>{risk.score}</div>
                <Badge
                  color={risk.level === 'high' ? 'error' : risk.level === 'medium' ? 'warning' : 'success'}
                  size='md'
                >
                  {risk.level.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* VIP Progress */}
            {vipProgress && (
              <div className='rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
                <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>VIP Progress</h3>
                <div className='space-y-3'>
                  <div>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>Current Tier</p>
                    <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                      {vipProgress.currentTier}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>Current Level</p>
                    <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                      {vipProgress.currentLevel}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>Total XP</p>
                    <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                      {formatNumber(vipProgress.totalXP)}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>Total Wagered</p>
                    <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                      ${formatNumber(vipProgress.totalWagered)}
                    </p>
                  </div>
                  {vipProgress.nextTier && (
                    <div>
                      <p className='mb-1 text-xs text-gray-500 dark:text-gray-400'>
                        Progress to {vipProgress.nextTier}
                      </p>
                      <div className='h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700'>
                        <div
                          className='h-full bg-blue-600 transition-all'
                          style={{ width: `${Math.min(100, vipProgress.progressToNextTier)}%` }}
                        />
                      </div>
                      <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                        {vipProgress.progressToNextTier.toFixed(1)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ResetMemberPasswordModal
        isOpen={resetPasswordOpen}
        onClose={() => setResetPasswordOpen(false)}
        userId={userId}
        username={user.username}
        email={user.email}
      />
    </div>
  )
}
