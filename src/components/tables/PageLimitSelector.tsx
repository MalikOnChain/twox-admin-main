import Select from '@/components/form/Select'

const options = [
  { value: '5', label: '5' },
  { value: '10', label: '10' },
  { value: '25', label: '25' },
  { value: '50', label: '50' },
]

interface PageLimitSelectorProps {
  limit: number
  handleChangeLimit: (value: number) => void
}

const PageLimitSelector = ({
  handleChangeLimit,
  limit,
}: PageLimitSelectorProps) => {
  return (
    <div className='flex'>
      <Select
        options={options}
        placeholder='Select page size'
        onChange={(value: string) => handleChangeLimit(Number(value))}
        defaultValue={String(limit)}
        className='cursor-pointer dark:border-gray-700 dark:!bg-gray-800 dark:!text-gray-400'
      />
    </div>
  )
}

export default PageLimitSelector
