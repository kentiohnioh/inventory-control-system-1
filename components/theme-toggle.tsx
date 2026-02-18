'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun, Droplet } from 'lucide-react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    console.log('Current theme:', theme) // Debug log
  }, [theme])

  if (!mounted) {
    return null
  }

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('glass')
    else setTheme('light')
  }

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1"
      aria-label="Toggle theme"
    >
      {theme === 'light' && <Sun className="h-5 w-5" />}
      {theme === 'dark' && <Moon className="h-5 w-5" />}
      {theme === 'glass' && <Droplet className="h-5 w-5 text-blue-400" />}
      <span className="text-xs ml-1 opacity-50">{theme}</span> {/* Debug text */}
    </button>
  )
}