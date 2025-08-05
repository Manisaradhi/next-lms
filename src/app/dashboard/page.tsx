'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useSession from '@/hooks/useSession'
import { supabase } from '@/lib/supabaseClient'

type Lesson = {
  id: string
  title: string
  description: string
}

export default function Dashboard() {
  const router = useRouter()
  const { session, loading } = useSession()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [fetching, setFetching] = useState(true)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [modalLoading, setModalLoading] = useState(false)

  useEffect(() => {
    if (!loading && !session) {
      router.push('/login')
    }
  }, [session, loading, router])

  const fetchData = async () => {
    if (!session) return

    setFetching(true)
    const [{ data: lessonsData }, { data: completedData }] = await Promise.all([
      supabase.from('lessons').select('*'),
      supabase.from('completed_lessons').select('lesson_id').eq('student_id', session.user.id),
    ])

    setLessons(lessonsData || [])
    setCompletedLessons(completedData?.map((item) => item.lesson_id) || [])
    setFetching(false)
  }

  useEffect(() => {
    fetchData()
  }, [session])

  const confirmCompletion = async () => {
    if (!session || !selectedLesson) return
  
    setModalLoading(true)
  
    // Convert current time to Asia/Kolkata manually
    const now = new Date()
    const utcOffsetInMinutes = 330 // IST is UTC+5:30 = 330 minutes
    const istTimestamp = new Date(now.getTime() + utcOffsetInMinutes * 60000).toISOString()
  
    const { error } = await supabase.from('completed_lessons').insert([
      {
        student_id: session.user.id,
        lesson_id: selectedLesson.id,
        completed_at: istTimestamp, // IST-based timestamp
      },
    ])
  
    if (!error) {
      setSelectedLesson(null)
      await fetchData()
    }
  
    setModalLoading(false)
  }  

  if (loading || fetching)
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )

  if (!session) return <div className="p-4 text-gray-600">Redirecting...</div>

  const pendingLessons = lessons.filter((lesson) => !completedLessons.includes(lesson.id))

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto relative">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
        Welcome, <span className="text-blue-600 break-words">{session.user.email}</span>
      </h1>

      <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-6 border-b pb-2">Your Lessons</h2>

      {pendingLessons.length === 0 ? (
        <div className="text-center text-gray-500 text-sm bg-white p-6 rounded-lg shadow-sm">
          🎉 You're all caught up!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {pendingLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{lesson.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{lesson.description}</p>
              </div>
              <button
                onClick={() => setSelectedLesson(lesson)}
                className="mt-4 self-start cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                ✅ Mark as Complete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 relative">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Completion</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to mark <strong>{selectedLesson.title}</strong> as completed?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedLesson(null)}
                className="px-4 py-2 text-sm cursor-pointer bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmCompletion}
                disabled={modalLoading}
                className="px-4 py-2 text-sm cursor-pointer bg-blue-600 text-white hover:bg-blue-700 rounded-md flex items-center justify-center"
              >
                {modalLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : null}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
