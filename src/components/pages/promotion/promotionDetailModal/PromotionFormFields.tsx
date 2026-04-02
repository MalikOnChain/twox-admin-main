import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'

import { getBonuses } from '@/api/bonus'

import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import RichTextEditor from '@/components/form/RichTextEditor'
import Select from '@/components/form/Select'
import Switch from '@/components/form/switch/Switch'
import Button from '@/components/ui/button/Button'

import { PromotionFormFieldsProps } from './types'

import { Bonus } from '@/types/bonus'

const PromotionFormFields = ({ control, errors }: PromotionFormFieldsProps) => {
  const [bonuses, setBonuses] = useState<Bonus[]>([])
  const [isLoadingBonuses, setIsLoadingBonuses] = useState(false)
  const colors = ['purple', 'green', 'orange']

  useEffect(() => {
    const fetchBonuses = async () => {
      try {
        setIsLoadingBonuses(true)
        const response = await getBonuses({
          page: 1,
          limit: 100,
          filter: '',
        })
        setBonuses(response.rows || [])
      } catch (error) {
        console.error('Error fetching bonuses:', error)
        setBonuses([])
      } finally {
        setIsLoadingBonuses(false)
      }
    }

    fetchBonuses()
  }, [])

  return (
    <div className='space-y-6'>
      <div className='mt-4'>
        <div className='mb-3 flex items-center justify-between'>
          <Label>Promotion Name</Label>
          <Controller
            name='isPublic'
            control={control}
            render={({ field }) => (
              <Switch
                defaultChecked={field.value}
                onChange={(checked) => {
                  field.onChange(checked)
                }}
                label={field.value ? 'Public' : 'Draft'}
              />
            )}
          />
        </div>
        <div>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <Input
                type='text'
                placeholder='Enter promotion name'
                value={field.value || ''}
                onChange={field.onChange}
                error={Boolean(errors.name?.message)}
                errorMessage={errors.name?.message || ''}
              />
            )}
          />
        </div>
      </div>

      <div>
        <Label>Summary</Label>
        <Controller
          name='summary'
          control={control}
          render={({ field }) => (
            <Input
              type='text'
              placeholder='Enter promotion summary'
              value={field.value || ''}
              onChange={field.onChange}
              error={Boolean(errors.summary?.message)}
              errorMessage={errors.summary?.message || ''}
            />
          )}
        />
      </div>

      <div>
        <Label>Badge</Label>
        <Controller
          name='badge'
          control={control}
          render={({ field }) => (
            <Input
              type='text'
              placeholder='Enter promotion badge'
              value={field.value || ''}
              onChange={field.onChange}
              error={Boolean(errors.badge?.message)}
              errorMessage={errors.badge?.message || ''}
            />
          )}
        />
      </div>

      <div>
        <Label>Color Theme</Label>
        <Controller
          name='colorTheme'
          control={control}
          render={({ field }) => (
            <Select
              defaultValue={field.value?.toString() || 'purple'}
              onChange={(value) => {
                field.onChange(value ? parseInt(value) : undefined)
              }}
              options={[
                ...colors.map((color, index) => ({
                  value: index.toString(),
                  label: color.charAt(0).toUpperCase() + color.slice(1),
                })),
              ]}
              placeholder='Select a color theme'
              error={Boolean(errors.colorTheme?.message)}
              errorMessage={errors.colorTheme?.message || ''}
            />
          )}
        />
      </div>

      <div>
        <Label>Highlight Text</Label>
        <Controller
          name='highlightText'
          control={control}
          render={({ field }) => (
            <Input
              type='text'
              placeholder='Enter highlight text'
              value={field.value || ''}
              onChange={field.onChange}
              error={Boolean(errors.highlightText?.message)}
              errorMessage={errors.highlightText?.message || ''}
            />
          )}
        />
      </div>

      <div>
        <Label>Bonus</Label>
        <Controller
          name='bonusId'
          control={control}
          render={({ field }) => (
            <Select
              defaultValue={field.value || ''}
              onChange={(value) => {
                field.onChange(value)
              }}
              options={[
                { value: '', label: 'None' },
                ...bonuses.map((bonus) => ({
                  value: bonus._id,
                  label: bonus.name,
                })),
              ]}
              placeholder={
                isLoadingBonuses ? 'Loading bonuses...' : 'Select a bonus'
              }
              error={Boolean(errors.bonusId?.message)}
              errorMessage={errors.bonusId?.message || ''}
              disabled={isLoadingBonuses}
            />
          )}
        />
      </div>

      <div>
        <Label>Buttons</Label>
        <Controller
          name='buttons'
          control={control}
          render={({ field }) => (
            <div className='space-y-4'>
              {(field.value || []).map((button, index) => (
                <div key={index} className='flex gap-4'>
                  <Input
                    type='text'
                    placeholder='Button Text'
                    value={button.text}
                    onChange={(e) => {
                      const newButtons = [...(field.value || [])]
                      newButtons[index] = {
                        ...newButtons[index],
                        text: e.target.value,
                      }
                      field.onChange(newButtons)
                    }}
                  />
                  <Input
                    type='text'
                    placeholder='Button Link'
                    value={button.link}
                    onChange={(e) => {
                      const newButtons = [...(field.value || [])]
                      newButtons[index] = {
                        ...newButtons[index],
                        link: e.target.value,
                      }
                      field.onChange(newButtons)
                    }}
                  />
                  <Button
                    size='sm'
                    onClick={() => {
                      const newButtons = [...(field.value || [])]
                      newButtons.splice(index, 1)
                      field.onChange(newButtons)
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                size='sm'
                onClick={() => {
                  field.onChange([
                    ...(field.value || []),
                    { text: '', link: '' },
                  ])
                }}
              >
                Add Button
              </Button>
            </div>
          )}
        />
      </div>

      <div>
        <div className='mb-3 flex items-center justify-between'>
          <Label>Visibility</Label>
          <Controller
            name='isPublic'
            control={control}
            render={({ field }) => (
              <Switch
                defaultChecked={field.value}
                onChange={(checked) => {
                  field.onChange(checked)
                }}
                label={field.value ? 'Public' : 'Private'}
              />
            )}
          />
        </div>
      </div>

      <div>
        <Label>Description</Label>
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <div>
              <RichTextEditor
                value={field.value || ''}
                onChange={field.onChange}
              />
              {errors.description?.message && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.description.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <style jsx global>{`
        .rsw-ce {
          background-color: white;
          min-height: 240px;
        }
        .dark .rsw-ce {
          background-color: #1f2937;
          color: white;
        }
      `}</style>
    </div>
  )
}

export default PromotionFormFields
