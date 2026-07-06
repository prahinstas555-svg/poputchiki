'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TripsPage() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTrips() {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) setTrips(data)
      setLoading(false)
    }
    loadTrips()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-cyan-50/40 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="text-[#0e6ba8] font-semibold mb-6 inline-block">← На главную</a>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-[#0a3d5c]">Доступные поездки 🚗</h1>
          <a href="/offer" className="bg-gradient-to-r from-[#0e6ba8] to-[#16c0b0] text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg shadow-cyan-500/30 hover:scale-105 transition">
            + Предложить
          </a>
        </div>

        {loading && <p className="text-slate-500">Загружаю поездки...</p>}

        {!loading && trips.length === 0 && (
          <div className="bg-white rounded-3xl shadow-xl shadow-cyan-900/10 border border-slate-100 p-10 text-center">
            <p className="text-slate-500 text-lg">Пока нет ни одной поездки 😔</p>
            <a href="/offer" className="text-[#0e6ba8] font-semibold mt-2 inline-block">Стать первым водителем →</a>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-3xl shadow-xl shadow-cyan-900/5 border border-slate-100 p-6 hover:-translate-y-1 transition">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 text-lg font-bold text-[#0a3d5c]">
                  <span>📍 {trip.from_city}</span>
                  <span className="text-[#16c0b0]">→</span>
                  <span>🏁 {trip.to_city}</span>
                </div>
                <div className="text-2xl font-extrabold text-[#0e6ba8]">{trip.price} ₽</div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                {trip.date && <span>📅 {trip.date}</span>}
                {trip.time && <span>🕐 {trip.time}</span>}
                <span>💺 {trip.seats} мест</span>
                {trip.car && <span>🚙 {trip.car}</span>}
                {trip.driver_name && <span>👤 {trip.driver_name}</span>}
              </div>

              {trip.comment && (
                <p className="mt-3 text-slate-500 border-t border-slate-100 pt-3">{trip.comment}</p>
              )}

                            <div className="mt-4 flex flex-col sm:flex-row gap-3">
                {trip.phone && (
                  <a
                    href={`tel:${trip.phone}`}
                    className="flex-1 text-center bg-gradient-to-r from-[#0e6ba8] to-[#16c0b0] text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-cyan-500/30 hover:scale-105 transition"
                  >
                    📞 Позвонить
                  </a>
                )}

                {trip.user_id && (
                  <a
                    href={`/chat/${trip.id}`}
                    className="flex-1 text-center bg-white border-2 border-[#16c0b0] text-[#0e6ba8] px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
                  >
                    💬 Написать
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