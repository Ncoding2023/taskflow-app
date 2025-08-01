import React, { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { useToastContext } from '~/contexts/ToastContext'

interface Folder {
  id?: string
  name: string
  color: string
}

interface FolderModalProps {
  isOpen: boolean
  onClose: () => void
  folder?: Folder
  mode: 'create' | 'edit'
  username: string
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

const FolderModal = ({ isOpen, onClose, folder, mode, username }: FolderModalProps) => {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#3B82F6')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { showError, showSuccess } = useToastContext()

  // folder prop이 변경될 때마다 상태 업데이트
  useEffect(() => {
    if (folder) {
      setName(folder.name || '')
      setColor(folder.color || '#3B82F6')
    } else {
      setName('')
      setColor('#3B82F6')
    }
    setError('')
  }, [folder])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('action', mode)
      formData.append('name', name)
      formData.append('color', color)
      if (mode === 'edit' && folder?.id) {
        formData.append('folderId', folder.id)
      }

      const response = await fetch(`/folders/modal?user=${username}`, {
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

  const handleColorSelect = (selectedColor: string) => {
    setColor(selectedColor)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'create' ? '새 폴더 만들기' : '폴더 편집'}>
      <div className="space-y-6">
        <p className="text-gray-600 dark:text-gray-400">
          {mode === 'create' ? '태스크와 노트를 정리할 폴더를 만드세요.' : '폴더 정보를 수정하세요.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="폴더 이름"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 업무, 개인, 프로젝트"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              폴더 색상
            </label>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    color === colorOption
                      ? 'border-gray-900 dark:border-white scale-110' 
                      : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: colorOption }}
                  onClick={() => handleColorSelect(colorOption)}
                />
              ))}
            </div>
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
              {isSubmitting ? '저장 중...' : mode === 'create' ? '폴더 만들기' : '저장'}
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

export default FolderModal 