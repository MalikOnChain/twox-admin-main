import React from 'react'

import LoadingSpinner from '@/components/common/LoadingSpinner'

const Spinner: React.FC = () => {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <LoadingSpinner />
    </div>
  )
}

export default Spinner
