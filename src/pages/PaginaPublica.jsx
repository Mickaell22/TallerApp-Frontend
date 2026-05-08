import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { getSeguimiento } from '../services/reparacionService'
import { ESTADO_LABELS, estadoCSS, ESTADOS_ORDEN } from '../utils/estados'

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

export default function PaginaPublica() {
  const navigate = useNavigate()
  const [codigo, setCodigo] = useState('')
  const [result, setResult]  = useState(null)
  const [noEncontrado, setNoEncontrado] = useState(false)
  const [buscando, setBuscando] = useState(false)

  async function handleConsulta(e) {
    e.preventDefault()
    if (!codigo.trim()) return
    setBuscando(true)
    setNoEncontrado(false)
    setResult(null)
    try {
      const res = await getSeguimiento(codigo.trim())
      setResult(res.data.data)
    } catch {
      setNoEncontrado(true)
    } finally {
      setBuscando(false)
    }
  }

  return (
    <div className="public-root">
      <nav className="public-nav">
        <div className="public-nav-brand">
          <div className="sidebar-brand-mark">T</div>
          <span>TallerApp</span>
        </div>
        <div className="public-nav-links">
          <a href="#">Servicios</a>
          <a href="#">Como funciona</a>
          <a href="#">Contacto</a>
        </div>
        <div className="public-nav-cta">
          <button className="btn btn-ghost" style={{ color: '#cfd6e4' }} onClick={() => navigate('/login')}>
            Iniciar sesion
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>
            Registrarse
          </button>
        </div>
      </nav>

      <section className="hero">
        <div>
          <span className="hero-eyebrow">
            <Icon name="check" size={13} />
            +12.400 reparaciones realizadas
          </span>
          <h1 className="hero-title">
            Tu celular en <span className="accent">buenas manos</span>, sin sorpresas.
          </h1>
          <p className="hero-sub">
            Diagnostico transparente, repuestos originales y seguimiento en tiempo real
            de tu reparacion. Consulta el estado de tu equipo cuando quieras, con un solo codigo.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
              Crear cuenta gratis <Icon name="arrowRight" size={15} />
            </button>
            <button
              className="btn btn-secondary btn-lg"
              style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.15)', color: '#fff' }}
              onClick={() => navigate('/login')}
            >
              Iniciar sesion
            </button>
          </div>

          <div style={{ display: 'flex', gap: 32, marginTop: 48, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-.02em' }}>48 hs</div>
              <div style={{ fontSize: 12.5, color: '#8a98b8', fontWeight: 500 }}>Tiempo promedio</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-.02em' }}>98%</div>
              <div style={{ fontSize: 12.5, color: '#8a98b8', fontWeight: 500 }}>Reparaciones exitosas</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-.02em' }}>6 meses</div>
              <div style={{ fontSize: 12.5, color: '#8a98b8', fontWeight: 500 }}>Garantia incluida</div>
            </div>
          </div>
        </div>

        <div className="consulta-card">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,106,26,.16)', display: 'grid', placeItems: 'center', color: 'var(--c-accent-2)' }}>
              <Icon name="search" size={18} />
            </div>
            <div>
              <h3 className="consulta-title">Consulta tu reparacion</h3>
              <p className="consulta-sub" style={{ margin: 0 }}>Ingresa tu codigo de seguimiento</p>
            </div>
          </div>

          <form onSubmit={handleConsulta}>
            <input
              className="consulta-input"
              placeholder="TLR-2026-XXXX"
              value={codigo}
              onChange={e => setCodigo(e.target.value.toUpperCase())}
            />
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 12 }} disabled={buscando}>
              {buscando ? 'Consultando...' : <>Consultar estado <Icon name="arrowRight" size={15} /></>}
            </button>
          </form>

          {result && (
            <div className="consulta-result">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <div style={{ color: '#b9c2d6', fontSize: 11.5, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 3 }}>
                    {result.codigo}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{result.dispositivo}</div>
                </div>
                <span className={`pill pill-${estadoCSS(result.estado)}`}>{ESTADO_LABELS[result.estado] || result.estado}</span>
              </div>
              <div style={{ color: '#b9c2d6', fontSize: 13, marginBottom: 14 }}>{result.problema}</div>
              <MiniTimeline estadoActual={result.estado} />
            </div>
          )}

          {noEncontrado && (
            <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(196,48,48,.15)', borderRadius: 8, color: '#ff9b9b', fontSize: 13 }}>
              No se encontro ninguna reparacion con ese codigo.
            </div>
          )}

          {!result && !noEncontrado && (
            <p style={{ color: '#6c7a99', fontSize: 12, marginTop: 14, marginBottom: 0, textAlign: 'center' }}>
              Ingresa el codigo de seguimiento de tu equipo
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
