'use client'

import { Control, Controller } from 'react-hook-form'
import { Card } from '@/components/ui/card'
import Label from '@/components/form/Label'
import Input from '@/components/form/input/InputField'

interface DailyCapsSectionProps {
  control: Control<any>
}

export default function DailyCapsSection({ control }: DailyCapsSectionProps) {
  return (
    <Card>
      <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>Daily Caps</h3>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div>
          <Label>Daily Deposit Cap (per user)</Label>
          <Controller
            name='paymentSettings.dailyCaps.depositCap'
            control={control}
            render={({ field }) => (
              <Input
                type='number'
                value={field.value || 0}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </div>
        <div>
          <Label>Daily Withdrawal Cap (per user)</Label>
          <Controller
            name='paymentSettings.dailyCaps.withdrawCap'
            control={control}
            render={({ field }) => (
              <Input
                type='number'
                value={field.value || 0}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </div>
      </div>
    </Card>
  )
}

