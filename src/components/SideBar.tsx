'use client'

import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { useEffect, useRef, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, LogOut, LayoutDashboard, CheckCircle } from 'lucide-react'

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [sidebarOpen])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const getUserName = () => {
    if (!user?.email) return 'Student'
    const namePart = user.email.split('@')[0]
    return namePart.charAt(0).toUpperCase() + namePart.slice(1)
  }

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* 🔹 Header */}
      <header className="bg-white shadow px-6 py-3 flex justify-between items-center z-50 fixed top-0 left-0 right-0">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700 cursor-pointer">
            <Menu size={24} />
          </button>
          <span className="text-xl font-semibold text-gray-800">LMS</span>
        </div>
        <div className="text-sm text-gray-600">
          {user && `Hello, ${getUserName()}`}
        </div>
      </header>

      {/* 🔹 Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-white/50 backdrop-blur-sm transition-opacity" />
      )}

      {/* 🔹 Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full z-50 bg-gray-900 text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } w-64 p-5 shadow-lg`}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-semibold text-white">{getUserName()}</span>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-3 mt-4">
          {user && (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 hover:border-l-4 hover:border-blue-400 transition-all"
                onClick={() => setSidebarOpen(false)}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/dashboard/completed"
                className="flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 hover:border-l-4 hover:border-green-400 transition-all"
                onClick={() => setSidebarOpen(false)}
              >
                <CheckCircle size={18} />
                <span>Completed Lessons</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 rounded text-left hover:bg-gray-800 hover:border-l-4 hover:border-red-400 transition-all"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          )}
        </nav>
      </aside>

      {/* 🔹 Page Content */}
      <main className="flex-1 bg-gray-100 p-6 pt-20 z-0">{children}</main>
    </div>
  )
}
