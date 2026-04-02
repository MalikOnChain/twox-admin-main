'use client'
import React from 'react'

import FileInput from '../input/FileInput'
import Label from '../Label'
import ComponentCard from '../../common/ComponentCard'

export default function FileInputExample() {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // console.log('Selected file:', file.name)
    }
  }

  return (
    <ComponentCard title='File Input'>
      <div>
        <Label>Upload file</Label>
        <FileInput onChange={handleFileChange} className='custom-class' />
      </div>
    </ComponentCard>
  )
}
