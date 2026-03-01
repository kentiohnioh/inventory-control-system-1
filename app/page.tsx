'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@gmail.com')
  const [password, setPassword] = useState('rupp2025')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simple hardcoded credentials
    const validEmails = ['admin@gmail.com', 'manager@gmail.com', 'stock@gmail.com', 'viewer@gmail.com']

    if (validEmails.includes(email) && password === 'rupp2025') {
      const role = email.split('@')[0]
      localStorage.setItem('user', JSON.stringify({ email, role }))
      setTimeout(() => router.push('/dashboard'), 500)
    } else {
      setError('Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 p-4 overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>

      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-xl p-8">
        <h1 className="text-center text-3xl font-bold text-white mb-8">
          Inventory Control System
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="backdrop-blur-md bg-white/10 border border-white/20 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white/90 mb-2">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="backdrop-blur-md bg-white/10 border border-white/20 text-white"
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-400/40 text-red-100 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        {/* <div className="mt-6 p-3 bg-white/5 rounded text-center text-xs text-white/70">
          <p className="font-semibold mb-2">Test Credentials:</p>
          <p>admin@gmail.com</p>
          <p>manager@gmail.com</p>
          <p>stock@gmail.com</p>
          <p>viewer@gmail.com</p>
          <p className="mt-2 text-blue-200 font-semibold">Password: rupp2025</p>
        </div> */}
      </div>
    </div>
  )
}
