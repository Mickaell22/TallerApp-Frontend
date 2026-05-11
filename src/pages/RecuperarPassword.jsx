import { useState } from 'react'
import { Link } from 'react-router-dom'
import { recuperarPassword } from '../services/authService'
import Icon from '../components/ui/Icon'

export default function RecuperarPassword() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      await recuperarPassword(email)
      setEnviado(true)
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo enviar el correo')
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

        {enviado ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'var(--c-success-bg)', color: 'var(--c-success)',
              display: 'grid', placeItems: 'center', margin: '0 auto 16px'
            }}>
              <Icon name="check" size={24} />
            </div>
            <h1 className="auth-title">Correo enviado</h1>
            <p className="auth-sub" style={{ marginBottom: 24 }}>
              Revisa tu bandeja de entrada en <strong>{email}</strong> y sigue las instrucciones para restablecer tu contraseña.
            </p>
            <Link to="/login" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <>
            <h1 className="auth-title">Recuperar contraseña</h1>
            <p className="auth-sub">Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">Correo electrónico</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={cargando}
                style={{ width: '100%', marginTop: 8, padding: '11px 14px', fontSize: 14 }}
              >
                {cargando ? 'Enviando...' : (
                  <><Icon name="arrowRight" size={15} /> Enviar enlace</>
                )}
              </button>
            </form>

            <p className="auth-footer">
              <Link to="/login">Volver al inicio de sesión</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
