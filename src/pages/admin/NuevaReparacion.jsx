import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'

export default function NuevaReparacion() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    cliente: '', telefono: '', email: '',
    dispositivo: '', marca: '', modelo: '',
    falla: '', observaciones: '', tecnico: '',
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/admin/reparaciones')
  }

  return (
    <AdminLayout active="reparaciones" title="Nueva reparación" subtitle="Registrar ingreso de equipo">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/reparaciones')}>
          ← Volver
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div className="card card-pad">
              <h3 className="card-title" style={{ marginBottom: 16 }}>Datos del cliente</h3>
              <div className="field">
                <label className="label">Nombre completo</label>
                <input className="input" name="cliente" value={form.cliente} onChange={handleChange} placeholder="Juan Pérez" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label className="label">Teléfono</label>
                  <input className="input" name="telefono" value={form.telefono} onChange={handleChange} placeholder="+593 99 000 0000" />
                </div>
                <div className="field">
                  <label className="label">Correo electrónico</label>
                  <input className="input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" />
                </div>
              </div>
            </div>

            <div className="card card-pad">
              <h3 className="card-title" style={{ marginBottom: 16 }}>Equipo</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label className="label">Marca</label>
                  <select className="input" name="marca" value={form.marca} onChange={handleChange} required>
                    <option value="">Seleccionar...</option>
                    <option>Apple</option>
                    <option>Samsung</option>
                    <option>Xiaomi</option>
                    <option>Motorola</option>
                    <option>Huawei</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="field">
                  <label className="label">Modelo</label>
                  <input className="input" name="modelo" value={form.modelo} onChange={handleChange} placeholder="Ej: iPhone 13, Galaxy A54..." required />
                </div>
              </div>
              <div className="field">
                <label className="label">Falla reportada por el cliente</label>
                <textarea className="input" name="falla" value={form.falla} onChange={handleChange} rows="3" placeholder="Describe el problema con el equipo..." required />
              </div>
              <div className="field">
                <label className="label">Observaciones del técnico (opcional)</label>
                <textarea className="input" name="observaciones" value={form.observaciones} onChange={handleChange} rows="2" placeholder="Estado físico del equipo, accesorios recibidos..." />
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div className="card card-pad">
              <h3 className="card-title" style={{ marginBottom: 16 }}>Asignación</h3>
              <div className="field">
                <label className="label">Técnico asignado</label>
                <select className="input" name="tecnico" value={form.tecnico} onChange={handleChange}>
                  <option value="">Sin asignar</option>
                  <option>Carlos Méndez</option>
                  <option>Pedro Alvarado</option>
                </select>
              </div>
              <div className="field">
                <label className="label">Prioridad</label>
                <select className="input">
                  <option value="low">Baja</option>
                  <option value="med">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>

            <div className="card card-pad" style={{ background: 'var(--c-surface-2)' }}>
              <h3 className="card-title" style={{ marginBottom: 12 }}>Resumen</h3>
              <dl className="kv">
                <dt>Cliente</dt>    <dd>{form.cliente || '—'}</dd>
                <dt>Equipo</dt>     <dd>{[form.marca, form.modelo].filter(Boolean).join(' ') || '—'}</dd>
                <dt>Técnico</dt>    <dd>{form.tecnico || 'Sin asignar'}</dd>
                <dt>Estado inicial</dt><dd><span className="pill pill-recibido">Recibido</span></dd>
              </dl>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/admin/reparaciones')}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                <Icon name="check" size={14} /> Registrar ingreso
              </button>
            </div>

          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
