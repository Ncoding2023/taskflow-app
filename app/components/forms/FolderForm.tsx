import { Form, useActionData, useNavigation } from '@remix-run/react'
import { useState, useEffect } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { useToastContext } from '~/contexts/ToastContext'

interface Folder {
  id?: string
  name: string
  color: string
}

interface FolderFormProps {
  folder?: Folder
  mode: 'create' | 'edit'
}

const colorOptions = [
  '#3B82F6', // blue
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // yellow
  '#8B5CF6', // purple
  '#F97316', // orange
  '#06B6D4', // cyan
  '#EC4899', // pink
  '#84CC16', // lime
  '#6B7280', // gray
]

const FolderForm = ({ folder, mode }: FolderFormProps) => {
  const actionData = useActionData<any>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'
  const { showSuccess, showError } = useToastContext()
  
  const [selectedColor, setSelectedColor] = useState(folder?.color || '#3B82F6')
  const [name, setName] = useState(folder?.name || '')

  // 액션 결과에 따른 토스트 표시
  useEffect(() => {
    if (actionData?.error) {
      showError('오류 발생', actionData.error)
    }
  }, [actionData, showError])

  // 폼 제출 성공 시 토스트 표시 (리다이렉트 후 URL 파라미터로 처리되므로 제거)

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {mode === 'create' ? '새 폴더 만들기' : '폴더 편집'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {mode === 'create' ? '태스크와 노트를 정리할 폴더를 만드세요.' : '폴더 정보를 수정하세요.'}
        </p>
      </div>

      <Form method="post" className="space-y-6">
        <Input
          label="폴더 이름"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 업무, 개인, 프로젝트"
          required
          error={actionData?.errors?.name}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            폴더 색상
          </label>
          <div className="grid grid-cols-5 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                  selectedColor === color 
                    ? 'border-gray-900 dark:border-white scale-110' 
                    : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
          <input type="hidden" name="color" value={selectedColor} />
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
            {isSubmitting ? '저장 중...' : mode === 'create' ? '폴더 만들기' : '저장'}
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

export default FolderForm 