import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

import Label from '@/components/form/Label'

import { CloseLineIcon } from '@/icons'

import { IConvertedGame } from '@/types/game-category'

interface SortableGameItemProps {
  game: IConvertedGame
  id: string
  onRemove: () => void
}

const SortableGameItem = ({ game, id, onRemove }: SortableGameItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center gap-3 rounded-lg border border-white/[0.05] bg-white/[0.02] p-3 hover:bg-white/[0.05] ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      } cursor-default`}
    >
      <div className='flex-shrink-0'>
        <div className='overflow-hidden rounded-lg'>
          <Image
            width={40}
            height={40}
            src={game.image}
            alt={game.name}
            className='!h-[40px] !w-[40px] object-cover'
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/images/preview.png'
            }}
          />
        </div>
      </div>
      <div className='min-w-0 flex-1'>
        <h4 className='truncate text-sm font-medium text-gray-900 dark:text-white'>
          {game.name}
        </h4>
        <p className='text-xs text-gray-500 capitalize dark:text-gray-400'>
          {game.type} • {game.provider}
        </p>
      </div>
      <button className='flex-shrink-0' onClick={onRemove}>
        <CloseLineIcon className='h-3 w-3 text-gray-400' viewBox='0 0 17 16' />
      </button>
      <div className='flex-shrink-0'>
        <div
          {...listeners}
          className='flex h-6 w-6 cursor-grab items-center justify-center active:cursor-grabbing'
        >
          <svg
            className='h-4 w-4 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 8h16M4 16h16'
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

interface GamesSortListProps {
  selected: Set<string>
  gamesData?: IConvertedGame[] // Available games data from parent
  onOrderChange?: (orderedIds: Set<string>) => void
  onRemove: (id: string) => void
}

const GamesSortList = ({
  selected,
  gamesData,
  onOrderChange,
  onRemove,
}: GamesSortListProps) => {
  const [orderedGameIds, setOrderedGameIds] = useState<string[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Initialize order when selection changes
  useEffect(() => {
    const currentIds = Array.from(selected)

    // If we have existing order and the selection hasn't changed much, preserve order
    if (orderedGameIds.length > 0) {
      // Filter out games that are no longer selected
      const stillSelected = orderedGameIds.filter((id) => selected.has(id))
      // Add any new selections to the end
      const newSelections = currentIds.filter(
        (id) => !orderedGameIds.includes(id)
      )
      const newOrder = [...stillSelected, ...newSelections]

      if (
        newOrder.length !== orderedGameIds.length ||
        !newOrder.every((id, index) => orderedGameIds[index] === id)
      ) {
        setOrderedGameIds(newOrder)
      }
    } else {
      // Initial order
      setOrderedGameIds(currentIds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = orderedGameIds.indexOf(active.id as string)
      const newIndex = orderedGameIds.indexOf(over.id as string)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(orderedGameIds, oldIndex, newIndex)
        setOrderedGameIds(newOrder)

        // Call the callback to update parent component
        onOrderChange?.(new Set(newOrder))
      }
    }
  }

  const gamesMap = useMemo(
    () => new Map(gamesData?.map((game) => [game.id, game])),
    [gamesData]
  )

  const orderedGames = useMemo(
    () =>
      orderedGameIds
        .map((id) => gamesMap.get(id))
        .filter((game): game is IConvertedGame => game !== undefined),
    [orderedGameIds, gamesMap]
  )

  return (
    <div className='space-y-4'>
      <div className='flex h-11 items-center'>
        <Label className='mb-0.5'>Selected Games ({selected.size})</Label>
      </div>

      <div className='overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.03]'>
        {orderedGames.length < 1 ? (
          <div className='p-6 text-center'>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              No games selected
            </p>
          </div>
        ) : (
          <div className='max-h-[800px] overflow-y-auto p-4'>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={orderedGameIds}
                strategy={verticalListSortingStrategy}
              >
                <div className='space-y-2'>
                  {orderedGames.map((game) => (
                    <SortableGameItem
                      key={game.id}
                      id={game.id}
                      game={game}
                      onRemove={() => onRemove(game.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    </div>
  )
}

export default GamesSortList
