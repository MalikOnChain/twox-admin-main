import { ICasino } from '@/types/casino/casino'
import { IBlueOceanGame } from '@/types/casino/blueocean'

/**
 * Maps BlueOcean game data to ICasino format for compatibility with existing components
 */
export function mapBlueOceanGameToCasino(game: IBlueOceanGame): ICasino {
  return {
    _id: game._id,
    id: game.gameId,
    game_name: game.name,
    game_code: game.gameId,
    provider_code: game.provider,
    banner: game.image,
    image: game.image,
    type: game.type,
    status: game.status === 'active' ? '1' : '0',
    home_page: game.isFeatured,
    order: game.order,
    is_pinned: game.isFeatured,
  }
}

/**
 * Maps an array of BlueOcean games to ICasino format
 */
export function mapBlueOceanGamesToCasino(games: IBlueOceanGame[]): ICasino[] {
  return games.map(mapBlueOceanGameToCasino)
}

