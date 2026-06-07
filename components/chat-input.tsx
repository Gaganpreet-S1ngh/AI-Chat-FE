'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface ChatInputProps {
  onSendMessage: (message: string, files?: File[]) => Promise<void>
  isLoading?: boolean
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() && files.length === 0) return

    await onSendMessage(message, files)
    setMessage('')
    setFiles([])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    const newFiles = Array.from(e.dataTransfer.files || [])
    setFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2 text-sm">
              <svg className="w-4 h-4 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              <span className="flex-1 truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative flex gap-2 p-3 rounded-lg border-2 transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card hover:bg-secondary/50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 p-2 hover:bg-secondary rounded-lg transition-colors"
          title="Upload files"
        >
          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask your AI anything... (or drag files here)"
          className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground text-sm"
          disabled={isLoading}
        />

        <Button
          type="submit"
          disabled={isLoading || (!message.trim() && files.length === 0)}
          className="flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} opacity="0.25" />
              <path
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.488 5.951 1.488a1 1 0 001.169-1.409l-7-14z" />
            </svg>
          )}
        </Button>
      </div>
    </form>
  )
}
