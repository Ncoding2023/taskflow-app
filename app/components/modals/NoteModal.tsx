import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { 
  DocumentTextIcon,
  FolderIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentIcon
} from '@heroicons/react/24/outline'
import { useToastContext } from '~/contexts/ToastContext'

interface Note {
  id?: string
  title: string
  content: string
  folder_id?: string
}

interface Folder {
  id: string
  name: string
  color: string
}

interface NoteModalProps {
  isOpen: boolean
  onClose: () => void
  note?: Note
  mode: 'create' | 'edit'
  username: string
  folders: Folder[]
}

const NoteModal = ({ isOpen, onClose, note, mode, username, folders }: NoteModalProps) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedFolderId, setSelectedFolderId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const { showError, showSuccess } = useToastContext()

  // note prop이 변경될 때마다 상태 업데이트
  useEffect(() => {
    if (note) {
      setTitle(note.title || '')
      setContent(note.content || '')
      setSelectedFolderId(note.folder_id || '')
    } else {
      setTitle('')
      setContent('')
      setSelectedFolderId('')
    }
    setError('')
  }, [note])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('action', mode)
      formData.append('title', title)
      formData.append('content', content)
      if (selectedFolderId) {
        formData.append('folder_id', selectedFolderId)
      }
      if (mode === 'edit' && note?.id) {
        formData.append('noteId', note.id)
      }

      const response = await fetch(`/notes/modal?user=${username}`, {
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

  const selectedFolder = folders.find(f => f.id === selectedFolderId)

  // 간단한 마크다운 렌더링 (기본적인 기능만)
  const renderMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-xl font-bold text-gray-900 dark:text-white mb-2">{line.substring(2)}</h1>
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{line.substring(3)}</h2>
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-md font-medium text-gray-900 dark:text-white mb-2">{line.substring(4)}</h3>
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-4 text-gray-700 dark:text-gray-300">{line.substring(2)}</li>
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="font-bold text-gray-900 dark:text-white mb-2">{line.substring(2, line.length - 2)}</p>
        }
        if (line.trim() === '') {
          return <br key={index} />
        }
        return <p key={index} className="text-gray-700 dark:text-gray-300 mb-2">{line}</p>
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'create' ? '새 노트 만들기' : '노트 편집'} size="lg">
      <div className="space-y-8">
        {/* 기본 정보 섹션 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
            <DocumentTextIcon className="w-5 h-5 text-blue-600" />
            <span>기본 정보</span>
          </div>
          
          <Input
            label="노트 제목"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="노트 제목을 입력하세요"
            required
          />
        </div>

        {/* 내용 섹션 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
              <DocumentIcon className="w-5 h-5 text-green-600" />
              <span>내용</span>
            </div>
            
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {showPreview ? (
                <>
                  <EyeSlashIcon className="w-4 h-4" />
                  <span>편집 모드</span>
                </>
              ) : (
                <>
                  <EyeIcon className="w-4 h-4" />
                  <span>미리보기</span>
                </>
              )}
            </button>
          </div>
          
          {showPreview ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 min-h-[200px]">
              {content ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {renderMarkdown(content)}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">내용을 입력하면 여기에 미리보기가 표시됩니다.</p>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                내용 (마크다운 지원)
              </label>
              <textarea
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                placeholder={`노트 내용을 입력하세요. 마크다운을 지원합니다.

예시:
# 제목
## 부제목
- 목록 항목
**굵은 텍스트**`}
                required
              />
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                마크다운 문법: # 제목, ## 부제목, - 목록, **굵은 텍스트**
              </div>
            </div>
          )}
        </div>

        

                 {/* 미리보기 섹션 */}
         {(title || content) && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
              <DocumentTextIcon className="w-5 h-5 text-green-600" />
              <span>노트 미리보기</span>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                {title && (
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-lg">{title}</div>
                    {content && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
                        {content.length > 150 ? content.substring(0, 150) + '...' : content}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  
                  
                  {content && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      <DocumentIcon className="w-3 h-3 mr-1" />
                      {content.length}자
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
              {isSubmitting ? '저장 중...' : mode === 'create' ? '노트 만들기' : '저장'}
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

export default NoteModal 