'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(email: string, password: string, name: string) {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
      data: {
        name,
      },
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  // Create user profile
  const { error: profileError } = await supabase.from('users').insert({
    id: authData.user?.id,
    email,
    name,
    role: 'viewer', // default role
  })

  if (profileError) {
    return { error: profileError.message }
  }

  return { success: true }
}

export async function signIn(email: string, password: string) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        error: error.message || 'Authentication failed',
      }
    }

    if (!data?.session) {
      return {
        success: false,
        error: 'No session created',
      }
    }

    return {
      success: true,
      error: null,
    }
  } catch (err) {
    let message = 'An unexpected error occurred'
    if (err instanceof Error) {
      message = err.message
    }
    return {
      success: false,
      error: message,
    }
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

export async function getCurrentUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}
