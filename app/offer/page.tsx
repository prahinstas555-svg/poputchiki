'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function OfferPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    from_city: '',
    to_city: '',
    date: '',
    time: '',
    seats: 3,
    price: '',
    car: '',
    driver_name: '',
    phone: '',
    comment: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

    const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Узнаём, кто сейчас вошёл в аккаунт
    const { data: { user } } = await supabase.auth.getUser()

    // Если человек не вошёл — не даём публиковать
    if (!user) {
      setLoading(false)
      alert('Сначала войдите в аккаунт, чтобы опубликовать поездку')
      router.push('/login')
      return
    }

    // Добавляем к данным поездки id создателя
    const { error } = await supabase
      .from('trips')
      .insert([{ ...form, user_id: user.id }])

    setLoading(false)
    if (error) {
      alert('Ошибка: ' + error.message)
    } else {
      alert('Поездка опубликована! 🚀')
      router.push('/trips')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-cyan-50/40 py-20 px-6">
      <div className="max-w-xl mx-auto">
        <a href="/" className="text-[#0e6ba8] font-semibold mb-6 inline-block">← На главную</a>
        <h1 className="text-4xl font-extrabold text-[#0a3d5c] mb-8">Предложить поездку 🚗</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-cyan-900/10 border border-slate-100 p-8 flex flex-col gap-4">
          <input name="from_city" placeholder="Откуда (напр. Симферополь)" value={form.from_city} onChange={handleChange} required className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#16c0b0] outline-none" />
          <input name="to_city" placeholder="Куда (напр. Ялта)" value={form.to_city} onChange={handleChange} required className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#16c0b0] outline-none" />
          <input name="date" type="date" value={form.date} onChange={handleChange} className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#16c0b0] outline-none" />
          <input name="time" placeholder="Время (напр. 14:30)" value={form.time} onChange={handleChange} className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#16c0b0] outline-none" />
          <input name="seats" type="number" placeholder="Свободных мест" value={form.seats} onChange={handleChange} className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#16c0b0] outline-none" />
          <input name="price" type="number" placeholder="Цена за место (₽)" value={form.price} onChange={handleChange} required className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#16c0b0] outline-none" />
          <input name="car" placeholder="Машина (напр. Kia Rio, белая)" value={form.car} onChange={handleChange} className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#16c0b0] outline-none" />
          <input name="driver_name" placeholder="Ваше имя (напр. Иван)" value={form.driver_name} onChange={handleChange} required className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#16c0b0] outline-none" />
          <input name="phone" placeholder="Телефон для связи (напр. +7 978 123-45-67)" value={form.phone} onChange={handleChange} required className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#16c0b0] outline-none" />
          <textarea name="comment" placeholder="Комментарий" value={form.comment} onChange={handleChange} className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#16c0b0] outline-none" />

          <button type="submit" disabled={loading} className="bg-gradient-to-r from-[#0e6ba8] to-[#16c0b0] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-cyan-500/30 hover:scale-105 transition disabled:opacity-50">
            {loading ? 'Публикую...' : 'Опубликовать поездку 🚀'}
          </button>
        </form>
      </div>
    </main>
  )
}