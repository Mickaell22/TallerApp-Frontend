import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'
import { register } from '../../services/authService'

export default function NuevoCliente() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
  })
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    if (name === 'telefono') {
      setForm({ ...form, telefono: value.replace(/\D/g, '').slice(0, 10) })
      return
    }
    setForm({ ...form, [name]: value })
  }

  function validar() {
    if (form.nombre.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres'
    if (form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres'
    if (form.telefono && form.telefono.length !== 10) return 'El teléfono debe tener exactamente 10 dígitos'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validar()
    if (err) { setError(err); return }
    setError('')
    setGuardando(true)
    try {
      await register({ ...form, rol: 'cliente' })
      navigate('/admin/clientes')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear el cliente')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <AdminLayout active="clientes" title="Nuevo cliente" subtitle="Registrar un cliente en el sistema">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/clientes')}>
          ← Volver
        </button>
      </div>

      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Nuevo cliente</h1>
          <p className="page-subtitle">Los datos de acceso se envían directamente al cliente</p>
        </div>
      </div>

      <div style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit}>
          <div className="card card-pad">
            {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

            <div className="field">
              <label className="label">Nombre completo *</label>
              <input className="input" name="nombre" value={form.nombre} onChange={handleChange} required minLength={2} maxLength={100} placeholder="Ej: Ana Torres" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="field">
                <label className="label">Correo electrónico *</label>
                <input className="input" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="cliente@email.com" />
              </div>
              <div className="field">
                <label className="label">Contraseña temporal *</label>
                <input className="input" type="text" name="password" value={form.password} onChange={handleChange} required minLength={6} placeholder="Min. 6 caracteres" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="field">
                <label className="label">Teléfono</label>
                <input
                  className="input"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="0991234567"
                  inputMode="numeric"
                  maxLength={10}
                  title="Ingresa exactamente 10 dígitos"
                />
                {form.telefono && form.telefono.length !== 10 && (
                  <span style={{ fontSize: 11.5, color: 'var(--c-danger)', marginTop: 4, display: 'block' }}>
                    {form.telefono.length}/10 dígitos
                  </span>
                )}
              </div>
              <div className="field">
                <label className="label">Dirección</label>
                <input className="input" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Ciudad, dirección" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/clientes')}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={guardando}>
                <Icon name="check" size={14} /> {guardando ? 'Guardando...' : 'Crear cliente'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
