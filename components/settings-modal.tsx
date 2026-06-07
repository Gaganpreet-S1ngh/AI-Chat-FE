'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  apiUrl: string
  userName: string
  fontSize: 'small' | 'medium' | 'large'
  notifications: boolean
}

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: UserSettings
  onSettingsChange: (settings: UserSettings) => void
}

export function SettingsModal({ isOpen, onClose, settings, onSettingsChange }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings)

  const handleSave = () => {
    onSettingsChange(localSettings)
    onClose()
  }

  const handleReset = () => {
    setLocalSettings(settings)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Settings
            </h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* User Settings */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">Your Name</label>
              <input
                type="text"
                value={localSettings.userName}
                onChange={(e) => setLocalSettings({ ...localSettings, userName: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-border rounded-lg bg-secondary/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
            </div>

            {/* API URL */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">Backend API URL</label>
              <input
                type="text"
                value={localSettings.apiUrl}
                onChange={(e) => setLocalSettings({ ...localSettings, apiUrl: e.target.value })}
                placeholder="http://localhost:8000"
                className="w-full px-3 py-2 border border-border rounded-lg bg-secondary/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors text-sm"
              />
              <p className="text-xs text-muted-foreground">Update your AI backend URL here</p>
            </div>

            {/* Theme Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'system'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setLocalSettings({ ...localSettings, theme })}
                    className={`py-2 px-3 rounded-lg font-medium text-sm transition-colors capitalize border-2 ${
                      localSettings.theme === theme
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-secondary/30 text-foreground hover:border-primary/50'
                    }`}
                  >
                    {theme === 'light' && '☀️'} {theme === 'dark' && '🌙'} {theme === 'system' && '🖥️'} {theme}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">Font Size</label>
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setLocalSettings({ ...localSettings, fontSize: size })}
                    className={`py-2 px-3 rounded-lg font-medium text-sm transition-colors capitalize border-2 ${
                      localSettings.fontSize === size
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-secondary/30 text-foreground hover:border-primary/50'
                    }`}
                  >
                    {size === 'small' && 'A'} {size === 'medium' && 'A'} {size === 'large' && 'A'}{' '}
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.notifications}
                  onChange={(e) => setLocalSettings({ ...localSettings, notifications: e.target.checked })}
                  className="w-4 h-4 rounded border-border bg-secondary/30 text-primary cursor-pointer accent-primary"
                />
                <span className="text-sm font-medium text-foreground">Enable notifications</span>
              </label>
              <p className="text-xs text-muted-foreground">Get notified when your AI responds</p>
            </div>

            {/* About */}
            <div className="bg-secondary/30 rounded-lg p-4 border border-border">
              <p className="text-xs text-muted-foreground">
                <strong>AI Chat Assistant</strong>
                <br />
                Version 1.0.0
                <br />
                Built with Next.js and React
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-card border-t border-border p-4 flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-border hover:bg-secondary"
            >
              Reset
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
