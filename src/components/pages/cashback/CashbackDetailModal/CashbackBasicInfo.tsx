import { Control, Controller } from 'react-hook-form'

import { CashbackFormValues } from '@/lib/cashback'

import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'

import { CLAIM_MODE_OPTIONS, RAKEBACK_TYPE_OPTIONS } from '@/types/cashback'

interface CashbackBasicInfoProps {
  control: Control<CashbackFormValues>
  errors: any
  claimFrequencyMode: string
}

const CashbackBasicInfo = ({
  control,
  errors,
  claimFrequencyMode,
}: CashbackBasicInfoProps) => {
  return (
    <>
      <div className='grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2'>
        {/* Name */}
        <div>
          <Label>Name</Label>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <Input
                type='text'
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.value)
                }}
              />
            )}
          />
          {errors.name && (
            <p className='mt-1 text-sm text-red-500'>{errors.name.message}</p>
          )}
        </div>

        {/* Default Rate */}
        <div>
          <Label>Default Rate</Label>
          <Controller
            name='default.defaultPercentage'
            control={control}
            render={({ field }) => (
              <Input
                type='number'
                min='0'
                value={field.value}
                onChange={(e) => {
                  field.onChange(Number(e.target.value))
                }}
              />
            )}
          />
          {errors.default?.defaultPercentage && (
            <p className='mt-1 text-sm text-red-500'>
              {errors.default.defaultPercentage.message}
            </p>
          )}
        </div>
      </div>

      {/* Claim Frequency */}
      <div className='pb-4'>
        <Label>Claim Frequency</Label>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
          <div className='col-span-1'>
            <Label>Mode</Label>
            <Controller
              name='claimFrequency.mode'
              control={control}
              render={({ field }) => (
                <Select
                  options={CLAIM_MODE_OPTIONS}
                  defaultValue={
                    CLAIM_MODE_OPTIONS.find(
                      (option) => option.value === field.value
                    )?.value
                  }
                  onChange={(value) => {
                    field.onChange(value)
                  }}
                />
              )}
            />
            {errors.claimFrequency?.mode && (
              <p className='mt-1 text-sm text-red-500'>
                {errors.claimFrequency.mode.message}
              </p>
            )}
          </div>

          {/* Cooldown */}
          <div className='col-span-1'>
            <Label>Cooldown</Label>
            <Controller
              name='claimFrequency.cooldown'
              control={control}
              render={({ field }) => (
                <Input
                  type='number'
                  min='0'
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value))
                  }}
                  disabled={
                    claimFrequencyMode === CLAIM_MODE_OPTIONS[0].value ||
                    !claimFrequencyMode
                  }
                  error={Boolean(errors.claimFrequency?.cooldown)}
                  errorMessage={errors.claimFrequency?.cooldown?.message}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Cashback Type */}
      <div className='grid grid-cols-1 gap-6 pb-4 sm:grid-cols-2'>
        <div>
          <Label>Cashback Type</Label>
          <Controller
            name='type'
            control={control}
            render={({ field }) => (
              <Select
                options={RAKEBACK_TYPE_OPTIONS.map((option) => ({
                  value: option.value.toString(),
                  label: option.label,
                }))}
                defaultValue={RAKEBACK_TYPE_OPTIONS.find(
                  (option) => option.value === field.value
                )?.value.toString()}
                onChange={(value) => {
                  field.onChange(Number(value))
                }}
              />
            )}
          />
          {errors.type && (
            <p className='mt-1 text-sm text-red-500'>
              {typeof errors.type === 'object'
                ? errors.type.message
                : 'Please select a cashback type'}
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default CashbackBasicInfo
