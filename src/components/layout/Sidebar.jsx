import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Icon from '../ui/Icon'

const adminNav = [
  { id: 'dashboard',    label: 'Dashboard',      icon: 'dashboard', path: '/admin' },
  { id: 'reparaciones', label: 'Reparaciones',    icon: 'wrench',    path: '/admin/reparaciones' },
  { id: 'inventario',   label: 'Inventario',      icon: 'box',       path: '/admin/inventario' },
  { id: 'facturacion',  label: 'Facturación',     icon: 'receipt',   path: '/admin/facturacion' },
  { id: 'reportes',     label: 'Reportes',        icon: 'chart',     path: '/admin/reportes' },
  { id: 'clientes',     label: 'Clientes',        icon: 'users',     path: '/admin/clientes' },
]

const tecnicoNav = [
  { id: 'asignadas', label: 'Mis reparaciones', icon: 'wrench',  path: '/tecnico' },
  { id: 'historial', label: 'Historial',         icon: 'history', path: '/tecnico/historial' },
]

export default function Sidebar({ active }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const items = usuario?.rol === 'tecnico' ? tecnicoNav : adminNav
  const initials = usuario?.nombre
    ? usuario.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  function handleNav(path) {
    navigate(path)
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">T</div>
        <div>
          <div className="sidebar-brand-name">TallerApp</div>
          <div className="sidebar-brand-sub">
            {usuario?.rol === 'administrador' ? 'Administrador' : 'Técnico'}
          </div>
        </div>
      </div>

      <div className="sidebar-section-label">Principal</div>
      <nav className="sidebar-nav">
        {items.map(item => (
          <button
            key={item.id}
            className={'sidebar-nav-item' + (active === item.id ? ' active' : '')}
            onClick={() => handleNav(item.path)}
          >
            <Icon name={item.icon} size={17} className="sidebar-nav-icon" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-section-label">Cuenta</div>
      <nav className="sidebar-nav">
        {usuario?.rol === 'administrador' && (
          <button className="sidebar-nav-item" onClick={() => handleNav('/admin/configuracion')}>
            <Icon name="settings" size={17} className="sidebar-nav-icon" />
            Configuración
          </button>
        )}
        <button className="sidebar-nav-item" onClick={handleLogout}>
          <Icon name="logout" size={17} className="sidebar-nav-icon" />
          Cerrar sesión
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="sidebar-user-name">{usuario?.nombre}</div>
            <div className="sidebar-user-role">{usuario?.email}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
