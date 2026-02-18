'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setLoading(false)
    } else {
      router.push('/')
    }
  }, [router])

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  if (!user) return null

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header with theme toggle */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-end px-6">
          <ThemeToggle />
        </header>
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}