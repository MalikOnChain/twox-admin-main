export enum AnswerFormat {
  EXACT_MATCH = 'Exact match',
  CASE_INSENSITIVE = 'Case insensitive',
  CONTAINS_KEYWORDS = 'Contains keywords',
}

export enum LaunchType {
  SCHEDULED = 'Scheduled',
  MANUAL = 'Manual',
}
export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  FILL_IN_THE_BLANK = 'fill_in_the_blank',
  TRUE_FALSE = 'true_false',
}

export enum QuestionTypeLabels {
  multiple_choice = 'Multiple Choice',
  fill_in_the_blank = 'Fill in the Blank',
  true_false = 'True or False',
}

export interface Question {
  _id?: string
  questionText: string
  questionType: QuestionType
  questionTypeOptions?: string[] // For multiple choice questions
  answers: (string | number)[]
  answerFormat: AnswerFormat
  timeLimit: number
  maxWinners?: number
  reward: number
  launchType: LaunchType
  cooldown?: number
  status?: 'active' | 'inactive' | 'draft' | 'expired'
  createdAt?: string
  updatedAt?: string
}

/**
 * Response from the API with a list of Questions
 */
export interface QuestionListResponse {
  rows: Question[]
  pagination: {
    total: number
    totalPages: number
    currentPage: number
  }
}

/**
 * Response from the API with a single question
 */
export interface QuestionResponse {
  question: Question
}

/**
 * Success response from create/update/delete operations
 */
export interface QuestionSuccessResponse {
  message: string
  questions?: Question
  error?: string
}

/**
 * Error response from the API
 */
export interface QuestionErrorResponse {
  message: string
}
