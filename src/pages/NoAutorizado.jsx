import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NoAutorizado() {
  const navigate = useNavigate()
  const { usuario, logout } = useAuth()

  const rutas = { administrador: '/admin', tecnico: '/tecnico', cliente: '/cliente' }
  const rutaPanel = usuario ? (rutas[usuario.rol] || '/') : '/login'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="auth-root">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'var(--c-danger-bg)', color: 'var(--c-danger)',
          display: 'grid', placeItems: 'center', margin: '0 auto 20px',
          fontSize: 18, fontWeight: 700,
        }}>
          403
        </div>
        <h1 className="auth-title">Acceso denegado</h1>
        <p className="auth-sub">No tienes permiso para ver esta página.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
          {usuario && (
            <button className="btn btn-primary" onClick={() => navigate(rutaPanel)}>
              Ir a mi panel
            </button>
          )}
          <button className="btn btn-secondary" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}
