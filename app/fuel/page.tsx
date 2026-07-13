'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase' // ← поправь путь под свой проект

const CITIES = ['Симферополь', 'Севастополь', 'Ялта', 'Феодосия', 'Керчь', 'Евпатория']

const STATUS = {
  yes:   { label: '✅ Есть бензин', color: '#16a34a', bg: '#f0fdf4', border: '#16a34a' },
  no:    { label: '❌ Нет бензина', color: '#dc2626', bg: '#fef2f2', border: '#dc2626' },
  queue: { label: '⏳ Очередь',     color: '#d97706', bg: '#fffbeb', border: '#d97706' },
  limit: { label: '🔢 Лимит',       color: '#d97706', bg: '#fffbeb', border: '#d97706' },
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
  return (Date.now() - new Date(dateStr).getTime()) / 3600000 > 3 // старше 3 часов
}

export default function FuelPage() {
  const [city, setCity] = useState('Симферополь')
  const [stations, setStations] = useState([])
  const [reports, setReports] = useState({}) // { station_id: последняя отметка }
  const [loading, setLoading] = useState(true)

  async function loadData() {
    setLoading(true)
    // 1. Заправки выбранного города
    const { data: st } = await supabase
      .from('stations')
      .select('*')
      .eq('city', city)
      .order('name')

    // 2. Последние отметки
    const { data: rep } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })

    // Берём самую свежую отметку по каждой заправке
    const latest = {}
    ;(rep || []).forEach(r => {
      if (!latest[r.station_id]) latest[r.station_id] = r
    })

    setStations(st || [])
    setReports(latest)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [city])

  async function sendReport(stationId, status) {
    await supabase.from('reports').insert({ station_id: stationId, status })
    loadData() // обновляем список
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>⛽ Где есть бензин в Крыму</h1>
      <p style={{ color: '#666', marginBottom: 16, fontSize: 14 }}>
        Отмечайте наличие бензина — помогайте другим не тратить топливо зря.
      </p>

      {/* Выбор города */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {CITIES.map(c => (
          <button
            key={c}
            onClick={() => setCity(c)}
            style={{
              padding: '8px 14px',
              borderRadius: 20,
              border: '1px solid #ddd',
              background: city === c ? '#111' : '#fff',
              color: city === c ? '#fff' : '#111',
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {loading && <p>Загрузка...</p>}

      {!loading && stations.length === 0 && (
        <p style={{ color: '#666' }}>Для этого города пока нет заправок.</p>
      )}

      {/* Список заправок */}
      {!loading && stations.map(s => {
        const rep = reports[s.id]
        const info = rep ? STATUS[rep.status] : null
        const stale = rep && isStale(rep.created_at)

        return (
          <div
            key={s.id}
            style={{
              border: `2px solid ${rep && !stale ? info.border : '#e5e5e5'}`,
              background: rep && !stale ? info.bg : '#fafafa',
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 16 }}>⛽ {s.name}</div>
            <div style={{ color: '#666', fontSize: 13, marginBottom: 10 }}>
              {s.city}{s.address ? `, ${s.address}` : ''}
            </div>

            {/* Текущий статус */}
            {rep ? (
              <div style={{ marginBottom: 12, fontSize: 15, fontWeight: 600, color: stale ? '#999' : info.color }}>
                {info.label} · <span style={{ fontWeight: 400 }}>{timeAgo(rep.created_at)}</span>
                {stale && <span style={{ color: '#999', fontWeight: 400 }}> (данные устарели)</span>}
              </div>
            ) : (
              <div style={{ marginBottom: 12, fontSize: 14, color: '#999' }}>
                Пока нет данных — отметьте первым
              </div>
            )}

            {/* Кнопки отметки */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button onClick={() => sendReport(s.id, 'yes')}   style={btn('#16a34a')}>✅ Есть</button>
              <button onClick={() => sendReport(s.id, 'no')}    style={btn('#dc2626')}>❌ Нет</button>
              <button onClick={() => sendReport(s.id, 'queue')} style={btn('#d97706')}>⏳ Очередь</button>
              <button onClick={() => sendReport(s.id, 'limit')} style={btn('#d97706')}>🔢 Лимит</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function btn(color) {
  return {
    padding: '8px 12px',
    borderRadius: 8,
    border: `1px solid ${color}`,
    background: '#fff',
    color,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
  }
}
