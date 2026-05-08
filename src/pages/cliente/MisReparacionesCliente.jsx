import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ClientLayout from '../../components/layout/ClientLayout'
import Icon from '../../components/ui/Icon'
import { useAuth } from '../../context/AuthContext'
import { getHistorialCliente } from '../../services/reparacionService'
import { ESTADO_LABELS, estadoCSS, ESTADOS_ORDEN } from '../../utils/estados'

function formatMoneda(n) {
  if (!n) return '—'
  return '$' + Number(n).toLocaleString('es-EC')
}

function formatFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })
}

function MiniTimeline({ estadoActual }) {
  const idx = ESTADOS_ORDEN.indexOf(estadoActual)
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {ESTADOS_ORDEN.map((e, i) => {
        const done    = i < idx
        const current = i === idx
        const active  = done || current
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < ESTADOS_ORDEN.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: done ? 'var(--c-success)' : current ? 'var(--c-accent)' : 'rgba(255,255,255,.1)',
                color: active ? '#fff' : '#8a98b8',
                display: 'grid', placeItems: 'center',
                fontSize: 10, fontWeight: 700,
                boxShadow: current ? '0 0 0 4px rgba(255,106,26,.18)' : 'none',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 10.5, color: active ? '#fff' : '#8a98b8', fontWeight: active ? 600 : 500, textAlign: 'center', maxWidth: 60, lineHeight: 1.2 }}>
                {ESTADO_LABELS[e]}
              </div>
            </div>
            {i < ESTADOS_ORDEN.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i + 1 <= idx ? 'var(--c-success)' : 'rgba(255,255,255,.1)', margin: '0 2px', marginBottom: 18 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function MisReparacionesCliente() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [reparaciones, setReparaciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!usuario?.cliente_id) {
      setCargando(false)
      setError('No se encontró el perfil de cliente. Cierra sesión e ingresa nuevamente.')
      return
    }
    async function cargar() {
      try {
        const res = await getHistorialCliente(usuario.cliente_id)
        setReparaciones(res.data.data || [])
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar reparaciones')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [usuario])

  const activa = reparaciones.find(r => r.estado !== 'entregado')

  return (
    <ClientLayout>
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">Hola, {usuario?.nombre || 'Cliente'}</h1>
        <p className="page-subtitle">
          {activa ? 'Tienes 1 reparacion en curso' : 'No tienes reparaciones en curso'}
        </p>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

      {cargando ? (
        <div className="muted" style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>
      ) : (
        <>
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
                  <p style={{ color: '#b9c2d6', margin: 0, fontSize: 14 }}>{activa.problema}</p>
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
              <MiniTimeline estadoActual={activa.estado} />
            </div>
          )}

          <h3 style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 14px' }}>
            Historial
          </h3>
          {reparaciones.length === 0 && (
            <div className="muted" style={{ textAlign: 'center', padding: 32 }}>Sin reparaciones registradas</div>
          )}
          <div className="client-grid">
            {reparaciones.map(r => (
              <div key={r.id} className="repair-card" onClick={() => navigate(`/cliente/${r.id}`)}>
                <div className="repair-card-top">
                  <div>
                    <h4 className="repair-card-device">{r.dispositivo}</h4>
                    <p className="repair-card-issue">{r.problema}</p>
                  </div>
                  <span className={`pill pill-${estadoCSS(r.estado)}`}>{ESTADO_LABELS[r.estado] || r.estado}</span>
                </div>
                <div className="repair-card-meta">
                  <span><Icon name="calendar" size={12} style={{ verticalAlign: '-2px', marginRight: 4 }} />{formatFecha(r.fecha_entrada)}</span>
                  <span style={{ fontWeight: 600, color: 'var(--c-text)' }}>{formatMoneda(r.costo)}</span>
                </div>
                <div className="repair-card-code" style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--c-border)' }}>
                  {r.codigo}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </ClientLayout>
  )
}
