import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'create' ? '새 노트 만들기' : '노트 편집'} size="lg">
      <div className="space-y-6">
        <p className="text-gray-600 dark:text-gray-400">
          {mode === 'create' ? '새로운 노트를 만들어보세요.' : '노트 정보를 수정하세요.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="노트 제목"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="노트 제목을 입력하세요"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              내용
            </label>
            <textarea
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="노트 내용을 입력하세요"
              required
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