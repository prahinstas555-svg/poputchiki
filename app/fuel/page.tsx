'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const CITIES = ['Симферополь', 'Севастополь', 'Ялта', 'Феодосия', 'Керчь', 'Евпатория']

const STATUS = {
  yes:   { label: '✅ Есть бензин', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  no:    { label: '❌ Нет бензина', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  queue: { label: '⏳ Очередь',     color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  limit: { label: '🔢 Лимит',       color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
  if (diff < 1) return 'только что'
  if (diff < 60) return `${diff} мин назад`
  const h = Math.floor(diff / 60)
  if (h < 24) return `${h} ч назад`
  return `${Math.floor(h / 24)} дн назад`
}

function isStale(dateStr) {
  return (Date.now() - new Date(dateStr).getTime()) / 3600000 > 3
}

export default function FuelPage() {
  const [city, setCity] = useState('Симферополь')
  const [stations, setStations] = useState([])
  const [reports, setReports] = useState({})
  const [loading, setLoading] = useState(true)

  async function loadData() {
    setLoading(true)
    const { data: st } = await supabase
      .from('stations').select('*').eq('city', city).order('name')
    const { data: rep } = await supabase
      .from('reports').select('*').order('created_at', { ascending: false })
    const latest = {}
    ;(rep || []).forEach(r => { if (!latest[r.station_id]) latest[r.station_id] = r })
    setStations(st || [])
    setReports(latest)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [city])

  async function sendReport(stationId, status) {
    await supabase.from('reports').insert({ station_id: stationId, status })
    loadData()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #eef7fb 0%, #ffffff 60%)',
      padding: '40px 16px',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* Бейдж */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <span style={{
            display: 'inline-block',
            background: '#e0f2fe',
            color: '#0284c7',
            padding: '6px 16px',
            borderRadius: 20,
            fontSize: 14,
            fontWeight: 500,
          }}>⛽ Заправки Крыма</span>
        </div>

        {/* Заголовок */}
        <h1 style={{
          textAlign: 'center',
          fontSize: 42,
          fontWeight: 800,
          color: '#0f2b46',
          margin: '0 0 12px',
          lineHeight: 1.1,
        }}>
          Где есть <span style={{ color: '#0891b2' }}>бензин</span>
        </h1>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: 16, margin: '0 0 32px' }}>
          Отмечайте наличие топлива — помогайте другим не тратить бензин зря
        </p>

        {/* Города */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
          {CITIES.map(c => (
            <button
              key={c}
              onClick={() => setCity(c)}
              style={{
                padding: '10px 20px',
                borderRadius: 24,
                border: 'none',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all .2s',
                background: city === c
                  ? 'linear-gradient(90deg, #0891b2, #155e93)'
                  : '#ffffff',
                color: city === c ? '#fff' : '#0f2b46',
                boxShadow: city === c
                  ? '0 4px 14px rgba(8,145,178,.35)'
                  : '0 2px 6px rgba(0,0,0,.06)',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {loading && <p style={{ textAlign: 'center', color: '#64748b' }}>Загрузка...</p>}

        {!loading && stations.length === 0 && (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Для этого города пока нет заправок.</p>
        )}

        {/* Карточки заправок */}
        {!loading && stations.map(s => {
          const rep = reports[s.id]
          const info = rep ? STATUS[rep.status] : null
          const stale = rep && isStale(rep.created_at)
          const active = rep && !stale

          return (
            <div
              key={s.id}
              style={{
                background: '#fff',
                borderRadius: 20,
                padding: 24,
                marginBottom: 18,
                boxShadow: '0 4px 20px rgba(15,43,70,.08)',
                border: active ? `2px solid ${info.border}` : '2px solid transparent',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#0f2b46' }}>
                    ⛽ {s.name}
                  </div>
                  <div style={{ color: '#64748b', fontSize: 14, marginTop: 2 }}>
                    {s.address || s.city}
                  </div>
                </div>
                {active && (
                  <span style={{
                    background: info.bg,
                    color: info.color,
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: 14,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}>
                    {info.label}
                  </span>
                )}
              </div>

              {/* Время / статус */}
              <div style={{ fontSize: 13, color: '#94a3b8', margin: '10px 0 16px' }}>
                {rep
                  ? stale
                    ? `Последняя отметка ${timeAgo(rep.created_at)} (данные устарели)`
                    : `Обновлено ${timeAgo(rep.created_at)}`
                  : 'Пока нет данных — отметьте первым'}
              </div>

              {/* Кнопки */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <button onClick={() => sendReport(s.id, 'yes')}   style={btn('#16a34a')}>✅ Есть</button>
                <button onClick={() => sendReport(s.id, 'no')}    style={btn('#dc2626')}>❌ Нет</button>
                <button onClick={() => sendReport(s.id, 'queue')} style={btn('#d97706')}>⏳ Очередь</button>
                <button onClick={() => sendReport(s.id, 'limit')} style={btn('#d97706')}>🔢 Лимит</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function btn(color) {
  return {
    flex: '1 1 auto',
    minWidth: 90,
    padding: '11px 14px',
    borderRadius: 12,
    border: `1.5px solid ${color}`,
    background: '#fff',
    color,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    transition: 'all .15s',
  }
}
