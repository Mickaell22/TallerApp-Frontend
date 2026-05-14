import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import PrivateRoute from '../routes/PrivateRoute'

// Mock del hook useAuth
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

import { useAuth } from '../context/AuthContext'

function renderRuta({ usuario = null, cargando = false, roles = [] } = {}) {
  useAuth.mockReturnValue({ usuario, cargando })
  return render(
    <MemoryRouter initialEntries={['/protegida']}>
      <PrivateRoute roles={roles}>
        <span>Contenido protegido</span>
      </PrivateRoute>
    </MemoryRouter>
  )
}

describe('PrivateRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra null mientras está cargando', () => {
    const { container } = renderRuta({ cargando: true })
    expect(container.firstChild).toBeNull()
  })

  it('redirige a /login si no hay usuario autenticado', () => {
    renderRuta({ usuario: null })
    // Sin el contenido protegido visible
    expect(screen.queryByText('Contenido protegido')).toBeNull()
  })

  it('redirige a /no-autorizado si el rol no coincide', () => {
    renderRuta({ usuario: { rol: 'cliente' }, roles: ['administrador'] })
    expect(screen.queryByText('Contenido protegido')).toBeNull()
  })

  it('renderiza los hijos si el usuario tiene el rol correcto', () => {
    renderRuta({ usuario: { rol: 'administrador' }, roles: ['administrador'] })
    expect(screen.getByText('Contenido protegido')).toBeTruthy()
  })

  it('renderiza los hijos si la ruta no requiere rol específico', () => {
    renderRuta({ usuario: { rol: 'cliente' }, roles: [] })
    expect(screen.getByText('Contenido protegido')).toBeTruthy()
  })

  it('renderiza los hijos si el usuario tiene uno de los roles permitidos', () => {
    renderRuta({ usuario: { rol: 'tecnico' }, roles: ['administrador', 'tecnico'] })
    expect(screen.getByText('Contenido protegido')).toBeTruthy()
  })
})
