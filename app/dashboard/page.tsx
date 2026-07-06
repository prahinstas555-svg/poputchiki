'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')

  // данные профиля
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [rating, setRating] = useState(0)
  const [ratingCount, setRatingCount] = useState(0)

  // режим редактирования
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  // загружаем данные при открытии страницы
  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setEmail(user.email || '')
      setUserId(user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setFullName(profile.full_name || '')
        setPhone(profile.phone || '')
        setRating(profile.rating || 0)
        setRatingCount(profile.rating_count || 0)
      }

      setLoading(false)
    }

    loadProfile()
  }, [])

  // сохранение изменений
  async function handleSave() {
    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone: phone,
      })
      .eq('id', userId)

    setSaving(false)

    if (error) {
      alert('Ошибка при сохранении: ' + error.message)
    } else {
      setIsEditing(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Загрузка...</p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #6a82fb, #7b5fe0)',
      padding: '20px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      }}>
        <a
  href="/"
  className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#0e6ba8] transition mb-4"
>
  ← Назад на главную
</a>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Личный кабинет</h1>

        {/* кружок с буквой */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6a82fb, #7b5fe0)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto 15px',
          color: 'white',
          fontSize: '32px',
          fontWeight: 'bold',
        }}>
          {(fullName || email || '?').charAt(0).toUpperCase()}
        </div>

        {/* имя и рейтинг (только когда НЕ редактируем) */}
        {!isEditing && (
          <>
            <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px', margin: '0 0 5px' }}>
              {fullName || 'Без имени'}
            </p>
            <p style={{ textAlign: 'center', margin: '0 0 20px' }}>
              ⭐ {rating.toFixed(1)} <span style={{ color: '#888' }}>({ratingCount} оценок)</span>
            </p>
          </>
        )}

        {/* блок с данными */}
        <div style={{
          background: '#f4f4f8',
          borderRadius: '12px',
          padding: '15px',
          marginBottom: '20px',
        }}>
          {isEditing ? (
            <>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Имя:</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Введите имя"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  marginBottom: '15px',
                  boxSizing: 'border-box',
                }}
              />

              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Телефон:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Введите телефон"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  boxSizing: 'border-box',
                }}
              />
            </>
          ) : (
            <>
              <p style={{ margin: '0 0 8px' }}>📧 <b>Email:</b> {email}</p>
              <p style={{ margin: 0 }}>📞 <b>Телефон:</b> {phone || 'не указан'}</p>
            </>
          )}
        </div>

        {/* кнопки */}
        {isEditing ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: '#2ecc71',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: '#95a5a6',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Отмена
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: '#6a82fb',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '10px',
            }}
          >
            ✏️ Редактировать
          </button>
        )}

        {/* кнопка выйти */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            background: '#e74c3c',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px',
          }}
        >
          Выйти
        </button>
      </div>
    </div>
  )
}