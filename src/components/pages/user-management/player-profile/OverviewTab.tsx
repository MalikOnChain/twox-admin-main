'use client'
import moment from 'moment'

import { IPlayerProfile } from '@/api/user-management'

interface OverviewTabProps {
  user: IPlayerProfile['data']['user']
  loginInfo: IPlayerProfile['data']['loginInfo']
}

export default function OverviewTab({ user, loginInfo }: OverviewTabProps) {
  return (
    <div className='space-y-6'>
      {/* User Information */}
      <div>
        <h3 className='mb-4 text-sm font-medium text-gray-700 dark:text-gray-300'>User Information</h3>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-xs text-gray-500 dark:text-gray-400'>Full Name</p>
            <p className='text-sm font-medium text-gray-800 dark:text-white/90'>{user.fullName || 'N/A'}</p>
          </div>
          <div>
            <p className='text-xs text-gray-500 dark:text-gray-400'>Country</p>
            <p className='text-sm font-medium text-gray-800 dark:text-white/90'>{user.country || 'N/A'}</p>
          </div>
          <div>
            <p className='text-xs text-gray-500 dark:text-gray-400'>Phone</p>
            <p className='text-sm font-medium text-gray-800 dark:text-white/90'>{user.phoneNumber || 'N/A'}</p>
          </div>
          <div>
            <p className='text-xs text-gray-500 dark:text-gray-400'>Member Since</p>
            <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
              {moment(user.createdAt).format('MMM DD, YYYY')}
            </p>
          </div>
        </div>
      </div>

      {/* Login Information */}
      {loginInfo && (
        <div>
          <h3 className='mb-4 text-sm font-medium text-gray-700 dark:text-gray-300'>Login Information</h3>
          
          {/* Last Login Details */}
          {loginInfo.lastLogin && (
            <div className='mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50'>
              <h4 className='mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400'>
                Last Login
              </h4>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>Login Time</p>
                  <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                    {moment(loginInfo.lastLogin.loginTime).format('MMM DD, YYYY HH:mm:ss')}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>IP Address</p>
                  <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                    {loginInfo.lastLogin.ipAddress}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>Location</p>
                  <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                    {loginInfo.lastLogin.location}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>City</p>
                  <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                    {loginInfo.lastLogin.city}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>Region</p>
                  <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                    {loginInfo.lastLogin.region}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>ZIP Code</p>
                  <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                    {loginInfo.lastLogin.zip}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>Timezone</p>
                  <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                    {loginInfo.lastLogin.timezone}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>ISP</p>
                  <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                    {loginInfo.lastLogin.isp}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>Device</p>
                  <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                    {loginInfo.lastLogin.device}
                  </p>
                </div>
                <div className='col-span-2'>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>User Agent</p>
                  <p className='break-all text-sm font-medium text-gray-800 dark:text-white/90'>
                    {loginInfo.lastLogin.userAgent}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* First Login Details */}
          {loginInfo.firstLogin && (
            <div className='mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50'>
              <h4 className='mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400'>
                First Login
              </h4>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>Login Time</p>
                  <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                    {moment(loginInfo.firstLogin.loginTime).format('MMM DD, YYYY HH:mm:ss')}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>IP Address</p>
                  <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                    {loginInfo.firstLogin.ipAddress}
                  </p>
                </div>
                <div className='col-span-2'>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>Location</p>
                  <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                    {loginInfo.firstLogin.location}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Login Statistics */}
          <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50'>
            <h4 className='mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400'>
              Login Statistics
            </h4>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <p className='text-xs text-gray-500 dark:text-gray-400'>Total Logins</p>
                <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                  {loginInfo.totalLogins}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

