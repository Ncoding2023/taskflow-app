import { Form, useActionData, useNavigation } from '@remix-run/react'
import { useState, useEffect } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { useToastContext } from '~/contexts/ToastContext'

interface Task {
  id?: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  folder_id?: string
}

interface Folder {
  id?: string
  name?: string
  color?: string
}

interface TaskFormProps {
  task?: Task
  folders: Folder[]
  mode: 'create' | 'edit'
}

const priorityOptions = [
  { value: 'low', label: '낮음', color: 'text-gray-500' },
  { value: 'medium', label: '보통', color: 'text-yellow-600' },
  { value: 'high', label: '높음', color: 'text-red-600' }
]

const TaskForm = ({ task, folders, mode }: TaskFormProps) => {
  const actionData = useActionData<any>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'
  const { showError } = useToastContext()
  
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(task?.priority || 'medium')
  const [dueDate, setDueDate] = useState(task?.due_date ? task.due_date.split('T')[0] : '')
  const [selectedFolderId, setSelectedFolderId] = useState(task?.folder_id || '')

  // 액션 결과에 따른 토스트 표시
  useEffect(() => {
    if (actionData?.error) {
      showError('오류 발생', actionData.error)
    }
  }, [actionData, showError])

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {mode === 'create' ? '새 태스크 만들기' : '태스크 편집'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {mode === 'create' ? '새로운 태스크를 만들어보세요.' : '태스크 정보를 수정하세요.'}
        </p>
      </div>

      <Form method="post" className="space-y-6">
        <Input
          label="태스크 제목"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="태스크 제목을 입력하세요"
          required
          error={actionData?.errors?.title}
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
            placeholder="태스크에 대한 자세한 설명을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            우선순위
          </label>
          <div className="grid grid-cols-3 gap-2">
            {priorityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                  priority === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onClick={() => setPriority(option.value as 'low' | 'medium' | 'high')}
              >
                {option.label}
              </button>
            ))}
          </div>
          <input type="hidden" name="priority" value={priority} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            마감일 (선택사항)
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
            <option value="">폴더 없음</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        {actionData?.error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <div className="text-sm text-red-700 dark:text-red-400">
              {actionData.error}
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
            onClick={() => window.history.back()}
            className="flex-1"
          >
            취소
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default TaskForm 