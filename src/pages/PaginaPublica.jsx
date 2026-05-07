import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'

const ESTADO_LABELS = {
  recibido:    'Recibido',
  diagnostico: 'En diagnóstico',
  reparacion:  'En reparación',
  listo:       'Listo',
  entregado:   'Entregado',
}

const MOCK_REPARACIONES = [
  {
    codigo: 'TLR-2026-0148', dispositivo: 'iPhone 13 Pro',
    falla: 'Pantalla rota tras caída', estado: 'reparacion',
    timeline: [
      { estado: 'recibido',    titulo: 'Recibido',           fecha: '02 May, 10:24', done: true },
      { estado: 'diagnostico', titulo: 'En diagnóstico',     fecha: '02 May, 14:10', done: true },
      { estado: 'reparacion',  titulo: 'En reparación',      fecha: '03 May, 09:45', current: true },
      { estado: 'listo',       titulo: 'Listo',              fecha: '—',             done: false },
      { estado: 'entregado',   titulo: 'Entregado',          fecha: '—',             done: false },
    ],
  },
]

function MiniTimeline({ timeline }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {timeline.map((step, i) => {
        const active = step.done || step.current
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < timeline.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: step.done ? 'var(--c-success)' : step.current ? 'var(--c-accent)' : 'rgba(255,255,255,.1)',
                color: active ? '#fff' : '#8a98b8',
                display: 'grid', placeItems: 'center',
                fontSize: 10, fontWeight: 700,
                boxShadow: step.current ? '0 0 0 4px rgba(255,106,26,.18)' : 'none',
              }}>
                {step.done ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 10.5, color: active ? '#fff' : '#8a98b8', fontWeight: active ? 600 : 500, textAlign: 'center', maxWidth: 60, lineHeight: 1.2 }}>
                {ESTADO_LABELS[step.estado]}
              </div>
            </div>
            {i < timeline.length - 1 && (
              <div style={{ flex: 1, height: 2, background: timeline[i + 1].done ? 'var(--c-success)' : 'rgba(255,255,255,.1)', margin: '0 2px', marginBottom: 18 }} />
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

  function handleConsulta(e) {
    e.preventDefault()
    if (!codigo.trim()) return
    const found = MOCK_REPARACIONES.find(r => r.codigo.toLowerCase() === codigo.trim().toLowerCase())
    if (found) {
      setResult(found)
      setNoEncontrado(false)
    } else {
      setResult(null)
      setNoEncontrado(true)
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
          <a href="#">Cómo funciona</a>
          <a href="#">Contacto</a>
        </div>
        <div className="public-nav-cta">
          <button className="btn btn-ghost" style={{ color: '#cfd6e4' }} onClick={() => navigate('/login')}>
            Iniciar sesión
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
            Diagnóstico transparente, repuestos originales y seguimiento en tiempo real
            de tu reparación. Consulta el estado de tu equipo cuando quieras, con un solo código.
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
              Iniciar sesión
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
              <div style={{ fontSize: 12.5, color: '#8a98b8', fontWeight: 500 }}>Garantía incluida</div>
            </div>
          </div>
        </div>

        <div className="consulta-card">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,106,26,.16)', display: 'grid', placeItems: 'center', color: 'var(--c-accent-2)' }}>
              <Icon name="search" size={18} />
            </div>
            <div>
              <h3 className="consulta-title">Consulta tu reparación</h3>
              <p className="consulta-sub" style={{ margin: 0 }}>Ingresa tu código de seguimiento</p>
            </div>
          </div>

          <form onSubmit={handleConsulta}>
            <input
              className="consulta-input"
              placeholder="TLR-2026-XXXX"
              value={codigo}
              onChange={e => setCodigo(e.target.value.toUpperCase())}
            />
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 12 }}>
              Consultar estado <Icon name="arrowRight" size={15} />
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
                <span className={`pill pill-${result.estado}`}>{ESTADO_LABELS[result.estado]}</span>
              </div>
              <div style={{ color: '#b9c2d6', fontSize: 13, marginBottom: 14 }}>{result.falla}</div>
              <MiniTimeline timeline={result.timeline} />
            </div>
          )}

          {noEncontrado && (
            <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(196,48,48,.15)', borderRadius: 8, color: '#ff9b9b', fontSize: 13 }}>
              No se encontró ninguna reparación con ese código.
            </div>
          )}

          {!result && !noEncontrado && (
            <p style={{ color: '#6c7a99', fontSize: 12, marginTop: 14, marginBottom: 0, textAlign: 'center' }}>
              Prueba con el código: <span className="mono" style={{ color: '#b9c2d6' }}>TLR-2026-0148</span>
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
