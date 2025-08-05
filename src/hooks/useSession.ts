'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Session = {
  user: {
    id: string
    email?: string
  }
}

export default function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        const { id, email } = data.session.user
        setSession({ user: { id, email } })
      }
      setLoading(false)
    })
  }, [])

  return { session, loading }
}
