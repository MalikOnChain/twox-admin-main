import api from '@/lib/api'
import { handleApiError } from '@/lib/error'

interface GetCryptoAssestsResponse extends CryptoWallet {
  error?: string
}

export const getCryptoAssets = async (): Promise<GetCryptoAssestsResponse> => {
  try {
    const response = await api.get<GetCryptoAssestsResponse>('/crypto/assets')
    return response.data
  } catch (error) {
    handleApiError(error, 'Failed to get crypto assets')
  }
}

interface GetCryptoMainWalletAssetsResponse {
  error?: string
  assets: MainWalletResponse[]
}
export const getCryptoMainWalletAssets = async (): Promise<
  MainWalletResponse[]
> => {
  try {
    const response =
      await api.get<GetCryptoMainWalletAssetsResponse>('/crypto/wallet')
    return response.data.assets
  } catch (error) {
    handleApiError(error, 'Failed to get crypto main wallet assets')
  }
}
