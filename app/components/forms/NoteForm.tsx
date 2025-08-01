import { Form, useActionData, useNavigation } from '@remix-run/react'
import { useEffect } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { useToastContext } from '~/contexts/ToastContext'

interface Note {
  id?: string
  title: string
  content?: string
  folder_id?: string
}

interface Folder {
  id?: string
  name?: string
  color?: string
}

interface NoteFormProps {
  note?: Note
  folders: Folder[]
  mode: 'create' | 'edit'
}

const NoteForm = ({ note, folders, mode }: NoteFormProps) => {
  const actionData = useActionData<any>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'
  const { showError } = useToastContext()

  // 액션 결과에 따른 토스트 표시
  useEffect(() => {
    if (actionData?.error) {
      showError('오류 발생', actionData.error)
    }
  }, [actionData, showError])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {mode === 'create' ? '새 노트 만들기' : '노트 편집'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {mode === 'create' ? '새로운 노트를 만들어보세요.' : '노트 내용을 수정하세요.'}
        </p>
      </div>

      <Form method="post" className="space-y-6">
        <Input
          label="노트 제목"
          name="title"
          defaultValue={note?.title || ''}
          placeholder="노트 제목을 입력하세요"
          required
          error={actionData?.errors?.title}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            내용
          </label>
          <textarea
            name="content"
            defaultValue={note?.content || ''}
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
            placeholder="노트 내용을 입력하세요. 마크다운 형식을 지원합니다.

예시:
# 제목
## 부제목
- 목록 항목
- 또 다른 항목

**굵은 글씨**와 *기울임꼴*도 사용할 수 있습니다.

```javascript
// 코드 블록도 지원
function hello() {
  console.log('Hello, World!');
}
```"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            마크다운 형식을 지원합니다. 제목(#), 목록(-), 굵은 글씨(**), 기울임꼴(*), 코드 블록(```) 등을 사용할 수 있습니다.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            폴더 (선택사항)
          </label>
          <select
            name="folder_id"
            defaultValue={note?.folder_id || ''}
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
            {isSubmitting ? '저장 중...' : mode === 'create' ? '노트 만들기' : '저장'}
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

export default NoteForm 