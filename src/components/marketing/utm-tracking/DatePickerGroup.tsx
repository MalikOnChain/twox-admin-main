import DatePicker from '@/components/form/date-picker'

import { GetUTMTrackingFilter } from '@/types/utm-track'

const DatePickerGroup = ({
  filter,
  setFilter,
}: {
  filter: GetUTMTrackingFilter
  setFilter: React.Dispatch<React.SetStateAction<GetUTMTrackingFilter>>
}) => {
  const handleDateFromChange = (dates: Date[]) => {
    if (dates.length > 0) {
      const date = new Date(dates[0])
      const formattedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split('T')[0]
      setFilter((prev: GetUTMTrackingFilter) => ({
        ...prev,
        date_from: formattedDate,
      }))
    } else {
      setFilter((prev: GetUTMTrackingFilter) => ({ ...prev, date_from: '' }))
    }
  }

  const handleDateToChange = (dates: Date[]) => {
    if (dates.length > 0) {
      const date = new Date(dates[0])
      const formattedDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split('T')[0]
      setFilter((prev: GetUTMTrackingFilter) => ({
        ...prev,
        date_to: formattedDate,
      }))
    } else {
      setFilter((prev: GetUTMTrackingFilter) => ({ ...prev, date_to: '' }))
    }
  }

  return (
    <div className='flex flex-wrap items-center justify-center gap-4'>
      <DatePicker
        id='date-from'
        placeholder='Date From'
        onChange={handleDateFromChange}
        maxDate={
          filter.date_to ? new Date(filter.date_to + 'T00:00:00') : undefined
        }
      />

      <DatePicker
        id='date-to'
        placeholder='Date To'
        onChange={handleDateToChange}
        minDate={
          filter.date_from
            ? new Date(filter.date_from + 'T00:00:00')
            : undefined
        }
      />
    </div>
  )
}

export default DatePickerGroup
