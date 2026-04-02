'use client'

import { IPlayerProfile } from '@/api/user-management'

import Badge from '@/components/ui/badge/Badge'

interface RiskTabProps {
  risk: IPlayerProfile['data']['risk']
}

export default function RiskTab({ risk }: RiskTabProps) {
  return (
    <div className='space-y-4'>
      <div>
        <h3 className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>Risk Score: {risk.score}</h3>
        <Badge color={risk.level === 'high' ? 'error' : risk.level === 'medium' ? 'warning' : 'success'}>
          {risk.level.toUpperCase()}
        </Badge>
        <div className='mt-4 space-y-2'>
          <p className='text-xs text-gray-500 dark:text-gray-400'>Factors:</p>
          <ul className='list-disc pl-5 text-sm text-gray-700 dark:text-gray-300'>
            <li>Banned: {risk.factors.isBanned ? 'Yes' : 'No'}</li>
            <li>Locked: {risk.factors.isLocked ? 'Yes' : 'No'}</li>
            <li>KYC Status: {risk.factors.kycStatus}</li>
            <li>Recent Activity: {risk.factors.recentActivity} transactions</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

