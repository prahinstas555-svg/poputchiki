'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.refresh()
  }
  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* ===== ШАПКА ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0e6ba8] to-[#16c0b0] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/30">
              Я
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#0a3d5c] to-[#0e6ba8] bg-clip-text text-transparent">
              Ялос
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="/trips" className="hover:text-[#0e6ba8] transition">Поездки</a>
            <a href="/requests" className="hover:text-[#0e6ba8] transition">Заявки</a>
            <a href="#how" className="hover:text-[#0e6ba8] transition">Как работает</a>
          </nav>
          {user ? (
            <div className="flex items-center gap-3">
              <a
                href="/chats"
                className="flex items-center gap-1 text-sm font-semibold text-[#0a3d5c] hover:text-[#0e6ba8] transition"
              >
                💬 <span className="hidden sm:block">Мои чаты</span>
              </a>
              <a
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-[#0a3d5c] hover:text-[#0e6ba8] transition"
              >
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0e6ba8] to-[#16c0b0] flex items-center justify-center text-white font-bold text-sm">
                  {user.email?.[0]?.toUpperCase()}
                </span>
                <span className="hidden sm:block">{user.email}</span>
              </a>
              <button
                onClick={handleLogout}
                className="bg-slate-100 text-[#0a3d5c] px-5 py-2 rounded-full font-semibold text-sm hover:bg-slate-200 transition"
              >
                Выйти
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="bg-gradient-to-r from-[#0e6ba8] to-[#16c0b0] text-white px-5 py-2 rounded-full font-semibold text-sm shadow-lg shadow-cyan-500/30 hover:scale-105 transition"
            >
              Войти
            </a>
          )}
        </div>
      </header>

      {/* ===== ГЛАВНЫЙ ЭКРАН ===== */}
      <section className="relative pt-40 pb-32 px-6">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <span className="animate-fadeUp inline-block mb-6 px-4 py-1.5 rounded-full bg-cyan-50 text-[#0e6ba8] text-sm font-semibold border border-cyan-100">
            🌊 Попутчики по всему Крыму
          </span>

          <h1 className="animate-fadeUp animate-delay-1 text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-[#0a3d5c]">
            Путешествуй по Крыму{" "}
            <span className="bg-gradient-to-r from-[#0e6ba8] to-[#16c0b0] bg-clip-text text-transparent">
              вместе
            </span>
          </h1>

          <p className="animate-fadeUp animate-delay-2 mt-6 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            Находи попутчиков, дели расходы на дорогу и знакомься с новыми людьми.
            Из Симферополя в Ялту, из Керчи в Севастополь — быстро, удобно и недорого.
          </p>

          {/* ===== 4 БОЛЬШИЕ КНОПКИ ===== */}
          <div className="animate-fadeUp animate-delay-3 mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <a href="/trips" className="bg-gradient-to-r from-[#0e6ba8] to-[#16c0b0] text-white px-6 py-5 rounded-2xl font-semibold text-lg shadow-xl shadow-cyan-500/30 hover:scale-105 transition">
              🚗 Найти поездку
            </a>
            <a href="/requests" className="bg-white text-[#0a3d5c] px-6 py-5 rounded-2xl font-semibold text-lg border-2 border-[#16c0b0] hover:bg-cyan-50 transition">
              🙋 Ищу водителя
            </a>
            <a href="/offer" className="bg-white text-[#0a3d5c] px-6 py-5 rounded-2xl font-semibold text-lg border-2 border-slate-200 hover:border-[#16c0b0] transition">
              🚙 Предложить поездку
            </a>
            <a href="/request" className="bg-white text-[#0a3d5c] px-6 py-5 rounded-2xl font-semibold text-lg border-2 border-slate-200 hover:border-[#16c0b0] transition">
              📝 Оставить заявку
            </a>
          </div>
        </div>

        <div className="animate-fadeUp animate-delay-3 relative max-w-3xl mx-auto mt-16 bg-white rounded-3xl shadow-2xl shadow-cyan-900/10 border border-slate-100 p-3 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-slate-50 transition">
            <span className="text-[#16c0b0] text-xl">📍</span>
            <div className="text-left">
              <div className="text-xs text-slate-400 font-medium">Откуда</div>
              <div className="font-semibold text-[#0a3d5c]">Симферополь</div>
            </div>
          </div>
          <div className="hidden md:block w-px bg-slate-100"></div>
          <div className="flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-slate-50 transition">
            <span className="text-[#0e6ba8] text-xl">🏁</span>
            <div className="text-left">
              <div className="text-xs text-slate-400 font-medium">Куда</div>
              <div className="font-semibold text-[#0a3d5c]">Ялта</div>
            </div>
          </div>
          <a href="/trips" className="bg-gradient-to-r from-[#0e6ba8] to-[#16c0b0] text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-cyan-500/30 hover:scale-105 transition flex items-center justify-center">
            Искать 🔍
          </a>
        </div>
      </section>

      {/* ===== КАК РАБОТАЕТ ===== */}
      <section id="how" className="py-24 px-6 bg-gradient-to-b from-white to-cyan-50/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-[#0a3d5c] mb-4">
            Как это работает
          </h2>
          <p className="text-center text-slate-500 mb-16 text-lg">Три простых шага до поездки</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🔎", title: "Найди поездку", text: "Выбери маршрут и дату. Смотри доступные поездки от водителей рядом." },
              { icon: "💬", title: "Забронируй место", text: "Забронируй в один клик и свяжись с водителем в чате приложения." },
              { icon: "🚗", title: "Поехали!", text: "Встречайтесь и отправляйтесь в путь. Дели расходы честно и удобно." },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 shadow-xl shadow-cyan-900/5 border border-slate-100 hover:-translate-y-2 transition duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center text-3xl mb-5">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0a3d5c] mb-2">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ПРЕИМУЩЕСТВА ===== */}
      <section id="why" className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-4">
          {[
            { icon: "💰", title: "Экономия", text: "Дели расходы на бензин и трассу — поездки в разы дешевле такси." },
            { icon: "⭐", title: "Доверие", text: "Рейтинги и отзывы. Ты всегда видишь, с кем едешь." },
            { icon: "🌿", title: "Экология", text: "Одна машина вместо нескольких — меньше пробок и выбросов." },
            { icon: "📍", title: "Только Крым", text: "Сервис создан специально для нашего полуострова и его маршрутов." },
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-5 p-6 rounded-2xl hover:bg-cyan-50/50 transition"
            >
              <div className="text-4xl">{item.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-[#0a3d5c] mb-1">{item.title}</h3>
                <p className="text-slate-500">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ПРИЗЫВ ===== */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto rounded-[2.5rem] bg-gradient-to-br from-[#0a3d5c] via-[#0e6ba8] to-[#16c0b0] p-14 text-center shadow-2xl shadow-cyan-900/30">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Готов отправиться в путь?
          </h2>
          <p className="text-cyan-100 text-lg mb-8">
            Присоединяйся к Ялос — сообществу путешественников Крыма.
          </p>
          <a href="/login" className="inline-block bg-white text-[#0e6ba8] px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition">
            Начать бесплатно
          </a>
        </div>
      </section>

      {/* ===== ПОДВАЛ ===== */}
      <footer className="border-t border-slate-100 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0e6ba8] to-[#16c0b0] flex items-center justify-center text-white font-bold text-sm">
              Я
            </div>
            <span className="font-bold text-[#0a3d5c]">Ялос</span>
          </div>
          <p>© 2026 Ялос — попутчики Крыма. Сделано с ❤️ в Крыму.</p>
        </div>
      </footer>
            {/* ===== ПОДВАЛ ===== */}
      <footer className="border-t border-slate-100 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0e6ba8] to-[#16c0b0] flex items-center justify-center text-white font-bold text-sm">
              Я
            </div>
            <span className="font-bold text-[#0a3d5c]">Ялос</span>
          </div>

          {/* Кнопка ВКонтакте */}
          <a
            href="https://vk.com/yaloscrim"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#0077FF] text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg shadow-blue-500/30 hover:scale-105 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.117-.069.588-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.834-.407-.266-.305-1.075-.305-1.65 0-1.794.267-2.541-.521-2.733-.262-.063-.454-.105-1.123-.112-.858-.009-1.585.003-1.996.208-.274.136-.485.44-.356.457.159.022.519.099.71.365.246.343.237 1.114.237 1.114s.142 2.11-.331 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.071-.176-.199-.27c-.154-.114-.37-.15-.37-.15l-2.286.015s-.343.01-.469.16c-.112.132-.009.406-.009.406s1.79 4.191 3.817 6.302c1.858 1.936 3.968 1.81 3.968 1.81z"/>
            </svg>
            Мы во ВКонтакте
          </a>

          <p>© 2026 Ялос — попутчики Крыма. Сделано с ❤️ в Крыму.</p>
        </div>
      </footer>
      <footer style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '14px' }}>
        <p>Создатель проекта: Станислав</p>
        <p>Для связи: <a href="https://t.me/volskzz" target="_blank">Telegram @volskzz</a></p>
        <p>© 2026</p>
      </footer>
    </main>
  );
}
