import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ClientLayout from '../../components/layout/ClientLayout'
import Icon from '../../components/ui/Icon'
import { getReparacion } from '../../services/reparacionService'
import { ESTADO_LABELS, estadoCSS, ESTADOS_ORDEN, ESTADO_TITULOS } from '../../utils/estados'

function formatMoneda(n) {
  if (!n) return '—'
  return '$' + Number(n).toLocaleString('es-EC')
}

function formatFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })
}

function construirTimeline(estadoActual) {
  const idx = ESTADOS_ORDEN.indexOf(estadoActual)
  return ESTADOS_ORDEN.map((e, i) => ({
    titulo: ESTADO_TITULOS[e] || e,
    done: i < idx,
    current: i === idx,
  }))
}

export default function DetalleReparacionCliente() {
  const { id }     = useParams()
  const navigate   = useNavigate()

  const [reparacion, setReparacion] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const res = await getReparacion(id)
        setReparacion(res.data.data)
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar la reparacion')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id])

  if (cargando) {
    return (
      <ClientLayout>
        <div className="muted" style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>
      </ClientLayout>
    )
  }

  if (error || !reparacion) {
    return (
      <ClientLayout>
        <div className="card" style={{ padding: 64, textAlign: 'center' }}>
          <p className="muted">{error || 'No se encontro la reparacion.'}</p>
          <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => navigate('/cliente')}>
            Volver al historial
          </button>
        </div>
      </ClientLayout>
    )
  }

  const timeline = construirTimeline(reparacion.estado)

  return (
    <ClientLayout>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/cliente')} style={{ marginBottom: 18 }}>
        ← Volver al historial
      </button>

      <div className="page-header">
        <div>
          <h1 className="page-title">{reparacion.dispositivo}</h1>
          <p className="page-subtitle">
            {reparacion.problema} - <span className="mono">{reparacion.codigo}</span>
          </p>
        </div>
        <span className={`pill pill-${estadoCSS(reparacion.estado)}`} style={{ fontSize: 13, padding: '6px 14px' }}>
          {ESTADO_LABELS[reparacion.estado] || reparacion.estado}
        </span>
      </div>

      <div className="detail-grid">
        <div className="card card-pad">
          <h3 className="card-title" style={{ marginBottom: 18 }}>Estado de tu reparacion</h3>
          {timeline.map((s, i) => (
            <div key={i} className={`timeline-step${s.done ? ' done' : s.current ? ' current' : ''}`}>
              <div className="timeline-dot">
                {s.done && <Icon name="check" size={12} />}
              </div>
              <div>
                <div className="timeline-title">{s.titulo}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 14 }}>Resumen</h3>
            <dl className="kv">
              <dt>Equipo</dt>           <dd>{reparacion.dispositivo}</dd>
              <dt>Codigo</dt>           <dd className="mono">{reparacion.codigo}</dd>
              <dt>Ingreso</dt>          <dd>{formatFecha(reparacion.fecha_entrada)}</dd>
              <dt>Costo estimado</dt>   <dd style={{ fontWeight: 600 }}>{formatMoneda(reparacion.costo)}</dd>
              <dt>Garantia</dt>         <dd>6 meses sobre el repuesto</dd>
            </dl>
          </div>

          <div className="card card-pad" style={{ background: 'var(--c-accent-soft)', border: '1px solid #ffd9bf' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              <Icon name="phone" size={16} style={{ color: 'var(--c-accent)' }} />
              <strong style={{ fontSize: 13 }}>Consultas?</strong>
            </div>
            <p style={{ margin: '0 0 10px', fontSize: 12.5, color: 'var(--c-text-muted)' }}>
              Escribenos por WhatsApp y te respondemos enseguida.
            </p>
            <button
              className="btn btn-primary btn-sm"
              style={{ width: '100%' }}
              onClick={() => alert('Mensaje de WhatsApp enviado al taller. Te responderemos pronto.')}
            >
              Contactar al taller
            </button>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}
