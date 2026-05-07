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
    cliente: 'María González', telefono: '+593 99 123 4567',
    dispositivo: 'iPhone 13 Pro', falla: 'Pantalla rota tras caída',
    estado: 'reparacion', fechaIngreso: '02 May 2026', costo: 145000,
    prioridad: 'high', imei: '35 4823 11 098234 7',
    timeline: [
      { titulo: 'Equipo recibido',        fecha: '02 May, 10:24', who: 'Recepción',  done: true },
      { titulo: 'Diagnóstico iniciado',   fecha: '02 May, 14:10', who: 'Carlos M.',  done: true },
      { titulo: 'Diagnóstico finalizado', fecha: '02 May, 17:32', who: 'Carlos M.',  done: true, nota: 'Confirmado: rotura de display + digitalizador.' },
      { titulo: 'Reparación en curso',    fecha: '03 May, 09:45', who: 'Carlos M.',  current: true },
      { titulo: 'Listo para retirar',     fecha: '—',             done: false },
    ],
    repuestos: [
      { sku: 'PNT-IP13P-OEM', nombre: 'Pantalla iPhone 13 Pro (OEM)', cantidad: 1, costo: 78000 },
    ],
  },
  2: {
    id: 2, codigo: 'TLR-2026-0147',
    cliente: 'Juan Pérez', telefono: '+593 98 234 5678',
    dispositivo: 'Samsung Galaxy A52', falla: 'No carga la batería',
    estado: 'diagnostico', fechaIngreso: '03 May 2026', costo: 38000,
    prioridad: 'med', imei: '86 7123 44 211098 3',
    timeline: [
      { titulo: 'Equipo recibido',      fecha: '03 May, 09:00', who: 'Recepción', done: true },
      { titulo: 'Diagnóstico iniciado', fecha: '03 May, 11:30', who: 'Carlos M.', current: true },
      { titulo: 'Reparación en curso',  fecha: '—', done: false },
      { titulo: 'Listo para retirar',   fecha: '—', done: false },
    ],
    repuestos: [],
  },
  4: {
    id: 4, codigo: 'TLR-2026-0145',
    cliente: 'Diego Castro', telefono: '+593 97 345 6789',
    dispositivo: 'iPhone 12', falla: 'Cambio de batería',
    estado: 'listo', fechaIngreso: '01 May 2026', costo: 52000,
    prioridad: 'low', imei: '35 1234 56 789012 4',
    timeline: [
      { titulo: 'Equipo recibido',        fecha: '01 May, 10:00', who: 'Recepción', done: true },
      { titulo: 'Diagnóstico iniciado',   fecha: '01 May, 11:00', who: 'Carlos M.', done: true },
      { titulo: 'Reparación finalizada',  fecha: '01 May, 14:30', who: 'Carlos M.', done: true, nota: 'Batería reemplazada. Ciclo de carga verificado.' },
      { titulo: 'Listo para retirar',     fecha: '01 May, 14:45', who: 'Carlos M.', done: true },
    ],
    repuestos: [
      { sku: 'BAT-IP12-ORIG', nombre: 'Batería iPhone 12 original', cantidad: 1, costo: 37000 },
    ],
  },
  9: {
    id: 9, codigo: 'TLR-2026-0140',
    cliente: 'Valentina Cruz', telefono: '+593 99 456 7890',
    dispositivo: 'Xiaomi 12T', falla: 'Botón de encendido no responde',
    estado: 'reparacion', fechaIngreso: '30 Abr 2026', costo: 31000,
    prioridad: 'med', imei: '86 9988 77 665544 1',
    timeline: [
      { titulo: 'Equipo recibido',        fecha: '30 Abr, 15:00', who: 'Recepción', done: true },
      { titulo: 'Diagnóstico finalizado', fecha: '30 Abr, 17:00', who: 'Carlos M.', done: true, nota: 'Flex del botón power dañado. Requiere reemplazo.' },
      { titulo: 'Reparación en curso',    fecha: '02 May, 10:00', who: 'Carlos M.', current: true },
      { titulo: 'Listo para retirar',     fecha: '—', done: false },
    ],
    repuestos: [],
  },
}

function formatMoneda(n) {
  return '$' + n.toLocaleString('es-EC')
}

export default function DetalleTecnico() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const reparacion  = MOCK[id]

  const [estado,    setEstado]    = useState(reparacion?.estado || 'recibido')
  const [nota,      setNota]      = useState('')
  const [repuestos, setRepuestos] = useState(reparacion?.repuestos || [])

  if (!reparacion) {
    return (
      <AdminLayout active="asignadas" title="Reparación no encontrada">
        <div className="card" style={{ padding: 64, textAlign: 'center' }}>
          <p className="muted">No se encontró la reparación con ID {id}</p>
          <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => navigate('/tecnico')}>
            Volver a mis reparaciones
          </button>
        </div>
      </AdminLayout>
    )
  }

  const total = repuestos.reduce((s, r) => s + r.cantidad * r.costo, 0)

  return (
    <AdminLayout active="asignadas" title={reparacion.dispositivo} subtitle={`${reparacion.cliente} • Ingresó ${reparacion.fechaIngreso}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tecnico')}>
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
              <dt>Cliente</dt>          <dd>{reparacion.cliente}</dd>
              <dt>Teléfono</dt>         <dd className="mono">{reparacion.telefono}</dd>
              <dt>Dispositivo</dt>      <dd>{reparacion.dispositivo}</dd>
              <dt>Falla reportada</dt>  <dd>{reparacion.falla}</dd>
              <dt>Prioridad</dt>
              <dd>
                <span style={{
                  fontWeight: 600,
                  color: reparacion.prioridad === 'high' ? 'var(--c-danger)' : reparacion.prioridad === 'med' ? 'var(--c-warn)' : 'var(--c-success)',
                }}>
                  {reparacion.prioridad === 'high' ? 'Alta' : reparacion.prioridad === 'med' ? 'Media' : 'Baja'}
                </span>
              </dd>
              <dt>IMEI</dt>             <dd className="mono">{reparacion.imei}</dd>
              <dt>Patrón / PIN</dt>     <dd className="muted" style={{ fontStyle: 'italic' }}>Cliente lo informará al retirar</dd>
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
                {repuestos.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: 24 }} className="muted">
                      No hay repuestos registrados aún
                    </td>
                  </tr>
                )}
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
                {repuestos.length > 0 && (
                  <tr style={{ background: 'var(--c-surface-2)' }}>
                    <td colSpan="4" className="num" style={{ fontWeight: 600 }}>Total repuestos</td>
                    <td className="num" style={{ fontWeight: 700, fontSize: 14 }}>{formatMoneda(total)}</td>
                    <td></td>
                  </tr>
                )}
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
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Icon name="receipt" size={14} /> Generar factura
              </button>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}
