// PromotionFormValues: customBonus is always { requirement: {}, reward: {} } (never null)
import { PromotionFormValues } from '@/lib/promotion'

import { IPromotionData } from '@/types/promotion'

export interface PromotionDetailModalProps {
  isOpen: boolean
  closeModal?: () => void
  detail?: IPromotionData
  onSubmit: (data: PromotionFormValues) => Promise<boolean>
}

export interface PromotionImageUploadProps {
  image: string | null
  detailInfo: IPromotionData | null
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  imageRef: React.RefObject<HTMLInputElement>
}

export interface PromotionFormFieldsProps {
  control: any
  errors: any
}
