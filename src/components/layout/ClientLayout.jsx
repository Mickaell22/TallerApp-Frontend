import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Icon from '../ui/Icon'

const NAV = [
  { id: 'historial', label: 'Mis reparaciones', path: '/cliente' },
  { id: 'perfil',    label: 'Mi perfil',         path: '/cliente/perfil' },
]

export default function ClientLayout({ children }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { usuario, logout } = useAuth()

  const initials = usuario?.nombre
    ? usuario.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'C'

  const active = location.pathname === '/cliente' ? 'historial' : 'perfil'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)' }}>
      <nav className="client-nav">
        <div className="client-nav-inner">
          <div className="client-nav-brand">
            <div className="sidebar-brand-mark">T</div>
            <span>TallerApp</span>
          </div>
          <div className="client-nav-links">
            {NAV.map(item => (
              <button
                key={item.id}
                className={'client-nav-link' + (active === item.id ? ' active' : '')}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="client-nav-actions">
            <button className="icon-btn">
              <Icon name="bell" size={16} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="sidebar-avatar" style={{ background: 'var(--c-primary)', width: 34, height: 34, fontSize: 13 }}>
                {initials}
              </div>
              <div style={{ fontSize: 13 }}>
                <div style={{ fontWeight: 600 }}>{usuario?.nombre || 'Cliente'}</div>
                <button
                  onClick={handleLogout}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--c-text-muted)', fontSize: 11.5, cursor: 'pointer' }}
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 28px' }}>
        {children}
      </main>
    </div>
  )
}
