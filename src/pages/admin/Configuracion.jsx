import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'
import { getUsuarios } from '../../services/usuarioService'

const ROL_LABELS = { administrador: 'Administrador', tecnico: 'Técnico', cliente: 'Cliente' }

export default function Configuracion() {
  const [taller, setTaller] = useState({
    nombre:    'TallerApp — Reparación de Celulares',
    telefono:  '+593 99 000 0000',
    email:     'contacto@tallerapp.com',
    direccion: 'Av. 9 de Octubre 123, Guayaquil',
    horario:   'Lun–Vie 08:00–18:00 · Sáb 09:00–14:00',
  })

  const [notif, setNotif] = useState({
    cambioEstado:    true,
    stockBajo:       true,
    nuevaReparacion: false,
    facturaEmitida:  true,
  })

  const [usuarios, setUsuarios] = useState([])
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true)
  const [tallerGuardado, setTallerGuardado] = useState(false)

  useEffect(() => {
    async function cargarUsuarios() {
      try {
        const res = await getUsuarios()
        setUsuarios(res.data.data || [])
      } catch {
        // Si falla, la tabla queda vacía silenciosamente
      } finally {
        setCargandoUsuarios(false)
      }
    }
    cargarUsuarios()
  }, [])

  function handleTaller(e) {
    setTaller({ ...taller, [e.target.name]: e.target.value })
    setTallerGuardado(false)
  }

  function handleNotif(key) {
    setNotif({ ...notif, [key]: !notif[key] })
  }

  function handleGuardarTaller(e) {
    e.preventDefault()
    setTallerGuardado(true)
  }

  return (
    <AdminLayout active="configuracion" title="Configuración" subtitle="Ajustes del sistema">
      <div className="page-header">
        <div>
          <h1 className="page-title">Configuración</h1>
          <p className="page-subtitle">Ajustes del sistema</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, alignItems: 'start' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Datos del taller */}
          <form onSubmit={handleGuardarTaller}>
            <div className="card card-pad">
              <h3 className="card-title" style={{ marginBottom: 16 }}>Datos del taller</h3>
              <div className="field">
                <label className="label">Nombre del taller</label>
                <input className="input" name="nombre" value={taller.nombre} onChange={handleTaller} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label className="label">Teléfono</label>
                  <input className="input" name="telefono" value={taller.telefono} onChange={handleTaller} />
                </div>
                <div className="field">
                  <label className="label">Correo de contacto</label>
                  <input className="input" type="email" name="email" value={taller.email} onChange={handleTaller} />
                </div>
              </div>
              <div className="field">
                <label className="label">Dirección</label>
                <input className="input" name="direccion" value={taller.direccion} onChange={handleTaller} />
              </div>
              <div className="field">
                <label className="label">Horario de atención</label>
                <input className="input" name="horario" value={taller.horario} onChange={handleTaller} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                {tallerGuardado && (
                  <span className="muted small" style={{ color: 'var(--c-success)', alignSelf: 'center' }}>
                    <Icon name="check" size={13} /> Guardado
                  </span>
                )}
                <button type="submit" className="btn btn-primary">
                  <Icon name="check" size={14} /> Guardar cambios
                </button>
              </div>
            </div>
          </form>

          {/* Usuarios */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Usuarios y roles</h3>
            </div>
            {cargandoUsuarios ? (
              <div className="muted" style={{ padding: 32, textAlign: 'center' }}>Cargando usuarios...</div>
            ) : (
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: 24 }} className="muted">
                        Sin usuarios registrados
                      </td>
                    </tr>
                  )}
                  {usuarios.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 500 }}>{u.nombre}</td>
                      <td className="muted">{u.email}</td>
                      <td>
                        <span className="pill" style={{
                          background: u.rol === 'administrador' ? 'var(--c-primary-bg)'
                                    : u.rol === 'tecnico'       ? 'var(--c-surface-2)'
                                    :                             'var(--c-accent-soft)',
                          color:      u.rol === 'administrador' ? 'var(--c-primary)'
                                    : u.rol === 'tecnico'       ? 'var(--c-text-muted)'
                                    :                             'var(--c-accent)',
                        }}>
                          {ROL_LABELS[u.rol] || u.rol}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Notificaciones */}
          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 16 }}>Notificaciones por correo</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { key: 'cambioEstado',    label: 'Cambio de estado de reparación', desc: 'Notificar al cliente cuando cambia el estado' },
                { key: 'stockBajo',       label: 'Alerta de stock bajo',           desc: 'Notificar al admin cuando un repuesto baja del mínimo' },
                { key: 'nuevaReparacion', label: 'Nueva reparación ingresada',     desc: 'Notificar al técnico asignado' },
                { key: 'facturaEmitida',  label: 'Factura emitida',                desc: 'Enviar copia de la factura al cliente' },
              ].map(({ key, label, desc }) => (
                <div
                  key={key}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 14, cursor: 'pointer' }}
                  onClick={() => handleNotif(key)}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: 6, marginTop: 2, flexShrink: 0,
                    background: notif[key] ? 'var(--c-accent)' : 'var(--c-border)',
                    border: `2px solid ${notif[key] ? 'var(--c-accent)' : 'var(--c-border-strong)'}`,
                    display: 'grid', placeItems: 'center',
                    transition: 'background .15s, border-color .15s',
                  }}>
                    {notif[key] && <Icon name="check" size={11} style={{ color: '#fff' }} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13.5 }}>{label}</div>
                    <div className="muted small" style={{ marginTop: 2 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen del sistema */}
          <div className="card card-pad" style={{ background: 'var(--c-surface-2)' }}>
            <h3 className="card-title" style={{ marginBottom: 12 }}>Información del sistema</h3>
            <dl className="kv">
              <dt>Versión</dt>       <dd className="mono">v1.0.0</dd>
              <dt>Frontend</dt>     <dd>React 18 + Vite</dd>
              <dt>Backend</dt>      <dd>Node.js + Express</dd>
              <dt>Base de datos</dt><dd>PostgreSQL 16</dd>
            </dl>
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}
