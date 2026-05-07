import { useNavigate } from 'react-router-dom'
import ClientLayout from '../../components/layout/ClientLayout'
import Icon from '../../components/ui/Icon'

const ESTADO_LABELS = {
  recibido:    'Recibido',
  diagnostico: 'En diagnóstico',
  reparacion:  'En reparación',
  listo:       'Listo',
  entregado:   'Entregado',
}

const REPARACIONES = [
  {
    id: 101, codigo: 'TLR-2026-0148', dispositivo: 'iPhone 13 Pro',
    falla: 'Pantalla rota tras caída', estado: 'reparacion',
    fechaIngreso: '02 May 2026', costo: 145000,
    timeline: [
      { estado: 'recibido',    titulo: 'Equipo recibido',      fecha: '02 May, 10:24', done: true },
      { estado: 'diagnostico', titulo: 'En diagnóstico',       fecha: '02 May, 14:10', done: true },
      { estado: 'reparacion',  titulo: 'En reparación',        fecha: '03 May, 09:45', current: true },
      { estado: 'listo',       titulo: 'Listo para retirar',   fecha: '—',             done: false },
      { estado: 'entregado',   titulo: 'Entregado',            fecha: '—',             done: false },
    ],
  },
  {
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
  {
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
]

function formatMoneda(n) {
  if (!n) return '—'
  return '$' + n.toLocaleString('es-EC')
}

function MiniTimeline({ timeline, dark }) {
  const fg    = dark ? '#fff'       : 'var(--c-text)'
  const muted = dark ? '#8a98b8'    : 'var(--c-text-muted)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {timeline.map((step, i) => {
        const active = step.done || step.current
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < timeline.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: step.done ? 'var(--c-success)' : step.current ? 'var(--c-accent)' : (dark ? 'rgba(255,255,255,.1)' : 'var(--c-border)'),
                color: active ? '#fff' : muted,
                display: 'grid', placeItems: 'center',
                fontSize: 10, fontWeight: 700,
                boxShadow: step.current ? '0 0 0 4px rgba(255,106,26,.18)' : 'none',
              }}>
                {step.done ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 10.5, color: active ? fg : muted, fontWeight: active ? 600 : 500, textAlign: 'center', maxWidth: 60, lineHeight: 1.2 }}>
                {ESTADO_LABELS[step.estado]}
              </div>
            </div>
            {i < timeline.length - 1 && (
              <div style={{ flex: 1, height: 2, background: timeline[i + 1].done ? 'var(--c-success)' : (dark ? 'rgba(255,255,255,.1)' : 'var(--c-border)'), margin: '0 2px', marginBottom: 18 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function MisReparacionesCliente() {
  const navigate = useNavigate()
  const activa   = REPARACIONES.find(r => r.estado !== 'entregado')

  return (
    <ClientLayout>
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">Hola, María</h1>
        <p className="page-subtitle">
          {activa ? 'Tienes 1 reparación en curso' : 'No tienes reparaciones en curso'}
        </p>
      </div>

      {activa && (
        <div
          className="card"
          style={{
            padding: 24,
            background: 'linear-gradient(135deg, var(--c-primary) 0%, var(--c-primary-2) 100%)',
            color: '#fff',
            marginBottom: 24,
            border: 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <div style={{ color: '#b9c2d6', fontSize: 11.5, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 6 }}>
                En curso
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-.02em' }}>
                {activa.dispositivo}
              </h2>
              <p style={{ color: '#b9c2d6', margin: 0, fontSize: 14 }}>{activa.falla}</p>
              <div className="mono small" style={{ color: '#8a98b8', marginTop: 8 }}>{activa.codigo}</div>
            </div>
            <button
              className="btn"
              style={{ background: 'rgba(255,255,255,.1)', color: '#fff' }}
              onClick={() => navigate(`/cliente/${activa.id}`)}
            >
              Ver detalle <Icon name="arrowRight" size={13} />
            </button>
          </div>
          <MiniTimeline timeline={activa.timeline} dark />
        </div>
      )}

      <h3 style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 14px' }}>
        Historial
      </h3>
      <div className="client-grid">
        {REPARACIONES.map(r => (
          <div key={r.id} className="repair-card" onClick={() => navigate(`/cliente/${r.id}`)}>
            <div className="repair-card-top">
              <div>
                <h4 className="repair-card-device">{r.dispositivo}</h4>
                <p className="repair-card-issue">{r.falla}</p>
              </div>
              <span className={`pill pill-${r.estado}`}>{ESTADO_LABELS[r.estado]}</span>
            </div>
            <div className="repair-card-meta">
              <span><Icon name="calendar" size={12} style={{ verticalAlign: '-2px', marginRight: 4 }} />{r.fechaIngreso}</span>
              <span style={{ fontWeight: 600, color: 'var(--c-text)' }}>{formatMoneda(r.costo)}</span>
            </div>
            <div className="repair-card-code" style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--c-border)' }}>
              {r.codigo}
            </div>
          </div>
        ))}
      </div>
    </ClientLayout>
  )
}
