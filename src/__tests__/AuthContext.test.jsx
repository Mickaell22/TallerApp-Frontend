import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { AuthProvider, useAuth } from '../context/AuthContext'

function TestConsumer() {
  const { usuario, token, login, logout, cargando } = useAuth()
  return (
    <div>
      <span data-testid="cargando">{String(cargando)}</span>
      <span data-testid="usuario">{usuario ? usuario.nombre : 'null'}</span>
      <span data-testid="token">{token || 'null'}</span>
      <button onClick={() => login('tok123', { nombre: 'Juan', rol: 'administrador' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

function renderConProvider() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('estado inicial: sin usuario ni token', async () => {
    renderConProvider()
    await act(async () => {})

    expect(screen.getByTestId('usuario').textContent).toBe('null')
    expect(screen.getByTestId('token').textContent).toBe('null')
    expect(screen.getByTestId('cargando').textContent).toBe('false')
  })

  it('login guarda usuario y token en estado y localStorage', async () => {
    renderConProvider()
    await act(async () => {})

    await act(async () => {
      screen.getByText('Login').click()
    })

    expect(screen.getByTestId('usuario').textContent).toBe('Juan')
    expect(screen.getByTestId('token').textContent).toBe('tok123')
    expect(localStorage.getItem('token')).toBe('tok123')
    expect(JSON.parse(localStorage.getItem('usuario')).nombre).toBe('Juan')
  })

  it('logout limpia usuario, token y localStorage', async () => {
    localStorage.setItem('token', 'tok_previo')
    localStorage.setItem('usuario', JSON.stringify({ nombre: 'Previo' }))

    renderConProvider()
    await act(async () => {})

    await act(async () => {
      screen.getByText('Login').click()
    })

    await act(async () => {
      screen.getByText('Logout').click()
    })

    expect(screen.getByTestId('usuario').textContent).toBe('null')
    expect(screen.getByTestId('token').textContent).toBe('null')
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('usuario')).toBeNull()
  })

  it('restaura sesión desde localStorage si el token no ha expirado', async () => {
    // Token con exp dentro de 1 hora
    const payload = { id: 1, rol: 'cliente', exp: Math.floor(Date.now() / 1000) + 3600 }
    const tokenFake = `header.${btoa(JSON.stringify(payload))}.sig`
    localStorage.setItem('token', tokenFake)
    localStorage.setItem('usuario', JSON.stringify({ nombre: 'Guardado', rol: 'cliente' }))

    renderConProvider()
    await act(async () => {})

    expect(screen.getByTestId('usuario').textContent).toBe('Guardado')
    expect(screen.getByTestId('token').textContent).toBe(tokenFake)
  })

  it('descarta token expirado al inicializar', async () => {
    const payload = { id: 1, rol: 'cliente', exp: Math.floor(Date.now() / 1000) - 10 }
    const tokenExpirado = `header.${btoa(JSON.stringify(payload))}.sig`
    localStorage.setItem('token', tokenExpirado)
    localStorage.setItem('usuario', JSON.stringify({ nombre: 'Expirado' }))

    renderConProvider()
    await act(async () => {})

    expect(screen.getByTestId('usuario').textContent).toBe('null')
    expect(localStorage.getItem('token')).toBeNull()
  })
})
