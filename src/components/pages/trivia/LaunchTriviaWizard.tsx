'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { getAllQuestions, launchTrivia } from '@/api/trivia'

import ConfirmModal from '@/components/common/ConfirmModal'
import Loading from '@/components/common/Loading'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import Input from '@/components/form/input/InputField'
import Radio from '@/components/form/input/Radio'
import Label from '@/components/form/Label'
import SearchableSelect from '@/components/form/SearchableSelect'
import Button from '@/components/ui/button/Button'

import { Question } from '@/types/trivia'

const WizardSteps = [
  'Select Question',
  'Confirm Question',
  'Count Down',
  'Live Monitor',
]

const LaunchTriviaWizard = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [step, setStep] = useState(1)
  const [questionSelectType, setQuestionSelectType] = useState('manual')
  const [selectedQuestion, setSelectedQuestion] = useState<Question>(null)
  const [countdown, setCountdown] = useState(0)
  const [countDownHandler, setCountDownHandler] =
    useState<NodeJS.Timeout | null>(null)
  const [openConfirm, setOpenConfirm] = useState(false)

  const handleClose = useCallback(() => setOpenConfirm(false), [])

  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true)
      setSelectedQuestion(null)
      const res = await getAllQuestions()
      setQuestions(res)
    } catch {
      toast.error('Error fetching questions')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const launchTriviaViaServer = useCallback(async () => {
    try {
      setIsLoading(true)
      await launchTrivia(selectedQuestion._id)
      setStep(4)
    } catch {
      toast.error('Error launching trivia')
    } finally {
      setIsLoading(false)
    }
  }, [selectedQuestion])

  const startCountdown = useCallback(() => {
    setCountdown((prev) => {
      if (prev <= 1) {
        clearInterval(countDownHandler!)
        launchTriviaViaServer()
        return 0
      }
      return prev - 1
    })
  }, [countDownHandler, launchTriviaViaServer])

  const handleCountDown = () => {
    if (countdown <= 0) {
      setOpenConfirm(true)
      return
    }
    setStep(3)
    clearInterval(countDownHandler!)
    startCountdown()
    const handler = setInterval(startCountdown, 1000)
    setCountDownHandler(handler)
  }

  const handleStartImmediately = () => {
    clearInterval(countDownHandler!)
    setCountDownHandler(null)
    setCountdown(0)
    launchTriviaViaServer()
  }

  const stopCountDownAndBack = () => {
    clearInterval(countDownHandler!)
    setCountDownHandler(null)
    setStep(2)
  }

  useEffect(() => {
    if (countDownHandler && step !== 3) {
      clearInterval(countDownHandler)
      setCountDownHandler(null)
    }
  }, [step, countDownHandler])

  const selectRandomQuestion = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * questions.length)
    setSelectedQuestion(questions[randomIndex])
  }, [questions])
  useEffect(() => {
    if (questionSelectType === 'random' && questions.length) {
      selectRandomQuestion()
    } else {
      setSelectedQuestion(null)
    }
  }, [questionSelectType, questions, selectRandomQuestion])

  useEffect(() => {
    if (!selectedQuestion) setStep(1)
  }, [selectedQuestion])

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  const renderStepIndicator = () =>
    WizardSteps.map((_, index) => (
      <React.Fragment key={index}>
        <div
          className={`flex flex-col items-center gap-2 ${step === index + 1 ? 'text-green-400' : 'text-gray-500'}`}
        >
          <span
            className={`h-4 w-4 rounded-full ${step === index + 1 ? 'bg-green-400' : 'bg-gray-300'}`}
          ></span>
        </div>
        {index < WizardSteps.length - 1 && (
          <div
            className={`h-1 flex-1 ${step > index + 1 ? 'bg-green-400' : 'bg-gray-300'}`}
          ></div>
        )}
      </React.Fragment>
    ))

  const renderCountdown = () => (
    <div className='overflow-clip p-4'>
      <p
        className='text-center text-xl font-bold transition-transform duration-500 ease-in-out'
        style={{
          transform: 'scale(1)',
          animation: 'countdown-shrink 0.5s ease-in-out',
        }}
        key={countdown}
      >
        {countdown}
      </p>
    </div>
  )

  return isLoading ? (
    <Loading />
  ) : (
    <main className='p-4 text-gray-700 sm:p-6 xl:p-8 dark:text-gray-400/90'>
      <h1 className='mb-4 text-center text-2xl font-bold'>
        {WizardSteps[step - 1]}
      </h1>
      <div className='relative mb-6 flex items-center justify-between text-xl font-bold'>
        {renderStepIndicator()}
      </div>

      {step === 1 && (
        <div className='shadow-default rounded p-6'>
          <div className='mb-4'>
            <div className='flex gap-6'>
              {['manual', 'random'].map((type) => (
                <Radio
                  key={type}
                  id={`questionSelectType-${type}`}
                  name='questionSelectType'
                  value={type}
                  checked={questionSelectType === type}
                  onChange={() => setQuestionSelectType(type)}
                  label={type.charAt(0).toUpperCase() + type.slice(1)}
                />
              ))}
            </div>
          </div>

          {questionSelectType === 'manual' ? (
            <div className='mb-4'>
              <Label className='mb-2 block text-gray-700 dark:text-gray-400'>
                Question
              </Label>
              <SearchableSelect
                placeholder='Select a question'
                options={questions.map((q) => ({
                  value: q._id,
                  text: q.questionText,
                }))}
                onSelect={(option) =>
                  setSelectedQuestion(questions.find((q) => q._id === option))
                }
                defaultSelected={selectedQuestion?._id}
              />
            </div>
          ) : (
            <div className='mb-4 flex flex-col gap-2'>
              <Label className='mb-2 flex gap-2 text-gray-700 dark:text-gray-400'>
                Selected Question by randomly:
                <span
                  onClick={selectRandomQuestion}
                  className='cursor-pointer text-black hover:text-blue-500 hover:underline dark:text-white dark:hover:text-blue-500'
                >
                  Select Again
                </span>
              </Label>
              {!selectedQuestion ? (
                <LoadingSpinner />
              ) : (
                <span className='text-gray-900 dark:text-gray-200'>
                  {selectedQuestion.questionText}
                </span>
              )}
            </div>
          )}

          <div className='flex justify-end'>
            <Button
              onClick={() => setStep(2)}
              disabled={!selectedQuestion}
              className='bg-primary hover:bg-opacity-90 mt-4 rounded px-6 py-2 text-white'
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {step === 2 && selectedQuestion && (
        <div className='shadow-default rounded p-6'>
          <div className='mb-4 flex flex-wrap items-center justify-center gap-2 text-xl'>
            <Label className='!mb-0 block'>Selected Question:</Label>
            <span className='text-gray-900 dark:text-gray-200'>
              {selectedQuestion.questionText}
            </span>
          </div>

          <div className='mb-4 flex flex-wrap items-center justify-between'>
            <Label className='mb-2 block'>Countdown Seconds</Label>
            <Input
              type='number'
              min={0}
              value={countdown}
              onChange={(e) => setCountdown(Number(e.target.value))}
            />
          </div>

          <div className='mb-4 flex flex-wrap items-center justify-between'>
            <Label className='mb-2 block'>Max Winners:</Label>
            <span className='text-gray-900 dark:text-gray-200'>
              {selectedQuestion.maxWinners}
            </span>
          </div>

          <div className='mb-4 flex flex-wrap items-center justify-between'>
            <Label className='mb-2 block'>Time Limit (seconds)</Label>
            <span className='text-gray-900 dark:text-gray-200'>
              {selectedQuestion.timeLimit}
            </span>
          </div>

          <div className='mb-4 flex flex-wrap items-center justify-between'>
            <Label className='mb-2 block'>
              Cooldown Between Questions (seconds):{' '}
            </Label>
            <span className='text-gray-900 dark:text-gray-200'>
              {selectedQuestion.cooldown}
            </span>
          </div>

          <div className='mb-4 flex flex-wrap items-center justify-between'>
            <Label className='mb-2 block text-gray-700 dark:text-gray-400'>
              Launch Type:{' '}
            </Label>
            <span className='text-gray-900 dark:text-gray-200'>
              {selectedQuestion.launchType}
            </span>
          </div>

          <div className='flex justify-between'>
            <Button
              variant='outline'
              onClick={() => setStep(1)}
              className='border-primary text-primary rounded border px-6 py-2'
            >
              Back
            </Button>
            <Button
              onClick={handleCountDown}
              className='bg-primary hover:bg-opacity-90 rounded px-6 py-2 text-white'
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {step === 3 && countdown > 0 && (
        <div className='shadow-default rounded p-6'>
          {renderCountdown()}
          <div className='flex justify-between'>
            <Button
              variant='outline'
              onClick={stopCountDownAndBack}
              className='border-primary text-primary rounded border px-6 py-2'
            >
              Back
            </Button>
            <Button
              onClick={handleStartImmediately}
              className='bg-primary hover:bg-opacity-90 rounded px-6 py-2 text-white'
            >
              Start Immediately
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className='shadow-default rounded p-6'>
          <p className='mb-2'>
            Status: <span className='font-bold text-green-600'>Active</span>
          </p>
          <p className='mb-2'>
            Question:{' '}
            <span className='italic'>{selectedQuestion.questionText}</span>
          </p>
          <p className='mb-2'>Answers:</p>
          <textarea
            readOnly
            value={`@user1 ✅\n@user2 ❌\n@user3 ✅`}
            className='border-stroke h-24 w-full rounded border p-2 font-mono'
          />
          <p className='mt-2'>Winners: @user1, @user3</p>
          <div className='mt-4 flex justify-between'>
            <Button
              variant='outline'
              onClick={() => setStep(2)}
              className='border-primary text-primary rounded border px-6 py-2'
            >
              Back
            </Button>
            <Button className='rounded bg-red-600 px-6 py-2 text-white hover:bg-red-700'>
              End Round
            </Button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={openConfirm}
        title='Are you Sure?'
        description='This Trivia will be started immediately.'
        handleConfirm={launchTriviaViaServer}
        handleClose={handleClose}
      />
    </main>
  )
}

export default LaunchTriviaWizard
