'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ComponentCard from '@/components/common/ComponentCard'
import Button from '@/components/ui/button/Button'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Switch from '@/components/form/switch/Switch'
import Loading from '@/components/common/Loading'
import {
  getContentSections,
  createContentSection,
  updateContentSection,
  deleteContentSection,
  IContentSection,
} from '@/api/content-section'
import { PlusIcon, PencilIcon, TrashBinIcon } from '@/icons'
import { Modal } from '@/components/ui/modal'

const contentSectionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  listItems: z.array(z.string()).optional(),
  isActive: z.boolean(),
  order: z.number().min(0),
})

type ContentSectionFormValues = z.infer<typeof contentSectionSchema>

interface ContentSectionModalProps {
  isOpen: boolean
  onClose: () => void
  section?: IContentSection | null
  onSave: (data: ContentSectionFormValues) => Promise<boolean>
}

const ContentSectionModal = ({ isOpen, onClose, section, onSave }: ContentSectionModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [listItemsText, setListItemsText] = useState('')

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ContentSectionFormValues>({
    resolver: zodResolver(contentSectionSchema),
    defaultValues: {
      title: '',
      content: '',
      listItems: [],
      isActive: true,
      order: 0,
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (section) {
        reset({
          title: section.title || '',
          content: section.content || '',
          listItems: section.listItems || [],
          isActive: section.isActive !== undefined ? section.isActive : true,
          order: section.order || 0,
        })
        setListItemsText((section.listItems || []).join('\n'))
      } else {
        reset({
          title: '',
          content: '',
          listItems: [],
          isActive: true,
          order: 0,
        })
        setListItemsText('')
      }
    }
  }, [section, isOpen, reset])

  const onSubmit = async (data: ContentSectionFormValues) => {
    setIsSubmitting(true)
    try {
      // Parse list items from textarea
      const listItems = listItemsText
        .split('\n')
        .map((item) => item.trim())
        .filter((item) => item.length > 0)

      const success = await onSave({
        ...data,
        listItems,
      })
      if (success) {
        onClose()
      }
    } catch (error) {
      console.error('Error submitting content section:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='max-w-4xl'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='p-6'>
          <h2 className='mb-6 text-xl font-semibold text-gray-800 dark:text-white'>
            {section ? 'Edit' : 'Create'} Content Section
          </h2>

          <div className='space-y-4'>
            <div>
              <Label>Title *</Label>
              <Controller
                name='title'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    error={!!errors.title?.message}
                    errorMessage={errors.title?.message}
                    placeholder='Enter section title'
                    className='mt-2'
                  />
                )}
              />
            </div>

            <div>
              <Label>Content *</Label>
              <Controller
                name='content'
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={8}
                    className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                    placeholder='Enter content (use double line breaks to separate paragraphs)'
                  />
                )}
              />
              {errors.content?.message && (
                <p className='mt-1 text-xs text-red-500'>{errors.content.message}</p>
              )}
            </div>

            <div>
              <Label>List Items (one per line)</Label>
              <textarea
                value={listItemsText}
                onChange={(e) => setListItemsText(e.target.value)}
                rows={6}
                className='mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                placeholder='Enter list items, one per line'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label>Display Order</Label>
                <Controller
                  name='order'
                  control={control}
                  render={({ field }) => (
                    <Input
                      type='number'
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      className='mt-2'
                    />
                  )}
                />
              </div>

              <div className='flex items-center gap-2 pt-8'>
                <Controller
                  name='isActive'
                  control={control}
                  render={({ field }) => (
                    <Switch
                      defaultChecked={field.value}
                      onChange={(checked) => field.onChange(checked)}
                    />
                  )}
                />
                <Label>Active</Label>
              </div>
            </div>
          </div>

          <div className='mt-6 flex justify-end gap-2'>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={!isDirty || isSubmitting}>
              {isSubmitting ? 'Saving...' : section ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default function ContentSectionCard() {
  const [sections, setSections] = useState<IContentSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSection, setSelectedSection] = useState<IContentSection | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchSections = async () => {
    try {
      setIsLoading(true)
      const response = await getContentSections()
      setSections(response.data || [])
    } catch (error) {
      toast.error('Failed to fetch content sections')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSections()
  }, [])

  const handleSave = async (data: ContentSectionFormValues): Promise<boolean> => {
    try {
      if (selectedSection?._id) {
        await updateContentSection(selectedSection._id, data)
        toast.success('Content section updated successfully')
      } else {
        // Ensure all required fields are provided for creation
        await createContentSection({
          title: data.title,
          content: data.content,
          listItems: data.listItems || [],
          isActive: data.isActive ?? true,
          order: data.order,
        })
        toast.success('Content section created successfully')
      }
      await fetchSections()
      setSelectedSection(null)
      return true
    } catch (error) {
      toast.error('Failed to save content section')
      return false
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content section?')) return
    try {
      await deleteContentSection(id)
      toast.success('Content section deleted successfully')
      await fetchSections()
    } catch (error) {
      toast.error('Failed to delete content section')
    }
  }

  const handleEdit = (section: IContentSection) => {
    setSelectedSection(section)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setSelectedSection(null)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setSelectedSection(null)
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <ComponentCard title='Content Section'>
      <div className='space-y-4'>
        <div className='flex justify-end'>
          <Button size='sm' onClick={handleAdd}>
            <PlusIcon className='mr-2 h-4 w-4' />
            Add Content Section
          </Button>
        </div>

        <div className='space-y-2'>
          {sections.length === 0 ? (
            <p className='text-center text-gray-500 dark:text-gray-400'>No content sections found</p>
          ) : (
            sections.map((section) => (
              <div
                key={section._id}
                className='flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700'
              >
                <div className='flex-1'>
                  <div className='flex items-center gap-3'>
                    <h3 className='font-semibold text-gray-800 dark:text-white'>{section.title}</h3>
                    {!section.isActive && (
                      <span className='rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400'>
                        Inactive
                      </span>
                    )}
                    <span className='text-xs text-gray-500 dark:text-gray-400'>Order: {section.order}</span>
                  </div>
                  <p className='mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2'>
                    {section.content.substring(0, 100)}...
                  </p>
                  {section.listItems && section.listItems.length > 0 && (
                    <p className='mt-1 text-xs text-gray-400 dark:text-gray-500'>
                      {section.listItems.length} list item(s)
                    </p>
                  )}
                </div>
                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handleEdit(section)}
                  >
                    <PencilIcon className='h-5 w-5' />
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handleDelete(section._id!)}
                  >
                    <TrashBinIcon className='h-5 w-5' />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <ContentSectionModal
          isOpen={isModalOpen}
          onClose={handleClose}
          section={selectedSection}
          onSave={handleSave}
        />
      </div>
    </ComponentCard>
  )
}

