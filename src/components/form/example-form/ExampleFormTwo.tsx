'use client'
import React, { useState } from 'react'
import Flatpickr from 'react-flatpickr'

import 'flatpickr/dist/themes/light.css'

import Form from '../Form'
import Input from '../input/InputField'
import Radio from '../input/Radio'
import Label from '../Label'
import Select from '../Select'
import ComponentCard from '../../common/ComponentCard'
import Button from '../../ui/button/Button'
import { CalenderIcon } from '../../../icons'

export default function ExampleFormTwo() {
  const [selectedOption, setSelectedOption] = useState<string>('Free')
  const [dateOfBirth, setDateOfBirth] = useState('')

  const handleDateChange = (date: Date[]) => {
    setDateOfBirth(date[0].toLocaleDateString()) // Handle selected date and format it
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const optionsGender = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Others' },
  ]
  const categoryOptions = [
    { value: 'cate1', label: 'Category 1' },
    { value: 'cate2', label: 'Category 2' },
    { value: 'cate3', label: 'Category 3' },
  ]
  const country = [
    { value: 'bd', label: 'Bangladesh' },
    { value: 'usa', label: 'United States' },
    { value: 'canada', label: 'Canada' },
  ]
  const handleSelectGender = () => {}

  const handleRadioChange = (value: string) => {
    setSelectedOption(value)
  }
  return (
    <ComponentCard title='Example Form'>
      <Form onSubmit={handleSubmit}>
        <div className='grid gap-6 sm:grid-cols-2'>
          <div className='col-span-full'>
            <h4 className='border-b border-gray-200 pb-4 text-base font-medium text-gray-800 dark:border-gray-800 dark:text-white/90'>
              Personal Info
            </h4>
          </div>
          <div>
            <Label htmlFor='firstName'>First Name</Label>
            <Input type='text' placeholder='Enter first name' id='firstName' />
          </div>
          <div>
            <Label htmlFor='lastName'>Last Name</Label>
            <Input type='text' placeholder='Enter last name' id='firstName' />
          </div>
          <div className='col-span-2'>
            <Label htmlFor='email'>Gender</Label>
            <Select
              options={optionsGender}
              placeholder='Select an option'
              onChange={handleSelectGender}
              defaultValue=''
              className='bg-gray-50 dark:bg-gray-800'
            />
          </div>
          <div className='col-span-2'>
            <Label htmlFor='lastName'>Date of Birth</Label>
            <div className='flatpickr-wrapper relative w-full'>
              <Flatpickr
                value={dateOfBirth} // Set the value to the state
                onChange={handleDateChange} // Handle the date change
                options={{
                  dateFormat: 'Y-m-d', // Set the date format
                }}
                placeholder='Select an option'
                className='h-11 w-full rounded-md border border-gray-300 py-2 pr-10 pl-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-white'
              />
              <span className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400'>
                <CalenderIcon />
              </span>
            </div>
          </div>
          <div className='col-span-2'>
            <Label htmlFor='email'>Category</Label>
            <Select
              options={categoryOptions}
              placeholder='Select an option'
              onChange={handleSelectGender}
              defaultValue=''
              className='bg-gray-50 dark:bg-gray-800'
            />
          </div>
          <div className='col-span-2'>
            <h4 className='border-b border-gray-200 pb-4 text-base font-medium text-gray-800 dark:border-gray-800 dark:text-white/90'>
              Address
            </h4>
          </div>
          <div className='col-span-2'>
            <Label htmlFor='street'>Street</Label>
            <Input type='text' id='street' />
          </div>
          <div>
            <Label htmlFor='street'>City</Label>
            <Input type='text' id='city' />
          </div>
          <div>
            <Label htmlFor='state'>State</Label>
            <Input type='text' id='state' />
          </div>
          <div>
            <Label htmlFor='postCode'>Post Code</Label>
            <Input type='text' id='postCode' />
          </div>
          <div>
            <Label htmlFor='email'>Category</Label>
            <Select
              options={country}
              placeholder='--Select Country--'
              onChange={handleSelectGender}
              defaultValue=''
              className='bg-gray-50 dark:bg-gray-800'
            />
          </div>
          <div className='col-span-full flex items-center gap-3'>
            <Label className='m-0'>Membership:</Label>
            <div className='flex flex-wrap items-center gap-4'>
              <Radio
                id='Free'
                name='roleSelect'
                value='Free'
                label='Free'
                checked={selectedOption === 'Free'}
                onChange={handleRadioChange}
              />
              <Radio
                id='Premium'
                name='roleSelect'
                value='Premium'
                label='Premium'
                checked={selectedOption === 'Premium'}
                onChange={handleRadioChange}
              />
            </div>
          </div>
          <div className='flex gap-3'>
            <Button size='sm'>Save Changes</Button>
            <Button size='sm' variant='outline'>
              Cancel
            </Button>
          </div>
        </div>
      </Form>
    </ComponentCard>
  )
}
