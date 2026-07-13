'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

const CITIES = [
  "Симферополь", "Севастополь", "Ялта", "Керчь", "Евпатория",
  "Феодосия", "Джанкой", "Алушта", "Бахчисарай", "Саки",
  "Судак", "Армянск", "Красноперекопск", "Белогорск", "Щёлкино",
  "Гурзуф", "Коктебель", "Николаевка", "Черноморское", "Форос"
]

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [from, setFrom] = useState("Симферополь")
  const [to, setTo] = useState("Ялта")

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

  const handleSearch = () => {
    router.push(`/trips?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
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
            {/* НОВОЕ: ссылка на заправки в меню */}
            <a href="/fuel" className="flex items-center gap-1 font-semibold text-[#0e6ba8] hover:text-[#16c0b0] transition">
              <span className="fuel-flame">⛽</span> Бензин
            </a>
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

          {/* ===== НОВОЕ: ГОРЯЩАЯ КНОПКА "ГДЕ ЕСТЬ БЕНЗИН" ===== */}
          <div className="animate-fadeUp animate-delay-2 mt-8 flex justify-center">
            <a
              href="/fuel"
              className="fuel-glow group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-[#f97316] via-[#f59e0b] to-[#f97316]"
            >
              <span className="fuel-flame text-2xl">⛽</span>
              <span>Где есть бензин в Крыму?</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-white/25 text-xs font-semibold">LIVE</span>
            </a>
          </div>

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

        {/* ===== ПОИСКОВАЯ СТРОКА ===== */}
        <div className="animate-fadeUp animate-delay-3 relative max-w-3xl mx-auto mt-16 bg-white rounded-3xl shadow-2xl shadow-cyan-900/10 border border-slate-100 p-3 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-slate-50 transition">
            <span className="text-[#16c0b0] text-xl">📍</span>
            <div className="text-left w-full">
              <div className="text-xs text-slate-400 font-medium">Откуда</div>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="font-semibold text-[#0a3d5c] bg-transparent outline-none cursor-pointer w-full"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="hidden md:block w-px bg-slate-100"></div>
          <div className="flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl hover:bg-slate-50 transition">
            <span className="text-[#0e6ba8] text-xl">🏁</span>
            <div className="text-left w-full">
              <div className="text-xs text-slate-400 font-medium">Куда</div>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="font-semibold text-[#0a3d5c] bg-transparent outline-none cursor-pointer w-full"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-[#0e6ba8] to-[#16c0b0] text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-cyan-500/30 hover:scale-105 transition flex items-center justify-center"
          >
            Искать 🔍
          </button>
        </div>
      </section>

            {/* ===== КАК РАБОТАЕТ ===== */}
      <section id="how" className="py-24 px-6 bg-gradient-to-b from-white to-cyan-50/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-[#0a3d5c] mb-4">
            Как это работает
          </h2>
          <p className="text-center text-slate-500 mb-16 text-lg">
            Два простых способа найти попутку по Крыму
          </p>

          {/* Два сценария */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Пассажир */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-cyan-900/5 border-2 border-cyan-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center text-3xl mb-5">
                🙋
              </div>
              <h3 className="text-2xl font-bold text-[#0a3d5c] mb-2">Вы пассажир?</h3>
              <p className="text-slate-500 leading-relaxed mb-5">
                Найдите поездку от водителя или оставьте свою заявку — водители сами вам напишут.
              </p>
              <div className="flex flex-col gap-2">
                <a href="/trips" className="text-[#0e6ba8] font-semibold hover:underline">🚗 Найти поездку →</a>
                <a href="/request" className="text-[#0e6ba8] font-semibold hover:underline">📝 Оставить заявку →</a>
              </div>
            </div>

            {/* Водитель */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-cyan-900/5 border-2 border-cyan-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center text-3xl mb-5">
                🚙
              </div>
              <h3 className="text-2xl font-bold text-[#0a3d5c] mb-2">Вы водитель?</h3>
              <p className="text-slate-500 leading-relaxed mb-5">
                Предложите свою поездку или найдите пассажиров, которым нужно в вашу сторону.
              </p>
              <div className="flex flex-col gap-2">
                <a href="/offer" className="text-[#0e6ba8] font-semibold hover:underline">🚙 Предложить поездку →</a>
                <a href="/requests" className="text-[#0e6ba8] font-semibold hover:underline">🙋 Найти пассажиров →</a>
              </div>
            </div>
          </div>

          {/* 3 шага */}
          <p className="text-center text-slate-500 mb-10 text-lg font-medium">
            И всего 3 простых шага до поездки:
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🔎", title: "1. Найдите вариант", text: "Выберите поездку водителя или заявку пассажира по нужному маршруту." },
              { icon: "📞", title: "2. Свяжитесь", text: "Позвоните или напишите напрямую и договоритесь о времени, месте и цене." },
              { icon: "🚗", title: "3. Поехали!", text: "Встречайтесь и отправляйтесь в путь. Всё честно и по договорённости." },
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

      {/* ===== НАШИ ПАРТНЁРЫ ===== */}
      <section id="partners" className="py-20 px-6 bg-gradient-to-b from-cyan-50/40 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-cyan-50 text-[#0e6ba8] text-sm font-semibold border border-cyan-100">
            🤝 Сотрудничество
          </span>
          <h2 className="text-4xl font-extrabold text-[#0a3d5c] mb-3">Наши партнёры</h2>
          <p className="text-slate-500 mb-12 text-lg">Сообщества и проекты, с которыми мы дружим</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                name: "Крымский мост | Еду в Крым",
                logo: "/partners/gov.png",
                url: "https://vk.com/govkrimea",
              },
              {
                name: "Tabor Racing Club | TRC | Drag racing",
                logo: "/partners/tabor.png",
                url: "https://vk.com/trcrace",
              },
            ].map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                title={p.name}
                className="group flex flex-col items-center justify-center gap-4 bg-white rounded-3xl p-8 shadow-xl shadow-cyan-900/5 border border-slate-100 hover:-translate-y-2 hover:border-[#16c0b0] transition duration-300"
              >
                <div className="h-20 flex items-center justify-center">
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="max-h-16 w-auto object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition duration-300"
                  />
                </div>
                <span className="text-sm font-semibold text-[#0a3d5c] text-center">
                  {p.name}
                </span>
              </a>
            ))}
          </div>

          <p className="text-slate-400 text-sm mt-10">
            Хотите стать партнёром?{" "}
            <a href="https://t.me/volskzz" target="_blank" rel="noopener noreferrer" className="text-[#0e6ba8] font-semibold hover:underline">
              Напишите нам →
            </a>
          </p>
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

      {/* ===== АНИМАЦИЯ ГОРЯЩЕЙ КНОПКИ БЕНЗИНА ===== */}
      <style jsx global>{`
        /* Пульсирующее свечение кнопки */
        .fuel-glow {
          box-shadow: 0 0 0 rgba(249, 115, 22, 0.6);
          animation: fuelPulse 2s infinite;
          transition: transform 0.2s ease;
          background-size: 200% 100%;
        }
        .fuel-glow:hover {
          transform: scale(1.06);
          animation: fuelPulse 1s infinite, fuelShine 1.5s linear infinite;
        }

        @keyframes fuelPulse {
          0% {
            box-shadow: 0 0 8px rgba(249, 115, 22, 0.5),
                        0 0 20px rgba(245, 158, 11, 0.4);
          }
          50% {
            box-shadow: 0 0 22px rgba(249, 115, 22, 0.9),
                        0 0 45px rgba(245, 158, 11, 0.7);
          }
          100% {
            box-shadow: 0 0 8px rgba(249, 115, 22, 0.5),
                        0 0 20px rgba(245, 158, 11, 0.4);
          }
        }

        /* Бегущий блик при наведении */
        @keyframes fuelShine {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Покачивание иконки пламени */
        .fuel-flame {
          display: inline-block;
          animation: flameFlicker 1.2s ease-in-out infinite;
        }
        @keyframes flameFlicker {
          0%, 100% { transform: rotate(-6deg) scale(1); }
          50% { transform: rotate(6deg) scale(1.12); }
        }
      `}</style>
    </main>
  );
}
