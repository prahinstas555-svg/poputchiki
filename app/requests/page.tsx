'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function RequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRequests() {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) setRequests(data)
      setLoading(false)
    }
    loadRequests()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-cyan-50/40 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="text-[#0e6ba8] font-semibold mb-6 inline-block">← На главную</a>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-[#0a3d5c]">Заявки пассажиров 🙋</h1>
          <a href="/request" className="bg-gradient-to-r from-[#0e6ba8] to-[#16c0b0] text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg shadow-cyan-500/30 hover:scale-105 transition">
            + Оставить заявку
          </a>
        </div>

        <p className="text-slate-500 mb-8">Здесь пассажиры ищут водителей. Если едете в ту же сторону — свяжитесь и договоритесь о цене!</p>

        {loading && <p className="text-slate-500">Загружаю заявки...</p>}

        {!loading && requests.length === 0 && (
          <div className="bg-white rounded-3xl shadow-xl shadow-cyan-900/10 border border-slate-100 p-10 text-center">
            <p className="text-slate-500 text-lg">Пока нет ни одной заявки 😔</p>
            <a href="/request" className="text-[#0e6ba8] font-semibold mt-2 inline-block">Оставить первую заявку →</a>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-3xl shadow-xl shadow-cyan-900/5 border border-slate-100 p-6 hover:-translate-y-1 transition">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 text-lg font-bold text-[#0a3d5c]">
                  <span>📍 {req.from_city}</span>
                  <span className="text-[#16c0b0]">→</span>
                  <span>🏁 {req.to_city}</span>
                </div>
                {req.price && <div className="text-xl font-extrabold text-[#0e6ba8]">{req.price}</div>}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                {req.date && <span>📅 {req.date}</span>}
                {req.time && <span>🕐 {req.time}</span>}
                {req.people && <span>👥 {req.people} чел.</span>}
                {req.passenger_name && <span>👤 {req.passenger_name}</span>}
              </div>

              {req.comment && (
                <p className="mt-3 text-slate-500 border-t border-slate-100 pt-3">{req.comment}</p>
              )}

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                {req.phone && (
                  <a
                    href={`tel:${req.phone}`}
                    className="flex-1 text-center bg-gradient-to-r from-[#0e6ba8] to-[#16c0b0] text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-cyan-500/30 hover:scale-105 transition"
                  >
                    📞 Позвонить пассажиру
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
