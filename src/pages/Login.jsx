import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as loginService } from '../services/authService'
import Icon from '../components/ui/Icon'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const res = await loginService(form)
      login(res.data.token, res.data.usuario)
      const rutas = { administrador: '/admin', tecnico: '/tecnico', cliente: '/cliente' }
      navigate(rutas[res.data.usuario.rol] || '/')
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Credenciales incorrectas')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="sidebar-brand-mark">T</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--c-text)' }}>TallerApp</div>
            <div style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>Gestión de reparaciones</div>
          </div>
        </div>

        <h1 className="auth-title">Iniciar sesión</h1>
        <p className="auth-sub">Ingresa tus credenciales para continuar</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Correo electrónico</label>
            <input
              className="input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="label" style={{ margin: 0 }}>Contraseña</label>
              <Link to="/recuperar-password" className="auth-link">Olvidé mi contraseña</Link>
            </div>
            <input
              className="input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={cargando}
            style={{ width: '100%', marginTop: 8, padding: '11px 14px', fontSize: 14 }}
          >
            {cargando ? 'Ingresando...' : (
              <><Icon name="arrowRight" size={15} /> Ingresar</>
            )}
          </button>
        </form>

        <p className="auth-footer">
          No tienes cuenta?{' '}
          <Link to="/register">Registrarse</Link>
        </p>
      </div>
    </div>
  )
}
