'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { AlertCircle, LogOut, Menu } from 'lucide-react'
import Link from 'next/link'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
      } else {
        const userRole = user.user_metadata?.role
        /*if (userRole !== 'tecnico') {
          router.push('/auth/login')
        } else {
          setUser(user)
        }*/

          setUser(user)

      }
      setLoading(false)
    }

    checkUser()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/technician/dashboard" className="flex items-center gap-2">
              <AlertCircle className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900">CoolTickets Técnico</h1>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/technician/dashboard">
                <Button variant="ghost">Mi Dashboard</Button>
              </Link>
              <Link href="/technician/tickets">
                <Button variant="ghost">Mis Tickets</Button>
              </Link>
              <div className="relative group">
                <Button variant="ghost">{user?.email}</Button>
                <div className="hidden group-hover:block absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-lg border">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-slate-50 rounded-t-lg flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 mt-8">
                  <Link href="/technician/dashboard">
                    <Button variant="ghost" className="w-full justify-start">
                      Mi Dashboard
                    </Button>
                  </Link>
                  <Link href="/technician/tickets">
                    <Button variant="ghost" className="w-full justify-start">
                      Mis Tickets
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
