'use client'

import { createClient } from '@/lib/supabase/client'

export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function isAdmin(userId: string) {
  const profile = await getUserProfile(userId)
  return profile?.role === 'administrador'
}

export async function isTechnician(userId: string) {
  const profile = await getUserProfile(userId)
  return profile?.role === 'tecnico'
}

export async function isClient(userId: string) {
  const profile = await getUserProfile(userId)
  return profile?.role === 'cliente'
}

export async function logout() {
  const supabase = createClient()
  return await supabase.auth.signOut()
}
