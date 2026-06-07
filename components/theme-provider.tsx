'use client'

import { useEffect, useState } from 'react'

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Get theme from localStorage or system preference
    const theme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    const resolvedTheme = theme === 'system' || !theme ? getSystemTheme() : theme

    applyTheme(resolvedTheme)

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const currentTheme = localStorage.getItem('theme')
      if (currentTheme === 'system' || !currentTheme) {
        applyTheme(getSystemTheme())
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme: 'light' | 'dark') {
  const html = document.documentElement

  if (theme === 'dark') {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}
