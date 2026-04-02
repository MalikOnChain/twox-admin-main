import React from 'react'

import CardLinkOne from './CardLinkOne'
import CardLinkTwo from './CardLinkTwo'
import ComponentCard from '../../common/ComponentCard'

export default function CardWithLinkExample() {
  return (
    <ComponentCard title='Card with link'>
      <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'>
        <CardLinkOne />
        <CardLinkTwo />
      </div>
    </ComponentCard>
  )
}
