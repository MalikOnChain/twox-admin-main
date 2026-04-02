import { Control, Controller } from 'react-hook-form'

import { CashbackFormValues } from '@/lib/cashback'

import Input from '@/components/form/input/InputField'
import { TableBody } from '@/components/ui/table'
import { TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { Table } from '@/components/ui/table'

interface CashbackTierSettingsProps {
  control: Control<CashbackFormValues>
  errors: any
  formatedTiers: any[]
}

const CashbackTierSettings = ({
  control,
  errors,
  formatedTiers,
}: CashbackTierSettingsProps) => {
  return (
    <div className='custom-scrollbar flex max-h-[400px] flex-col overflow-y-auto pb-4'>
      <Table>
        {/* Table Header */}
        <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
          <TableRow>
            <TableCell
              isHeader
              className='text-theme-xs px-5 py-3 text-center font-medium text-nowrap text-gray-500 dark:text-gray-400'
            >
              Tier Name
            </TableCell>
            <TableCell
              isHeader
              className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
            >
              Level Name
            </TableCell>
            <TableCell
              isHeader
              className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
            >
              Rate
            </TableCell>
            <TableCell
              isHeader
              className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
            >
              Min Wager
            </TableCell>
            <TableCell
              isHeader
              className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
            >
              Cap Per Day
            </TableCell>
            <TableCell
              isHeader
              className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
            >
              Cap Per Week
            </TableCell>
            <TableCell
              isHeader
              className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
            >
              Cap Per Month
            </TableCell>
          </TableRow>
        </TableHeader>

        {/* Table Body */}
        <TableBody className='divide-y divide-gray-800 dark:divide-white/[0.05]'>
          {formatedTiers &&
            formatedTiers.map((row, index) => (
              <TableRow key={index}>
                <TableCell className='text-theme-sm cursor-default px-1 py-1 text-center text-gray-500 dark:text-gray-400'>
                  {row.name}
                </TableCell>
                <TableCell className='text-theme-sm cursor-default px-1 py-1 text-center text-gray-500 dark:text-gray-400'>
                  {row.tierLevel}
                </TableCell>
                <TableCell className='text-theme-sm cursor-default px-1 py-1 text-center text-gray-500 dark:text-gray-400'>
                  <Controller
                    name={`tiers.${index}.percentage`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type='number'
                        min='0'
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value))
                        }}
                        error={Boolean(errors.tiers?.[index]?.percentage)}
                        errorMessage={
                          errors.tiers?.[index]?.percentage?.message || ''
                        }
                      />
                    )}
                  />
                </TableCell>
                <TableCell className='text-theme-sm cursor-default px-1 py-1 text-center text-gray-500 dark:text-gray-400'>
                  <Controller
                    name={`tiers.${index}.minWagering`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type='number'
                        min='0'
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value))
                        }}
                        error={Boolean(errors.tiers?.[index]?.minWagering)}
                        errorMessage={
                          errors.tiers?.[index]?.minWagering?.message || ''
                        }
                      />
                    )}
                  />
                </TableCell>
                <TableCell className='text-theme-sm cursor-default px-1 py-1 text-center text-gray-500 dark:text-gray-400'>
                  <Controller
                    name={`tiers.${index}.cap.day`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type='number'
                        min='0'
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value))
                        }}
                        error={Boolean(errors.tiers?.[index]?.cap?.day)}
                        errorMessage={
                          errors.tiers?.[index]?.cap?.day?.message || ''
                        }
                      />
                    )}
                  />
                </TableCell>
                <TableCell className='text-theme-sm px-1 py-1 text-center text-gray-500 dark:text-gray-400'>
                  <Controller
                    name={`tiers.${index}.cap.week`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type='number'
                        min='0'
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value))
                        }}
                        error={Boolean(errors.tiers?.[index]?.cap?.week)}
                        errorMessage={errors.tiers?.[index]?.cap?.week?.message}
                      />
                    )}
                  />
                </TableCell>
                <TableCell className='text-theme-sm px-1 py-1 text-center text-gray-500 dark:text-gray-400'>
                  <Controller
                    name={`tiers.${index}.cap.month`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        type='number'
                        min='0'
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value))
                        }}
                        error={Boolean(errors.tiers?.[index]?.cap?.month)}
                        errorMessage={
                          errors.tiers?.[index]?.cap?.month?.message
                        }
                      />
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default CashbackTierSettings
