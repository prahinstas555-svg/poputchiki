'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ChatsPage() {
  const router = useRouter()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      // Кто я?
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Берём все сообщения, где я отправитель ИЛИ получатель
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (!msgs || msgs.length === 0) {
        setLoading(false)
        return
      }

      // Собираем уникальные ID поездок (последнее сообщение по каждой)
      const seen = new Set()
      const uniqueTrips = []
      for (const m of msgs) {
        if (!seen.has(m.trip_id)) {
          seen.add(m.trip_id)
          uniqueTrips.push(m) // это последнее сообщение (т.к. отсортировано)
        }
      }

      // Загружаем данные поездок
      const tripIds = uniqueTrips.map((t) => t.trip_id)
      const { data: trips } = await supabase
        .from('trips')
        .select('*')
        .in('id', tripIds)

      // Собираем финальный список
      const result = uniqueTrips.map((msg) => {
        const trip = trips?.find((t) => t.id === msg.trip_id)
        return {
          tripId: msg.trip_id,
          lastText: msg.text,
          trip: trip,
        }
      })

      setChats(result)
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-cyan-50/40">
        <p className="text-slate-500">Загружаю чаты...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-cyan-50/40 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <a href="/trips" className="text-[#0e6ba8] font-semibold">← К поездкам</a>

        <h1 className="text-3xl font-black text-[#0a3d5c] mt-4 mb-8">
          Мои чаты 💬
        </h1>

        {chats.length === 0 && (
          <p className="text-center text-slate-400 mt-10">
            У вас пока нет переписок. Напишите кому-нибудь на странице поездок! 👋
          </p>
        )}

        <div className="flex flex-col gap-3">
          {chats.map((chat) => (
            <a
              key={chat.tripId}
              href={`/chat/${chat.tripId}`}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-cyan-200 transition block"
            >
              <div className="font-bold text-[#0a3d5c]">
                {chat.trip
                  ? `${chat.trip.from_city} → ${chat.trip.to_city}`
                  : 'Поездка удалена'}
              </div>
              <div className="text-sm text-slate-400 mt-1 truncate">
                {chat.lastText}
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}