'use client'

import { Card } from '@/components/ui/card'

interface ThresholdAlertsProps {
  alerts: Array<{
    method: string
    message: string
  }>
}

export default function ThresholdAlerts({ alerts }: ThresholdAlertsProps) {
  return (
    <div className='mt-6'>
      <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>Threshold Alerts</h3>
      <Card>
        {alerts.length > 0 ? (
          <div className='space-y-2'>
            {alerts.map((alert, index) => (
              <div
                key={index}
                className='rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20'
              >
                <p className='text-sm font-semibold text-red-800 dark:text-red-200'>
                  {alert.method} - Threshold Exceeded
                </p>
                <p className='text-xs text-red-600 dark:text-red-300'>{alert.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            No threshold alerts. All fees are within acceptable limits.
          </p>
        )}
      </Card>
    </div>
  )
}

