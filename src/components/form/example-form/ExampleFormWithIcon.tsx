'use client'
import React, { useState } from 'react'

import Form from '../Form'
import Checkbox from '../input/Checkbox'
import Input from '../input/InputField'
import Label from '../Label'
import ComponentCard from '../../common/ComponentCard'
import Button from '../../ui/button/Button'
import {
  ArrowRightIcon,
  EnvelopeIcon,
  LockIcon,
  UserIcon,
} from '../../../icons'

export default function ExampleFormWithIcon() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const [isChecked, setIsChecked] = useState(false)
  return (
    <ComponentCard title='Example Form With Icons'>
      <Form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 gap-6'>
          <div className='relative'>
            <Input
              type='text'
              placeholder='Username'
              id='username'
              className='pl-11'
            />
            <span className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400'>
              <UserIcon />
            </span>
          </div>{' '}
          <div className='relative'>
            <Input
              type='text'
              placeholder='Email Address'
              id='email'
              className='pl-11'
            />
            <span className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400'>
              <EnvelopeIcon />
            </span>
          </div>{' '}
          <div className='relative'>
            <Input
              type='password'
              placeholder='Password'
              id='password'
              className='pl-11'
            />
            <span className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400'>
              <LockIcon />
            </span>
          </div>{' '}
          <div className='relative'>
            <Input
              type='password'
              placeholder='Confirm Password'
              id='confirm-password'
              className='pl-11'
            />
            <span className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-500 dark:text-gray-400'>
              <LockIcon />
            </span>
          </div>
          <div className='flex justify-between'>
            <div className='flex items-center gap-3'>
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <Label className='mb-0'> Remember me</Label>
            </div>
            <div>
              <Button size='sm'>
                Create Account <ArrowRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </ComponentCard>
  )
}
