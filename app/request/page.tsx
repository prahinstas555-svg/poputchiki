'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function RequestPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    from_city: '',
    to_city: '',
    date: '',
    time: '',
    people: 1,
    price: '',
    passenger_name: '',
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

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      alert('Сначала войдите в аккаунт, чтобы оставить заявку')
      router.push('/login')
      return
    }

    const { error } = await supabase
      .from('requests')
      .insert([{ ...form, user_id: user.id }])

    setLoading(false)
    if (error) {
      alert('Ошибка: ' + error.message)
    } else {
      alert('Заявка опубликована! Теперь водители её увидят 🙋')
      router.push('/requests')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-cyan-50/40 py-20 px-6">
      <div className="max-w-xl mx-auto">
        <a href="/" className="text-[#0e6ba8] font-semibold mb-6 inline-block">← На главную</a>
        <h1 className="text-4xl font-extrabold text-[#0a3d5c] mb-2">Ищу водителя 🙋</h1>
        <p className="text-slate-500 mb-8">Оставьте заявку — и водитель, который едет в ту же сторону, свяжется с вами.</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-cyan-900/10 border border-slate-100 p-8 flex flex-col gap-4">
          <input name="from_city" placeholder="Откуда (напр. Феодосия)" value={form.from_city} onChange={handleChange} required className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#16c0b0] outline-none" />
          <input name="to_city" placeholder="Куда (напр. Симферополь)" value={form.to_city} onChange={handleChange} required className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#16c0b0] outline-none" />
          <input name="date" type="date" value={form.date} onChange={handleChange} className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#16c0b0] outline-none" />
          <input name="time" placeholder="Желаемое время (напр. утром / 14:30)" value={form.time} onChange={handleChange} className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#16c0b0] outline-none" />
          <input name="people" type="number" placeholder="Сколько человек едет" value={form.people} onChange={handleChange} className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#16c0b0] outline-none" />
          <input name="price" placeholder="Сколько готовы заплатить (или «договоримся»)" value={form.price} onChange={handleChange} className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#16c0b0] outline-none" />
          <input name="passenger_name" placeholder="Ваше имя (напр. Анна)" value={form.passenger_name} onChange={handleChange} required className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#16c0b0] outline-none" />
          <input name="phone" placeholder="Телефон для связи (напр. +7 978 123-45-67)" value={form.phone} onChange={handleChange} required className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#16c0b0] outline-none" />
          <textarea name="comment" placeholder="Комментарий (напр. Багажа немного, могу выехать пораньше)" value={form.comment} onChange={handleChange} className="px-4 py-3 rounded-xl border border-slate-200 focus:border-[#16c0b0] outline-none" />

          <button type="submit" disabled={loading} className="bg-gradient-to-r from-[#0e6ba8] to-[#16c0b0] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-cyan-500/30 hover:scale-105 transition disabled:opacity-50">
            {loading ? 'Публикую...' : 'Оставить заявку 🙋'}
          </button>
        </form>
      </div>
    </main>
  )
}
