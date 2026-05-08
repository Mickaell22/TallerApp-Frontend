import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'
import { useAuth } from '../../context/AuthContext'
import { getReparaciones } from '../../services/reparacionService'
import { ESTADO_LABELS, estadoCSS } from '../../utils/estados'

const FILTROS = [
  { id: 'todas',          label: 'Todas' },
  { id: 'en_diagnostico', label: 'En diagnostico' },
  { id: 'en_reparacion',  label: 'En reparacion' },
  { id: 'listo',          label: 'Listas' },
]

export default function MisReparaciones() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [filtro, setFiltro] = useState('todas')
  const [todasRep, setTodasRep] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const res = await getReparaciones()
        const data = (res.data.data || []).filter(r =>
          r.tecnico?.id === usuario?.id
        )
        setTodasRep(data)
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar reparaciones')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [usuario])

  const ASIGNADAS = todasRep.filter(r => r.estado !== 'entregado')

  const lista = ASIGNADAS.filter(r => filtro === 'todas' || r.estado === filtro)
  const activas = lista.filter(r => r.estado !== 'listo')
  const listas  = lista.filter(r => r.estado === 'listo')

  return (
    <AdminLayout active="asignadas" title="Mis reparaciones" subtitle={`Hola, ${usuario?.nombre || 'Tecnico'}`}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mis reparaciones</h1>
          <p className="page-subtitle">{ASIGNADAS.length} reparaciones asignadas - Hola, {usuario?.nombre || 'Tecnico'}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => alert('Funcionalidad de escáner QR disponible próximamente')}>
          <Icon name="qr" size={14} /> Escanear codigo
        </button>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {FILTROS.map(f => {
          const count = f.id === 'todas' ? ASIGNADAS.length : ASIGNADAS.filter(r => r.estado === f.id).length
          return (
            <button
              key={f.id}
              className={'filter-chip' + (filtro === f.id ? ' active' : '')}
              onClick={() => setFiltro(f.id)}
            >
              {f.label}
              <span style={{ opacity: .7, marginLeft: 4 }}>{count}</span>
            </button>
          )
        })}
      </div>

      {cargando ? (
        <div className="muted" style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>
      ) : (
        <>
          {activas.length > 0 && (
            <>
              <h3 style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 12px' }}>
                En curso
              </h3>
              <div className="assignment-list" style={{ marginBottom: 24 }}>
                {activas.map(r => (
                  <div
                    key={r.id}
                    className="assignment-row"
                    onClick={() => navigate(`/tecnico/${r.id}`)}
                  >
                    <div className="assignment-priority med" />
                    <div className="assignment-info">
                      <div className="assignment-device">
                        {r.dispositivo}
                        <span className="mono small muted" style={{ fontWeight: 400, marginLeft: 6 }}>{r.codigo}</span>
                      </div>
                      <div className="assignment-meta">{r.cliente?.usuario?.nombre || '—'} - {r.problema}</div>
                    </div>
                    <span className={`pill pill-${estadoCSS(r.estado)}`}>{ESTADO_LABELS[r.estado] || r.estado}</span>
                    <Icon name="chevronRight" size={16} className="assignment-arrow" />
                  </div>
                ))}
              </div>
            </>
          )}

          {listas.length > 0 && (
            <>
              <h3 style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 12px' }}>
                Listas para entregar
              </h3>
              <div className="assignment-list">
                {listas.map(r => (
                  <div
                    key={r.id}
                    className="assignment-row"
                    onClick={() => navigate(`/tecnico/${r.id}`)}
                  >
                    <div className="assignment-priority low" />
                    <div className="assignment-info">
                      <div className="assignment-device">
                        {r.dispositivo}
                        <span className="mono small muted" style={{ fontWeight: 400, marginLeft: 6 }}>{r.codigo}</span>
                      </div>
                      <div className="assignment-meta">
                        {r.cliente?.usuario?.nombre || '—'} - Costo: {r.costo ? '$' + Number(r.costo).toLocaleString('es-EC') : '—'}
                      </div>
                    </div>
                    <span className={`pill pill-${estadoCSS(r.estado)}`}>{ESTADO_LABELS[r.estado] || r.estado}</span>
                    <Icon name="chevronRight" size={16} className="assignment-arrow" />
                  </div>
                ))}
              </div>
            </>
          )}

          {activas.length === 0 && listas.length === 0 && (
            <div className="muted" style={{ padding: 40, textAlign: 'center' }}>No tienes reparaciones asignadas</div>
          )}
        </>
      )}
    </AdminLayout>
  )
}
