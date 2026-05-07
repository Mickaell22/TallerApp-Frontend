import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'

const ESTADO_LABELS = {
  recibido:    'Recibido',
  diagnostico: 'En diagnóstico',
  reparacion:  'En reparación',
  listo:       'Listo',
  entregado:   'Entregado',
}

const ESTADOS = ['recibido', 'diagnostico', 'reparacion', 'listo', 'entregado']

const MOCK = {
  1: {
    id: 1, codigo: 'TLR-2026-0148',
    cliente: 'Ana Torres', telefono: '+593 99 123 4567',
    dispositivo: 'Samsung Galaxy A54', falla: 'Pantalla rota, no enciende',
    estado: 'reparacion', tecnico: 'Carlos M.', fechaIngreso: '03 May 2026',
    costo: 85000, imei: '35 4823 11 098234 7',
    timeline: [
      { titulo: 'Equipo recibido',        fecha: '03 May, 10:24', who: 'Recepción', done: true },
      { titulo: 'Diagnóstico iniciado',   fecha: '03 May, 14:10', who: 'Carlos M.', done: true },
      { titulo: 'Diagnóstico finalizado', fecha: '03 May, 17:32', who: 'Carlos M.', done: true, nota: 'Pantalla y digitalizador dañados. Se requiere reemplazo.' },
      { titulo: 'Reparación en curso',    fecha: '04 May, 09:45', who: 'Carlos M.', current: true },
      { titulo: 'Listo para retirar',     fecha: '—',             done: false },
    ],
    repuestos: [
      { sku: 'PNT-SA54-OEM', nombre: 'Pantalla Samsung A54 (OEM)', cantidad: 1, costo: 55000 },
    ],
  },
}

function formatMoneda(n) {
  return '$' + n.toLocaleString('es-EC')
}

export default function DetalleReparacion() {
  const { id } = useParams()
  const navigate = useNavigate()
  const reparacion = MOCK[id]

  const [estado, setEstado] = useState(reparacion?.estado || 'recibido')
  const [nota, setNota] = useState('')
  const [repuestos, setRepuestos] = useState(reparacion?.repuestos || [])

  if (!reparacion) {
    return (
      <AdminLayout active="reparaciones" title="Reparación no encontrada">
        <div className="card" style={{ padding: 64, textAlign: 'center' }}>
          <p className="muted">No se encontró la reparación con ID {id}</p>
          <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => navigate('/admin/reparaciones')}>
            Volver a reparaciones
          </button>
        </div>
      </AdminLayout>
    )
  }

  const total = repuestos.reduce((s, r) => s + r.cantidad * r.costo, 0)

  return (
    <AdminLayout active="reparaciones" title={reparacion.dispositivo} subtitle={`${reparacion.cliente} • Ingresó ${reparacion.fechaIngreso}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/reparaciones')}>
          ← Volver
        </button>
        <span className="muted small mono">{reparacion.codigo}</span>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">{reparacion.dispositivo}</h1>
          <p className="page-subtitle">{reparacion.cliente} • Ingresó {reparacion.fechaIngreso}</p>
        </div>
        <span className={`pill pill-${estado}`} style={{ fontSize: 13, padding: '6px 14px' }}>
          {ESTADO_LABELS[estado]}
        </span>
      </div>

      <div className="detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 14 }}>Información del equipo</h3>
            <dl className="kv">
              <dt>Cliente</dt>    <dd>{reparacion.cliente}</dd>
              <dt>Teléfono</dt>   <dd className="mono">{reparacion.telefono}</dd>
              <dt>Dispositivo</dt><dd>{reparacion.dispositivo}</dd>
              <dt>Falla</dt>      <dd>{reparacion.falla}</dd>
              <dt>Técnico</dt>    <dd>{reparacion.tecnico}</dd>
              <dt>IMEI</dt>       <dd className="mono">{reparacion.imei}</dd>
            </dl>
          </div>

          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 14 }}>Actualizar estado</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 16 }}>
              {ESTADOS.map(e => (
                <button
                  key={e}
                  className={'filter-chip' + (estado === e ? ' active' : '')}
                  onClick={() => setEstado(e)}
                  style={{ justifyContent: 'center', padding: '9px 6px', fontSize: 11.5 }}
                >
                  {ESTADO_LABELS[e]}
                </button>
              ))}
            </div>
            <label className="label">Nota para el cliente (opcional)</label>
            <textarea
              className="input"
              rows="3"
              placeholder="Ej: Pantalla cambiada con éxito. Se recomienda usar protector..."
              value={nota}
              onChange={e => setNota(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 14, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary">Cancelar</button>
              <button className="btn btn-primary">
                <Icon name="check" size={14} /> Guardar cambios
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Repuestos utilizados</h3>
              <button className="btn btn-secondary btn-sm">
                <Icon name="plus" size={13} /> Agregar repuesto
              </button>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Repuesto</th>
                  <th className="num">Cant.</th>
                  <th className="num">Costo unit.</th>
                  <th className="num">Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {repuestos.map((r, i) => (
                  <tr key={i}>
                    <td className="mono small muted">{r.sku}</td>
                    <td style={{ fontWeight: 500 }}>{r.nombre}</td>
                    <td className="num">{r.cantidad}</td>
                    <td className="num">{formatMoneda(r.costo)}</td>
                    <td className="num" style={{ fontWeight: 600 }}>{formatMoneda(r.cantidad * r.costo)}</td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setRepuestos(repuestos.filter((_, j) => j !== i))}
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
                <tr style={{ background: 'var(--c-surface-2)' }}>
                  <td colSpan="4" className="num" style={{ fontWeight: 600 }}>Total repuestos</td>
                  <td className="num" style={{ fontWeight: 700, fontSize: 14 }}>{formatMoneda(total)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 18 }}>Línea de tiempo</h3>
            {reparacion.timeline.map((s, i) => (
              <div key={i} className={`timeline-step${s.done ? ' done' : s.current ? ' current' : ''}`}>
                <div className="timeline-dot">
                  {s.done && <Icon name="check" size={12} />}
                </div>
                <div>
                  <div className="timeline-title">{s.titulo}</div>
                  <div className="timeline-meta">{s.fecha}{s.who && ` • ${s.who}`}</div>
                  {s.nota && (
                    <div className="muted small" style={{ marginTop: 6, padding: '8px 10px', background: 'var(--c-surface-2)', borderRadius: 6, fontSize: 12 }}>
                      {s.nota}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 14 }}>Acciones rápidas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Icon name="phone" size={14} /> Llamar al cliente
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Icon name="bell" size={14} /> Enviar notificación
              </button>
              <button className="btn btn-primary" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/admin/facturacion')}>
                <Icon name="receipt" size={14} /> Generar factura
              </button>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}
