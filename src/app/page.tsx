'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        router.replace('/dashboard')
      } else {
        router.replace('/login')
      }
    }

    checkSession().finally(() => setChecking(false))
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <Loader2 className="animate-spin w-5 h-5 text-blue-500" />
        Loading...
      </div>
    </div>
  )
}
