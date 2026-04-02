import { z } from 'zod'

import { AnswerFormat, LaunchType, QuestionType } from '@/types/trivia'

export const questionFormSchema = z
  .object({
    questionText: z.string().min(1, 'Question text is required'),
    questionType: z
      .nativeEnum(QuestionType)
      .default(QuestionType.FILL_IN_THE_BLANK),
    questionTypeOptions: z.array(z.string()).optional(),
    answers: z.array(z.union([z.string(), z.number()])).optional(),
    answerFormat: z.nativeEnum(AnswerFormat).default(AnswerFormat.EXACT_MATCH),
    timeLimit: z
      .number()
      .positive('Time limit must be a positive number')
      .optional(),
    maxWinners: z
      .number()
      .int()
      .positive('Max winners must be a positive number')
      .optional(),
    reward: z.number().min(1, 'Reward is required'),
    launchType: z.nativeEnum(LaunchType).default(LaunchType.SCHEDULED),
    launchTime: z.string().optional(),
    cooldown: z
      .number()
      .nonnegative('Cooldown must be a non-negative number')
      .optional(),
  })
  .refine(
    (data) =>
      data.questionType !== QuestionType.MULTIPLE_CHOICE ||
      (data.questionTypeOptions?.length ?? 0) > 0,
    {
      message: 'Options are required for "Multiple Choice" questions',
      path: ['questionTypeOptions'],
    }
  )
  .refine((data) => (data.answers?.length ?? 0) > 0, {
    message: 'Accepted answers are required',
    path: ['answers'],
  })
  .refine(
    (data) =>
      data.questionType !== QuestionType.MULTIPLE_CHOICE ||
      (data.answers?.every(
        (index) => Number(index) < (data.questionTypeOptions?.length ?? 0)
      ) &&
        data.answers.length <= (data.questionTypeOptions?.length ?? 0)),
    {
      message:
        'Answers must be within the range of provided options and unique',
      path: ['answers'],
    }
  )
  .refine(
    (data) =>
      data.launchType !== LaunchType.SCHEDULED || data.launchTime !== undefined,
    {
      message: 'Launch time is required for "Scheduled" launch type',
      path: ['launchTime'],
    }
  )

export type QuestionFormValues = z.infer<typeof questionFormSchema>
