import api from '@/lib/api' // Assuming you have an api instance setup
import { handleApiError } from '@/lib/error'
import { QuestionFormValues } from '@/lib/trivia'

import {
  Question,
  QuestionListResponse,
  QuestionSuccessResponse,
} from '@/types/trivia'

/**
 * Create a new question
 * @param question The question data to create
 * @returns The created question data
 */
export const createQuestion = async (
  question: QuestionFormValues
): Promise<QuestionSuccessResponse> => {
  try {
    const res = await api.post<QuestionSuccessResponse>(
      '/trivia/question',
      question
    )
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to create question')
  }
}

/**
 * Update an existing question
 * @param id The ID of the question to update
 * @param question The updated question data
 * @returns The updated question data
 */
export const updateQuestion = async (
  id: string,
  question: QuestionFormValues
): Promise<QuestionSuccessResponse> => {
  try {
    const res = await api.put<QuestionSuccessResponse>(
      `/trivia/question/${id}`,
      question
    )
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to update question')
  }
}
/**
 * Get a list of questions
 * @param params The query parameters for pagination and filtering
 * @returns The list of questions
 */
export const getAllQuestions = async (): Promise<Question[]> => {
  try {
    const res = await api.get<Question[]>('/trivia/question/all')
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to get all questions')
  }
}

/**
 * Get a list of questions
 * @param params The query parameters for pagination and filtering
 * @returns The list of questions
 */
export const getQuestions = async ({
  page,
  limit,
  filter,
}: {
  page: number
  limit: number
  filter: any
}): Promise<QuestionListResponse> => {
  try {
    const res = await api.get<QuestionListResponse>('/trivia/question', {
      params: {
        page,
        limit,
        filter,
      },
    })
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to get questions')
  }
}

/**
 * Delete a question
 * @param id The ID of the question to delete
 * @returns The deleted question data
 */
export const deleteQuestion = async (
  id: string
): Promise<QuestionSuccessResponse> => {
  try {
    const res = await api.delete<QuestionSuccessResponse>(
      `/trivia/question/${id}`
    )
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to delete question')
  }
}

export const launchTrivia = async (
  id: string
): Promise<QuestionSuccessResponse> => {
  try {
    const res = await api.post<QuestionSuccessResponse>(`/trivia/launch/${id}`)
    return res.data
  } catch (error) {
    handleApiError(error, 'Failed to launch trivia')
  }
}
