import GameCategoriesDetail from '@/components/game-categories/Detail'

const GameCategoriesDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  return <GameCategoriesDetail id={id} />
}

export default GameCategoriesDetailPage
