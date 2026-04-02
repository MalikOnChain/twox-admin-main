import Link from 'next/link'
import React from 'react'

import ComponentCard from '@/components/common/ComponentCard'
import GameCategoriesList from '@/components/game-categories/List'
import Button from '@/components/ui/button/Button'

import { PlusIcon } from '@/icons'

const GameCategories = () => (
  <ComponentCard
    title='Game Categories'
    action={
      <Link href='/games/categories/create' passHref>
        <Button size='xs'>
          <PlusIcon />
          Add Category
        </Button>
      </Link>
    }
  >
    <GameCategoriesList />
  </ComponentCard>
)

export default GameCategories
