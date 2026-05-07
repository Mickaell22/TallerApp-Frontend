import { useNavigate, useParams } from 'react-router-dom'
import ClientLayout from '../../components/layout/ClientLayout'
import Icon from '../../components/ui/Icon'

const ESTADO_LABELS = {
  recibido:    'Recibido',
  diagnostico: 'En diagnóstico',
  reparacion:  'En reparación',
  listo:       'Listo',
  entregado:   'Entregado',
}

const MOCK = {
  101: {
    id: 101, codigo: 'TLR-2026-0148', dispositivo: 'iPhone 13 Pro',
    falla: 'Pantalla rota tras caída', estado: 'reparacion',
    fechaIngreso: '02 May 2026', costo: 145000,
    timeline: [
      { estado: 'recibido',    titulo: 'Equipo recibido',      fecha: '02 May, 10:24', nota: 'Recibido en sucursal Centro.',                         done: true },
      { estado: 'diagnostico', titulo: 'En diagnóstico',       fecha: '02 May, 14:10', nota: 'Confirmamos rotura de display y digitalizador.',       done: true },
      { estado: 'reparacion',  titulo: 'En reparación',        fecha: '03 May, 09:45', nota: 'Cambio de pantalla en proceso.',                       current: true },
      { estado: 'listo',       titulo: 'Listo para retirar',   fecha: '—',             nota: 'Te avisamos por WhatsApp.',                            done: false },
      { estado: 'entregado',   titulo: 'Entregado',            fecha: '—',                                                                           done: false },
    ],
  },
  102: {
    id: 102, codigo: 'TLR-2026-0102', dispositivo: 'iPad Air (4ª gen)',
    falla: 'Cambio de batería', estado: 'entregado',
    fechaIngreso: '12 Mar 2026', costo: 64000,
    timeline: [
      { estado: 'recibido',    titulo: 'Equipo recibido',    fecha: '12 Mar, 11:00', done: true },
      { estado: 'diagnostico', titulo: 'En diagnóstico',     fecha: '12 Mar, 16:30', done: true },
      { estado: 'reparacion',  titulo: 'En reparación',      fecha: '14 Mar, 12:00', done: true },
      { estado: 'listo',       titulo: 'Listo para retirar', fecha: '14 Mar, 12:30', done: true },
      { estado: 'entregado',   titulo: 'Entregado',          fecha: '15 Mar, 18:42', done: true },
    ],
  },
  103: {
    id: 103, codigo: 'TLR-2025-0871', dispositivo: 'iPhone 11',
    falla: 'Daño por líquido', estado: 'entregado',
    fechaIngreso: '08 Nov 2025', costo: 72000,
    timeline: [
      { estado: 'recibido',    titulo: 'Equipo recibido', fecha: '08 Nov 2025', done: true },
      { estado: 'diagnostico', titulo: 'En diagnóstico',  fecha: '08 Nov 2025', done: true },
      { estado: 'reparacion',  titulo: 'En reparación',   fecha: '09 Nov 2025', done: true },
      { estado: 'listo',       titulo: 'Listo',           fecha: '10 Nov 2025', done: true },
      { estado: 'entregado',   titulo: 'Entregado',       fecha: '11 Nov 2025', done: true },
    ],
  },
}

function formatMoneda(n) {
  if (!n) return '—'
  return '$' + n.toLocaleString('es-EC')
}

export default function DetalleReparacionCliente() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const reparacion = MOCK[id]

  if (!reparacion) {
    return (
      <ClientLayout>
        <div className="card" style={{ padding: 64, textAlign: 'center' }}>
          <p className="muted">No se encontró la reparación.</p>
          <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => navigate('/cliente')}>
            Volver al historial
          </button>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/cliente')} style={{ marginBottom: 18 }}>
        ← Volver al historial
      </button>

      <div className="page-header">
        <div>
          <h1 className="page-title">{reparacion.dispositivo}</h1>
          <p className="page-subtitle">
            {reparacion.falla} • <span className="mono">{reparacion.codigo}</span>
          </p>
        </div>
        <span className={`pill pill-${reparacion.estado}`} style={{ fontSize: 13, padding: '6px 14px' }}>
          {ESTADO_LABELS[reparacion.estado]}
        </span>
      </div>

      <div className="detail-grid">
        <div className="card card-pad">
          <h3 className="card-title" style={{ marginBottom: 18 }}>Estado de tu reparación</h3>
          {reparacion.timeline.map((s, i) => (
            <div key={i} className={`timeline-step${s.done ? ' done' : s.current ? ' current' : ''}`}>
              <div className="timeline-dot">
                {s.done && <Icon name="check" size={12} />}
              </div>
              <div>
                <div className="timeline-title">{s.titulo}</div>
                <div className="timeline-meta">{s.fecha}</div>
                {s.nota && (
                  <div className="muted small" style={{ marginTop: 6 }}>{s.nota}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 14 }}>Resumen</h3>
            <dl className="kv">
              <dt>Equipo</dt>           <dd>{reparacion.dispositivo}</dd>
              <dt>Código</dt>           <dd className="mono">{reparacion.codigo}</dd>
              <dt>Ingreso</dt>          <dd>{reparacion.fechaIngreso}</dd>
              <dt>Costo estimado</dt>   <dd style={{ fontWeight: 600 }}>{formatMoneda(reparacion.costo)}</dd>
              <dt>Garantía</dt>         <dd>6 meses sobre el repuesto</dd>
            </dl>
          </div>

          <div className="card card-pad" style={{ background: 'var(--c-accent-soft)', border: '1px solid #ffd9bf' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              <Icon name="phone" size={16} style={{ color: 'var(--c-accent)' }} />
              <strong style={{ fontSize: 13 }}>¿Consultas?</strong>
            </div>
            <p style={{ margin: '0 0 10px', fontSize: 12.5, color: 'var(--c-text-muted)' }}>
              Escríbenos por WhatsApp y te respondemos enseguida.
            </p>
            <button className="btn btn-primary btn-sm" style={{ width: '100%' }}>
              Contactar al taller
            </button>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}
