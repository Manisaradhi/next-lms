'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import useSession from '@/hooks/useSession'

type Lesson = {
  id: string
  title: string
  description: string
  completed_at: string
}

export default function CompletedLessons() {
  const { session, loading } = useSession()
  const [completedLessons, setCompletedLessons] = useState<Lesson[]>([])
  const [fetching, setFetching] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !session) {
      router.push('/login')
    }
  }, [session, loading, router])

  useEffect(() => {
    const fetchCompletedLessons = async () => {
      if (!session) return

      const { data, error } = await supabase
        .from('completed_lessons')
        .select(`
          completed_at,
          lesson:lessons (
            id,
            title,
            description
          )
        `)
        .eq('student_id', session.user.id)

      if (error) {
        console.error('Error fetching completed lessons:', error)
        return
      }

      const formatted = (data || []).map((item: any) => ({
        id: item.lesson.id,
        title: item.lesson.title,
        description: item.lesson.description,
        completed_at: item.completed_at,
      }))

      setCompletedLessons(formatted)
      setFetching(false)
    }

    fetchCompletedLessons()
  }, [session])

  if (loading || fetching)
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">✅ Completed Lessons</h1>

      {completedLessons.length === 0 ? (
        <div className="text-center text-gray-500 text-sm bg-white p-6 rounded-lg shadow-sm">
          You haven’t completed any lessons yet.
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {completedLessons.map((lesson) => (
            <li
              key={lesson.id}
              className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-2"
            >
              <h2 className="text-lg font-semibold text-gray-800">{lesson.title}</h2>
              <p className="text-sm text-gray-600">{lesson.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                📅 Completed on{' '}
                {new Date(lesson.completed_at).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                  timeZone: 'Asia/Kolkata',
                })}
              </p>

            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
