import { useState, useEffect } from 'react'
import { ThemeSettings } from '../lib/types'

const defaultTheme: ThemeSettings = {
  colorScheme: 'system',
  primaryColor: 'indigo',
  fontSize: 'medium',
  showPreviewContent: false,
  cardStyle: 'minimal'
}

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('theme-settings')
    return saved ? JSON.parse(saved) : defaultTheme
  })

  useEffect(() => {
    localStorage.setItem('theme-settings', JSON.stringify(theme))

    // Apply theme classes to root element
    const root = document.documentElement

    // Color scheme
    if (
      theme.colorScheme === 'dark' ||
      (theme.colorScheme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Font size
    root.classList.remove('text-sm', 'text-base', 'text-lg')
    switch (theme.fontSize) {
      case 'small':
        root.classList.add('text-sm')
        break
      case 'large':
        root.classList.add('text-lg')
        break
      default:
        root.classList.add('text-base')
    }

    // Primary color
    root.setAttribute('data-primary', theme.primaryColor)
  }, [theme])

  return { theme, setTheme }
}
