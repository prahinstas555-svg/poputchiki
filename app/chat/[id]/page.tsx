'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const tripId = params.id

  const [me, setMe] = useState(null)          // текущий пользователь
  const [trip, setTrip] = useState(null)       // данные поездки
  const [messages, setMessages] = useState([]) // список сообщений
  const [text, setText] = useState('')         // текст в поле ввода
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  // 1. Загружаем всё при открытии страницы
  useEffect(() => {
    async function init() {
      // Кто я?
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Сначала войдите в аккаунт')
        router.push('/login')
        return
      }
      setMe(user)

      // Данные поездки
      const { data: tripData } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single()
      setTrip(tripData)

      // Загружаем сообщения этой поездки
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: true })
      setMessages(msgs || [])
      setLoading(false)
    }
    init()
  }, [tripId, router])

  // 2. Слушаем новые сообщения в реальном времени
  useEffect(() => {
    const channel = supabase
      .channel('messages-' + tripId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `trip_id=eq.${tripId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [tripId])

  // 3. Прокрутка вниз при новом сообщении
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 4. Отправка сообщения
  const sendMessage = async (e) => {
    e.preventDefault()
    if (!text.trim() || !me || !trip) return

    // Кому пишем? Если я НЕ владелец — пишу владельцу. Если владелец — некому (упрощённо).
    const receiverId = trip.user_id

    const { error } = await supabase.from('messages').insert([
      {
        trip_id: tripId,
        sender_id: me.id,
        receiver_id: receiverId,
        text: text.trim(),
      },
    ])

        if (error) {
      alert('Ошибка отправки: ' + error.message)
    } else {
      // Сразу показываем своё сообщение на экране
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          trip_id: tripId,
          sender_id: me.id,
          receiver_id: receiverId,
          text: text.trim(),
        },
      ])
      setText('')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-cyan-50/40">
        <p className="text-slate-500">Загружаю чат...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-cyan-50/40 flex flex-col">
      {/* Шапка */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4 shadow-sm">
        <a href="/trips" className="text-[#0e6ba8] font-semibold">←</a>
        <div>
          <div className="font-bold text-[#0a3d5c]">
            {trip ? `${trip.from_city} → ${trip.to_city}` : 'Чат'}
          </div>
          <div className="text-sm text-slate-400">
            Водитель: {trip?.driver_name || '—'}
          </div>
        </div>
      </div>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-2xl mx-auto w-full flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-center text-slate-400 mt-10">
            Сообщений пока нет. Напишите первым! 👋
          </p>
        )}

        {messages.map((msg) => {
          const isMine = msg.sender_id === me?.id
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                  isMine
                    ? 'bg-gradient-to-r from-[#0e6ba8] to-[#16c0b0] text-white rounded-br-sm'
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Поле ввода */}
      <form
        onSubmit={sendMessage}
        className="bg-white border-t border-slate-100 px-6 py-4 flex gap-3 max-w-2xl mx-auto w-full"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Напишите сообщение..."
          className="flex-1 px-4 py-3 rounded-full border border-slate-200 focus:border-[#16c0b0] outline-none"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-[#0e6ba8] to-[#16c0b0] text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-cyan-500/30 hover:scale-105 transition"
        >
          ➤
        </button>
      </form>
    </main>
  )
}