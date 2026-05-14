import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register as registerService } from '../services/authService'
import Icon from '../components/ui/Icon'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [ver, setVer] = useState({ password: false, confirmar: false })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validar() {
    if (form.nombre.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres'
    if (form.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
    if (form.password !== form.confirmar) return 'Las contraseñas no coinciden'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validar()
    if (err) { setError(err); return }
    setError('')
    setCargando(true)
    try {
      await registerService({ nombre: form.nombre, email: form.email, password: form.password })
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar la cuenta')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-card">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => navigate(-1)}
          style={{ alignSelf: 'flex-start', marginBottom: 12, padding: '4px 8px' }}
        >
          ← Volver
        </button>

        <div className="auth-brand">
          <div className="sidebar-brand-mark">T</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--c-text)' }}>TallerApp</div>
            <div style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>Gestión de reparaciones</div>
          </div>
        </div>

        <h1 className="auth-title">Crear cuenta</h1>
        <p className="auth-sub">Completa los datos para registrarte</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Nombre completo</label>
            <input
              className="input"
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Juan Pérez"
              required
              minLength={2}
              maxLength={100}
            />
          </div>

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
            <label className="label">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type={ver.password ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                minLength={8}
                required
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={() => setVer(v => ({ ...v, password: !v.password }))}
                tabIndex={-1}
                aria-label={ver.password ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', padding: 4, cursor: 'pointer',
                  color: 'var(--c-text-muted)', display: 'flex', alignItems: 'center',
                }}
              >
                <Icon name={ver.password ? 'eyeOff' : 'eye'} size={16} />
              </button>
            </div>
          </div>

          <div className="field">
            <label className="label">Confirmar contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type={ver.confirmar ? 'text' : 'password'}
                name="confirmar"
                value={form.confirmar}
                onChange={handleChange}
                placeholder="Repite la contraseña"
                required
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={() => setVer(v => ({ ...v, confirmar: !v.confirmar }))}
                tabIndex={-1}
                aria-label={ver.confirmar ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', padding: 4, cursor: 'pointer',
                  color: 'var(--c-text-muted)', display: 'flex', alignItems: 'center',
                }}
              >
                <Icon name={ver.confirmar ? 'eyeOff' : 'eye'} size={16} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={cargando}
            style={{ width: '100%', marginTop: 8, padding: '11px 14px', fontSize: 14 }}
          >
            {cargando ? 'Creando cuenta...' : (
              <><Icon name="arrowRight" size={15} /> Crear cuenta</>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Ya tienes cuenta?{' '}
          <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  )
}
