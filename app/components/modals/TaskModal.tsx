import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { useToastContext } from '~/contexts/ToastContext'

interface Task {
  id?: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  folder_id?: string
}

interface Folder {
  id: string
  name: string
  color: string
}

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task
  mode: 'create' | 'edit'
  username: string
  folders: Folder[]
}

const priorityOptions = [
  { value: 'low', label: '낮음', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: '보통', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: '높음', color: 'bg-red-100 text-red-800' }
]

const TaskModal = ({ isOpen, onClose, task, mode, username, folders }: TaskModalProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [dueDate, setDueDate] = useState('')
  const [selectedFolderId, setSelectedFolderId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { showError, showSuccess } = useToastContext()

  // task prop이 변경될 때마다 상태 업데이트
  useEffect(() => {
    if (task) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      setPriority(task.priority || 'medium')
      setDueDate(task.due_date ? task.due_date.split('T')[0] : '')
      setSelectedFolderId(task.folder_id || '')
    } else {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setDueDate('')
      setSelectedFolderId('')
    }
    setError('')
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('action', mode)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('priority', priority)
      if (dueDate) {
        formData.append('due_date', dueDate)
      }
      if (selectedFolderId) {
        formData.append('folder_id', selectedFolderId)
      }
      if (mode === 'edit' && task?.id) {
        formData.append('taskId', task.id)
      }

      const response = await fetch(`/tasks/modal?user=${username}`, {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.error) {
        setError(result.error)
        showError('오류 발생', result.error)
      } else if (result.success) {
        showSuccess('성공', result.message)
        onClose()
        // 페이지 새로고침으로 데이터 업데이트
        window.location.reload()
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.')
      showError('오류 발생', '서버 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'create' ? '새 태스크 만들기' : '태스크 편집'}>
      <div className="space-y-6">
        <p className="text-gray-600 dark:text-gray-400">
          {mode === 'create' ? '새로운 태스크를 만들어보세요.' : '태스크 정보를 수정하세요.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="태스크 제목"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="태스크 제목을 입력하세요"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              설명
            </label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="태스크에 대한 설명을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              우선순위
            </label>
            <div className="flex space-x-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    priority === option.value
                      ? `${option.color} border-2 border-blue-500`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => setPriority(option.value as 'low' | 'medium' | 'high')}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              마감일
            </label>
            <input
              type="date"
              name="due_date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              폴더 (선택사항)
            </label>
            <select
              name="folder_id"
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">폴더 선택 안함</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? '저장 중...' : mode === 'create' ? '태스크 만들기' : '저장'}
            </Button>
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              취소
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default TaskModal 