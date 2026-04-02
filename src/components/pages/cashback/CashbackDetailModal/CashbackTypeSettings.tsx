import moment from 'moment'
import { Control, Controller } from 'react-hook-form'

import { CashbackFormValues } from '@/lib/cashback'

import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import MultiSelect from '@/components/form/MultiSelect'

import { GAME_MULTIPLIER_OPTIONS } from '@/types/cashback'

interface CashbackTypeSettingsProps {
  control: Control<CashbackFormValues>
  errors: any
  cashbackType: number
}

const CashbackTypeSettings = ({
  control,
  errors,
  cashbackType,
}: CashbackTypeSettingsProps) => {
  return (
    <>
      {/* Time Boost */}
      {cashbackType === 1 && (
        <div className='grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2'>
          <div>
            <Label>From</Label>
            <Controller
              name='timeBoost.from'
              control={control}
              render={({ field }) => (
                <Input
                  type='date'
                  value={moment(field.value).format('YYYY-MM-DD') || ''}
                  onChange={(e) => {
                    field.onChange(moment(e.target.value).format('YYYY-MM-DD'))
                  }}
                  error={Boolean(errors.timeBoost?.from)}
                  errorMessage={errors.timeBoost?.from?.message}
                />
              )}
            />
          </div>

          <div>
            <Label>To</Label>
            <Controller
              name='timeBoost.to'
              control={control}
              render={({ field }) => (
                <Input
                  type='date'
                  value={moment(field.value).format('YYYY-MM-DD') || ''}
                  onChange={(e) => {
                    field.onChange(moment(e.target.value).format('YYYY-MM-DD'))
                  }}
                  error={Boolean(errors.timeBoost?.to)}
                  errorMessage={errors.timeBoost?.to?.message}
                />
              )}
            />
          </div>
          {errors.timeBoost && (
            <div className='col-span-2'>
              <p className='mt-1 text-sm text-red-500'>
                {errors.timeBoost.message}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Game Multiplier */}
      {cashbackType === 2 && (
        <div>
          <Controller
            name='gameSpecific.multipliers'
            control={control}
            render={({ field }) => (
              <MultiSelect
                label='Game Multiplier'
                options={GAME_MULTIPLIER_OPTIONS.map((option) => ({
                  value: option.value,
                  text: option.label,
                  selected:
                    field.value?.some((m) => m.gameType === option.value) ||
                    false,
                }))}
                defaultSelected={field.value?.map((m) => m.gameType) || []}
                onChange={(selected) => {
                  field.onChange(
                    selected.map((gameType) => ({
                      gameType,
                      defaultPercentage: 0,
                    }))
                  )
                }}
              />
            )}
          />
          {errors.gameSpecific?.multipliers && (
            <p className='mt-1 text-sm text-red-500'>
              {errors.gameSpecific.multipliers.message}
            </p>
          )}
        </div>
      )}
    </>
  )
}

export default CashbackTypeSettings
