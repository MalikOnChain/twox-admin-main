import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { questionFormSchema, QuestionFormValues } from '@/lib/trivia'

import ToolTip from '@/components/common/ToolTip'
import Input from '@/components/form/input/InputField'
import TextArea from '@/components/form/input/TextArea'
import Label from '@/components/form/Label'
import PillInput from '@/components/form/PillInput'
import Select from '@/components/form/Select'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'

import { InfoIcon } from '@/icons'

import {
  AnswerFormat,
  LaunchType,
  QuestionType,
  QuestionTypeLabels,
} from '@/types/trivia'

const QuestionSettingModal = ({
  isOpen,
  closeModal,
  onSubmit,
  selectedQuestion,
}: {
  selectedQuestion?: QuestionFormValues
  isOpen: boolean
  closeModal: () => void
  onSubmit: (data: QuestionFormValues) => Promise<boolean>
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      questionText: selectedQuestion?.questionText || '',
      questionType:
        selectedQuestion?.questionType || QuestionType.FILL_IN_THE_BLANK,
      questionTypeOptions: selectedQuestion?.questionTypeOptions || [],
      answers: selectedQuestion?.answers || [],
      answerFormat: selectedQuestion?.answerFormat || AnswerFormat.EXACT_MATCH,
      timeLimit: selectedQuestion?.timeLimit || null,
      maxWinners: selectedQuestion?.maxWinners || null,
      reward: selectedQuestion?.reward || 0,
      launchType: selectedQuestion?.launchType || LaunchType.MANUAL,
      launchTime: selectedQuestion?.launchTime || null,
      cooldown: selectedQuestion?.cooldown || null,
    },
  })

  const handleOnSubmit = async (data: QuestionFormValues) => {
    const isSuccess = await onSubmit(data)
    if (isSuccess) {
      reset()
      closeModal()
    }
  }
  useEffect(() => {
    if (selectedQuestion) {
      reset(selectedQuestion)
    } else {
      reset({
        questionText: '',
        questionType: QuestionType.FILL_IN_THE_BLANK,
        questionTypeOptions: [],
        answers: [],
        answerFormat: AnswerFormat.EXACT_MATCH,
        timeLimit: 0,
        maxWinners: 0,
        reward: 0,
        launchType: LaunchType.MANUAL,
        launchTime: undefined,
        cooldown: 0,
      })
    }
  }, [selectedQuestion, reset, isOpen])

  return (
    <Modal isOpen={isOpen} onClose={closeModal} className='m-4 max-w-[700px]'>
      <div className='relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900'>
        <div className='px-2 pr-14'>
          <h4 className='mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
            Question Settings
          </h4>
        </div>

        <form className='flex flex-col' onSubmit={handleSubmit(handleOnSubmit)}>
          <div className='custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3'>
            <div className='mt-7'>
              <div className='grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2'>
                {/* Question Text */}
                <div className='col-span-2'>
                  <Label>Question Text</Label>
                  <Controller
                    name='questionText'
                    control={control}
                    render={({ field }) => (
                      <TextArea
                        {...field}
                        rows={3}
                        error={Boolean(errors.questionText?.message)}
                        hint={errors.questionText?.message || ''}
                      />
                    )}
                  />
                </div>

                {/* Question Type */}
                <div className='col-span-2'>
                  <Label>Question Type</Label>
                  <Controller
                    name='questionType'
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={Object.values(QuestionType).map((format) => ({
                          value: format,
                          label: QuestionTypeLabels[format],
                        }))}
                        placeholder='Select question type'
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.answerFormat && (
                    <p className='mt-1 text-xs text-red-500'>
                      {errors.answerFormat.message}
                    </p>
                  )}
                </div>
                {/* Conditional Fields Based on Question Type */}
                {watch('questionType') === QuestionType.MULTIPLE_CHOICE && (
                  <>
                    <div className='col-span-2'>
                      <Label>Options</Label>
                      <Controller
                        name='questionTypeOptions'
                        control={control}
                        render={({ field }) => (
                          <PillInput
                            defaultPills={field.value}
                            placeholder='Type option and press Enter'
                            onChange={(selected) => field.onChange(selected)}
                          />
                        )}
                      />
                      {errors.questionTypeOptions && (
                        <p className='mt-1 text-xs text-red-500'>
                          {errors.questionTypeOptions.message}
                        </p>
                      )}
                    </div>
                    <div className='col-span-2'>
                      <Label>Accepted Answers</Label>
                      <ToolTip text='Please enter some indexs from the options.'>
                        <InfoIcon className='mb-1.5 text-gray-500' />
                      </ToolTip>
                      <Controller
                        name='answers'
                        control={control}
                        render={({ field }) => (
                          <PillInput
                            maxPills={watch('questionTypeOptions').length}
                            type='number'
                            defaultPills={field.value}
                            placeholder='Type option and press Enter'
                            onChange={(selected) => field.onChange(selected)}
                          />
                        )}
                      />
                      {errors.answers && (
                        <p className='mt-1 text-xs text-red-500'>
                          {errors.answers.message}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {watch('questionType') === QuestionType.FILL_IN_THE_BLANK && (
                  <div className='col-span-2'>
                    <div className='flex items-center gap-2'>
                      <Label>Accepted Answers</Label>
                      <ToolTip text='Type answer and press Enter.'>
                        <InfoIcon className='mb-1.5 text-gray-500' />
                      </ToolTip>
                    </div>
                    <Controller
                      name='answers'
                      control={control}
                      render={({ field }) => (
                        <PillInput
                          defaultPills={field.value}
                          placeholder='Type answer and press Enter'
                          onChange={(selected) => field.onChange(selected)}
                        />
                      )}
                    />
                    {errors.answers && (
                      <p className='mt-1 text-xs text-red-500'>
                        {errors.answers.message}
                      </p>
                    )}
                  </div>
                )}
                {watch('questionType') === QuestionType.TRUE_FALSE && (
                  <div className='col-span-2'>
                    <div className='flex items-center gap-2'>
                      <Label>Accepted Answer</Label>
                      <ToolTip text='Type answer and press Enter.'>
                        <InfoIcon className='mb-1.5 text-gray-500' />
                      </ToolTip>
                    </div>
                    <Controller
                      name='answers'
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={[
                            { value: 'True', label: 'True' },
                            { value: 'False', label: 'False' },
                          ]}
                          placeholder='Select answer format'
                          defaultValue={field.value?.[0].toString()}
                          onChange={(selected) => field.onChange([selected])}
                        />
                      )}
                    />
                    {errors.answers && (
                      <p className='mt-1 text-xs text-red-500'>
                        {errors.answers.message}
                      </p>
                    )}
                  </div>
                )}
                {watch('questionType') !== QuestionType.TRUE_FALSE && (
                  <div className='col-span-2'>
                    <Label>Answer Format</Label>
                    <Controller
                      name='answerFormat'
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={Object.values(AnswerFormat).map(
                            (format) => ({
                              value: format,
                              label: format.replaceAll('_', ' '),
                            })
                          )}
                          placeholder='Select answer format'
                          defaultValue={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.answerFormat && (
                      <p className='mt-1 text-xs text-red-500'>
                        {errors.answerFormat.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Time Limit */}
                <div className='col-span-2 lg:col-span-1'>
                  <Label>Time Limit (seconds)</Label>
                  <Controller
                    name='timeLimit'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='number'
                        min={0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        error={Boolean(errors.timeLimit?.message)}
                        errorMessage={errors.timeLimit?.message || ''}
                      />
                    )}
                  />
                </div>

                {/* Max Winners */}
                <div className='col-span-2 lg:col-span-1'>
                  <Label>Max Winners</Label>
                  <Controller
                    name='maxWinners'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='number'
                        min={0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        error={Boolean(errors.maxWinners?.message)}
                        errorMessage={errors.maxWinners?.message || ''}
                      />
                    )}
                  />
                </div>

                {/* Reward */}
                <div className='col-span-2 lg:col-span-1'>
                  <Label>Reward Per Correct Answer</Label>
                  <Controller
                    name='reward'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='number'
                        min={0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        error={Boolean(errors.reward?.message)}
                        errorMessage={errors.reward?.message || ''}
                      />
                    )}
                  />
                </div>

                {/* Launch Type */}
                <div className='col-span-2'>
                  <Label>Launch Type</Label>
                  <Controller
                    name='launchType'
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={Object.values(LaunchType).map((type) => ({
                          value: type,
                          label: type.replaceAll('_', ' '),
                        }))}
                        placeholder='Select launch type'
                        defaultValue={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.launchType && (
                    <p className='mt-1 text-xs text-red-500'>
                      {errors.launchType.message}
                    </p>
                  )}
                </div>
                {watch('launchType') === LaunchType.SCHEDULED && (
                  <div className='col-span-2'>
                    <Label>Launch Time</Label>
                    <Controller
                      name='launchTime'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type='datetime-local'
                          onChange={(e) => field.onChange(e.target.value)}
                          error={Boolean(errors.launchTime?.message)}
                          errorMessage={errors.launchTime?.message || ''}
                        />
                      )}
                    />
                  </div>
                )}
                {/* Cooldown */}
                <div className='col-span-2 lg:col-span-1'>
                  <Label>Cooldown Between Questions (seconds)</Label>
                  <Controller
                    name='cooldown'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type='number'
                        min={0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        error={Boolean(errors.cooldown?.message)}
                        errorMessage={errors.cooldown?.message || ''}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='mt-6 flex items-center gap-3 px-2 lg:justify-end'>
            <Button
              size='sm'
              variant='outline'
              type='button'
              onClick={closeModal}
            >
              Close
            </Button>
            <Button disabled={!isDirty || isSubmitting} size='sm' type='submit'>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default QuestionSettingModal
