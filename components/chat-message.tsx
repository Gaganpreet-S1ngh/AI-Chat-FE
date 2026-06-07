'use client'

import { useEffect, useState } from 'react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  attachments?: Array<{ name: string; size: number }>
  timestamp: Date
  userName?: string
}

export function ChatMessage({ role, content, attachments, timestamp, userName = 'User' }: ChatMessageProps) {
  const [displayedContent, setDisplayedContent] = useState('')
  const isUser = role === 'user'

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  useEffect(() => {
    if (isUser) {
      setDisplayedContent(content)
      return
    }

    // Simulate streaming effect for AI responses
    let index = 0
    const timer = setInterval(() => {
      setDisplayedContent(content.substring(0, index + 1))
      index++
      if (index >= content.length) {
        clearInterval(timer)
      }
    }, 5)

    return () => clearInterval(timer)
  }, [content, isUser])

  return (
    <div className={`flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-white">AI</span>
          </div>
        </div>
      )}
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-white">{getInitials(userName)}</span>
          </div>
        </div>
      )}
      <div className={`flex flex-col ${isUser ? 'items-end' : ''} max-w-xs lg:max-w-md`}>
        <div
          className={`px-4 py-3 rounded-lg ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-none'
              : 'bg-secondary text-secondary-foreground rounded-bl-none'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{displayedContent}</p>
          {attachments && attachments.length > 0 && !isUser && (
            <div className="mt-3 pt-3 border-t border-current/10 space-y-2">
              {attachments.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs opacity-75">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                  </svg>
                  {file.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <span className={`text-xs text-muted-foreground mt-1 px-2 ${isUser ? 'text-right' : 'text-left'}`}>{formatTime(timestamp)}</span>
      </div>
    </div>
  )
}
