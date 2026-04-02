'use client'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { createQuestion, getQuestions, updateQuestion } from '@/api/trivia'

import { QuestionFormValues } from '@/lib/trivia'

import ComponentCard from '@/components/common/ComponentCard'
import QuestionsTable from '@/components/pages/trivia/QuestionsTable'
import QuestionSettingModal from '@/components/trivia/QuestionSettingModal'
import Button from '@/components/ui/button/Button'

import { PlusIcon } from '@/icons'

import { Question } from '@/types/trivia'

const QuestionsPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  )
  const [questions, setQuestions] = useState<Question[]>([])

  const handleOpenModal = useCallback(() => {
    setOpenModal(true)

    if (selectedQuestion) {
      setSelectedQuestion(null)
    }
  }, [selectedQuestion, setSelectedQuestion])

  const handleCloseModal = useCallback(() => {
    setOpenModal(false)
    if (selectedQuestion) {
      setSelectedQuestion(null)
    }
  }, [selectedQuestion, setSelectedQuestion])

  const fetchQuestions = useCallback(async () => {
    try {
      const response = await getQuestions({
        page,
        limit,
        filter: '',
      })
      setTotalPages(response.pagination.totalPages)
      setPage(response.pagination.currentPage)
      setQuestions(response.rows)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error fetching qustions')
      }
    } finally {
      setIsLoading(false)
    }
  }, [page, limit])
  const handleOnSubmit = async (data: QuestionFormValues) => {
    try {
      if (selectedQuestion) {
        await updateQuestion(selectedQuestion._id, data)
        toast.success('Question updated successfully')
        fetchQuestions()
        return true
      } else {
        await createQuestion(data)
        toast.success('Question created successfully')
        fetchQuestions()
        return true
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Error creating Question')
      }
      return false
    }
  }

  const handleOnEdit = (question: Question) => {
    setSelectedQuestion(question)
    handleOpenModal()
  }

  useEffect(() => {
    fetchQuestions()
  }, [fetchQuestions])

  return (
    <ComponentCard
      title='Question management'
      action={
        <Button onClick={handleOpenModal} size='xs'>
          <PlusIcon />
          Add Question
        </Button>
      }
    >
      <QuestionSettingModal
        isOpen={openModal}
        closeModal={handleCloseModal}
        selectedQuestion={selectedQuestion}
        onSubmit={handleOnSubmit}
      />
      <QuestionsTable
        questions={questions}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        fetchQuestions={fetchQuestions}
        onEdit={handleOnEdit}
      />
    </ComponentCard>
  )
}

export default QuestionsPage
