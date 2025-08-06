import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ClockIcon, 
  CalendarIcon,
  FolderIcon,
  DocumentTextIcon,
  FlagIcon
} from '@heroicons/react/24/outline'
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
  { 
    value: 'low', 
    label: '낮음', 
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    icon: ClockIcon,
    description: '여유가 있는 작업'
  },
  { 
    value: 'medium', 
    label: '보통', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: ExclamationTriangleIcon,
    description: '일반적인 작업'
  },
  { 
    value: 'high', 
    label: '높음', 
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: ExclamationTriangleIcon,
    description: '긴급한 작업'
  }
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

  // 마감일 버튼 활성화 상태 확인 함수
  const getDueDateButtonClass = (days: number) => {
    const targetDate = new Date()
    if (days > 0) {
      targetDate.setDate(targetDate.getDate() + days)
    }
    const targetDateString = targetDate.toISOString().split('T')[0]
    
    return dueDate === targetDateString
      ? 'bg-blue-500 text-white border-blue-600'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:border-gray-600'
  }

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
      // 폴더가 하나만 있으면 자동으로 선택
      setSelectedFolderId(folders.length === 1 ? folders[0].id : '')
    }
    setError('')
  }, [task, folders])

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
      formData.append('username', username)
      if (dueDate) {
        formData.append('due_date', dueDate)
      }
      if (selectedFolderId) {
        formData.append('folder_id', selectedFolderId)
      }
      if (mode === 'edit' && task?.id) {
        formData.append('taskId', task.id)
      }

      // 폴더 ID가 있으면 폴더 내 태스크 모달 사용, 없으면 일반 태스크 모달 사용
      const modalUrl = selectedFolderId 
        ? `/folders/${selectedFolderId}/tasks/modal?user=${username}`
        : `/tasks/modal?user=${username}`
      
      const response = await fetch(modalUrl, {
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

  const selectedPriority = priorityOptions.find(p => p.value === priority)
  const selectedFolder = folders.find(f => f.id === selectedFolderId)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'create' ? '새 태스크 만들기' : '태스크 편집'} size="lg">
      <div className="space-y-8">
        {/* 기본 정보 섹션 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
            <DocumentTextIcon className="w-5 h-5 text-blue-600" />
            <span>기본 정보</span>
          </div>
          
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
              설명 (선택사항)
            </label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="태스크에 대한 상세한 설명을 입력하세요"
            />
          </div>
        </div>

        {/* 우선순위 섹션 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
            <FlagIcon className="w-5 h-5 text-orange-600" />
            <span>우선순위</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {priorityOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    priority === option.value
                      ? `${option.color} ring-2 ring-blue-500 ring-opacity-50`
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setPriority(option.value as 'low' | 'medium' | 'high')}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${
                      priority === option.value ? 'text-current' : 'text-gray-400'
                    }`} />
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 마감일 섹션 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
            <CalendarIcon className="w-5 h-5 text-green-600" />
            <span>마감일</span>
          </div>
          
          {/* 빠른 선택 버튼들 */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDueDate(new Date().toISOString().split('T')[0])}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${getDueDateButtonClass(0)}`}
            >
              오늘
            </button>
            <button
              type="button"
              onClick={() => {
                const date = new Date()
                date.setDate(date.getDate() + 3)
                setDueDate(date.toISOString().split('T')[0])
              }}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${getDueDateButtonClass(3)}`}
            >
              3일 후
            </button>
            <button
              type="button"
              onClick={() => {
                const date = new Date()
                date.setDate(date.getDate() + 7)
                setDueDate(date.toISOString().split('T')[0])
              }}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${getDueDateButtonClass(7)}`}
            >
              7일 후
            </button>
            <button
              type="button"
              onClick={() => {
                const date = new Date()
                date.setDate(date.getDate() + 30)
                setDueDate(date.toISOString().split('T')[0])
              }}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${getDueDateButtonClass(30)}`}
            >
              30일 후
            </button>
            <button
              type="button"
              onClick={() => setDueDate('')}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                !dueDate
                  ? 'bg-orange-500 text-white border-orange-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:border-gray-600'
              }`}
            >
              조정
            </button>
          </div>
          
          {/* 수동 입력 필드 */}
          <div className="relative">
            <input
              type="date"
              name="due_date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="마감일을 선택하거나 직접 입력하세요"
            />
            {dueDate && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                선택된 마감일: {new Date(dueDate).toLocaleDateString('ko-KR')}
              </div>
            )}
          </div>
        </div>

        

                 {/* 미리보기 섹션 */}
         {(title || description || selectedPriority || dueDate) && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
              <span>미리보기</span>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                {title && (
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{title}</div>
                    {description && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</div>
                    )}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {selectedPriority && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedPriority.color}`}>
                      <selectedPriority.icon className="w-3 h-3 mr-1" />
                      {selectedPriority.label}
                    </span>
                  )}
                  
                  {dueDate && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {new Date(dueDate).toLocaleDateString('ko-KR')}
                    </span>
                  )}
                  
                  
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <div className="text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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