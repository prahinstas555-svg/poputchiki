'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

       if (error) {
      setMessage('Ошибка: ' + error.message)
    } else {
      window.location.href = '/dashboard'
    }

    setLoading(false)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: '#ffffff',
          borderRadius: 16,
          padding: 40,
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            marginBottom: 30,
            color: '#333',
            fontSize: 28,
          }}
        >
          Вход
        </h1>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#555', fontSize: 14 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid #ddd',
                fontSize: 15,
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: 25 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#555', fontSize: 14 }}>
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ваш пароль"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid #ddd',
                fontSize: 15,
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 8,
              border: 'none',
              background: loading ? '#999' : '#667eea',
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: 20,
              padding: 12,
              borderRadius: 8,
              textAlign: 'center',
              fontSize: 14,
              background: message.startsWith('Ошибка') ? '#fdecea' : '#e6f7ed',
              color: message.startsWith('Ошибка') ? '#c0392b' : '#1e824c',
            }}
          >
            {message}
          </p>
        )}

        <p style={{ marginTop: 25, textAlign: 'center', color: '#777', fontSize: 14 }}>
          Нет аккаунта?{' '}
          <a href="/register" style={{ color: '#667eea', fontWeight: 600, textDecoration: 'none' }}>
            Зарегистрироваться
          </a>
        </p>
      </div>
    </div>
  )
}