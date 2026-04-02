import React from 'react'

interface ChartTabProps {
  options: {
    value: string
    label: string
  }[]
  selected: string
  setSelected: (selected: string) => void
}

const ChartTab: React.FC<ChartTabProps> = ({
  options,
  selected,
  setSelected,
}) => {
  const getButtonClass = (value: string) =>
    selected === value
      ? 'shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800'
      : 'text-gray-500 dark:text-gray-400'

  return (
    <div className='flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900'>
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => setSelected(option.value)}
          className={`text-theme-sm white w-full rounded-md px-3 py-2 font-medium whitespace-nowrap hover:text-gray-900 dark:hover:text-white ${getButtonClass(
            option.value
          )}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default ChartTab
