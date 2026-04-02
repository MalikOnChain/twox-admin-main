'use client'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { deleteQuestion } from '@/api/trivia'

import ConfirmModal from '@/components/common/ConfirmModal'
import Loading from '@/components/common/Loading'
import Pagination from '@/components/tables/Pagination'
import Badge from '@/components/ui/badge/Badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { PencilIcon, TrashBinIcon } from '@/icons'

import { Question, QuestionTypeLabels } from '@/types/trivia'

type QuestionsTableProps = {
  questions: Question[]
  totalPages: number
  page: number
  setPage: (page: number) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  fetchQuestions: () => void
  onEdit: (question: Question) => void
}

export default function QuestionsTable({
  questions,
  totalPages,
  page,
  setPage,
  isLoading,
  setIsLoading,
  fetchQuestions,
  onEdit,
}: QuestionsTableProps) {
  const [openConfirm, setOpenConfirm] = useState<boolean>(false)
  const [deleteId, setDeleteId] = useState<string>(null)

  const handleClose = useCallback(() => setOpenConfirm(false), [])

  const handleDelete = async (id: string) => {
    if (isLoading || !id) return
    try {
      setIsLoading(true)
      await deleteQuestion(id)
      toast.success('Question deleted successfully')
      fetchQuestions()
    } catch (error) {
      console.error('Error deleting question:', error)
      toast.error('Failed to delete question')
    } finally {
      setIsLoading(false)
      setDeleteId(null)
      setOpenConfirm(false)
    }
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
            <div className='max-w-full overflow-x-auto'>
              <Table>
                {/* Table Header */}
                <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                  <TableRow>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-left font-medium text-gray-500 dark:text-gray-400'
                    >
                      Question Text
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Question Type
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Answer Format
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Time Limit
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Max Winners
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Reward
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Launch Type
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Cooldown
                    </TableCell>
                    <TableCell
                      isHeader
                      className='text-theme-xs px-5 py-3 text-center font-medium text-gray-500 dark:text-gray-400'
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                  {questions &&
                    questions.length > 0 &&
                    questions.map((question) => (
                      <TableRow key={question._id}>
                        <TableCell className='text-theme-sm cursor-default px-4 py-3 text-left text-gray-500 dark:text-gray-400'>
                          {question.questionText}
                        </TableCell>
                        <TableCell className='px-5 py-4 text-center text-gray-500 sm:px-6 dark:text-gray-400'>
                          <Badge color='info' size='sm'>
                            {QuestionTypeLabels[question.questionType]}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          <Badge color='primary' size='sm'>
                            {question.answerFormat}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          {question.timeLimit
                            ? `${question.timeLimit} seconds`
                            : 'N/A'}
                        </TableCell>
                        <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          {question.maxWinners || 'Unlimited'}
                        </TableCell>
                        <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          {question.reward}
                        </TableCell>
                        <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          {question.launchType}
                        </TableCell>
                        <TableCell className='text-theme-sm cursor-default px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          {question.cooldown
                            ? `${question.cooldown} seconds`
                            : 'N/A'}
                        </TableCell>
                        <TableCell className='text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400'>
                          <div className='flex items-center justify-center gap-2'>
                            <a
                              className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                              onClick={() => {
                                onEdit(question)
                              }}
                            >
                              <PencilIcon />
                            </a>
                            <a
                              className='hover:text-brand-500 text-theme-xs dark:text-theme-xs flex items-center justify-center gap-1 hover:cursor-pointer'
                              onClick={() => {
                                setDeleteId(question._id)
                                setOpenConfirm(true)
                              }}
                            >
                              <TrashBinIcon />
                            </a>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                  {questions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className='text-center'>
                        <p className='py-2 text-gray-500 dark:text-gray-400'>
                          No questions found
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <Pagination
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={setPage}
                  className='mb-5 justify-center'
                />
              )}
            </div>
            <ConfirmModal
              open={openConfirm}
              title='Are you Sure?'
              description='You can not restore deleted question.'
              handleConfirm={() => handleDelete(deleteId)}
              handleClose={handleClose}
            />
          </div>
        </>
      )}
    </>
  )
}
