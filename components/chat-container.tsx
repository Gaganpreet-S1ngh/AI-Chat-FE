'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { SettingsModal } from './settings-modal'
import { applyTheme } from './theme-provider'

interface Message {
  role: 'user' | 'assistant'
  content: string
  attachments?: Array<{ name: string; size: number }>
  timestamp: Date
}

interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  apiUrl: string
  userName: string
  fontSize: 'small' | 'medium' | 'large'
  notifications: boolean
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  apiUrl: 'http://localhost:8000',
  userName: 'User',
  fontSize: 'medium',
  notifications: true,
}

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your AI assistant. I'm ready to help you with any questions or tasks. You can also upload files for me to analyze.",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('system')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedSettings = localStorage.getItem('chatSettings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(parsed)
        setCurrentTheme(parsed.theme)
        applyTheme(parsed.theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : parsed.theme)
      } catch {
        console.error('[v0] Failed to parse saved settings')
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSettingsChange = (newSettings: UserSettings) => {
    setSettings(newSettings)
    setCurrentTheme(newSettings.theme)
    localStorage.setItem('chatSettings', JSON.stringify(newSettings))
    
    if (newSettings.theme === 'system') {
      applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    } else {
      applyTheme(newSettings.theme)
    }
  }

  const handleSendMessage = async (messageText: string, files?: File[]) => {
    if (!messageText.trim() && !files?.length) return

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: messageText,
      attachments: files?.map((f) => ({ name: f.name, size: f.size })),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Create FormData for file upload if there are files
      const formData = new FormData()
      formData.append('message', messageText)
      files?.forEach((file) => formData.append('files', file))

      // Send to backend
      const response = await fetch(`${settings.apiUrl}/chat`, {
        method: 'POST',
        body: files?.length ? formData : JSON.stringify({ message: messageText }),
        headers: files?.length ? undefined : { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      // Add AI response
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      
      if (settings.notifications) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('AI Response', { body: 'Your AI assistant has responded' })
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Add error message
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ Error: Unable to connect to the backend. Make sure your local AI service is running at ' + settings.apiUrl,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">AI Chat Assistant</h1>
              <p className="text-xs text-muted-foreground">Chatting with {settings.userName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newTheme = currentTheme === 'dark' ? 'light' : currentTheme === 'light' ? 'system' : 'dark'
                handleSettingsChange({ ...settings, theme: newTheme })
              }}
              className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              title="Toggle theme"
            >
              {currentTheme === 'dark' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.22 4.22a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm11.313 1.414a1 1 0 010-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707a1 1 0 01-1.414 0zM10 7a3 3 0 100 6 3 3 0 000-6zm-7 3a1 1 0 11-2 0 1 1 0 012 0zm16 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              title="Settings"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => setMessages([{ role: 'assistant', content: "Hello! I'm your AI assistant. How can I help you today?", timestamp: new Date() }])}
              className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              title="Clear chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.map((msg, idx) => (
            <ChatMessage
              key={idx}
              role={msg.role}
              content={msg.content}
              attachments={msg.attachments}
              timestamp={msg.timestamp}
              userName={settings.userName}
            />
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
              </div>
              <div className="bg-secondary text-secondary-foreground rounded-lg rounded-bl-none px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="border-t border-border bg-card/80 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          <p className="text-xs text-muted-foreground text-center mt-3">
            This chat connects to your local AI backend at {settings.apiUrl}. Update in settings if needed.
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  )
}
