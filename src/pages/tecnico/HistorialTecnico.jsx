import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'
import { useAuth } from '../../context/AuthContext'
import { getReparaciones } from '../../services/reparacionService'

function formatMoneda(n) {
  if (!n) return '—'
  return '$' + Number(n).toLocaleString('es-EC')
}

function formatFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function HistorialTecnico() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [search, setSearch] = useState('')
  const [historial, setHistorial] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const res = await getReparaciones()
        const data = (res.data.data || []).filter(r =>
          r.tecnico?.id === usuario?.id && r.estado === 'entregado'
        )
        setHistorial(data)
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar historial')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [usuario])

  const lista = historial.filter(r => {
    if (!search) return true
    const q = search.toLowerCase()
    const cliente = r.cliente?.usuario?.nombre || ''
    return (r.codigo + cliente + r.dispositivo).toLowerCase().includes(q)
  })

  const totalFacturado = historial.reduce((s, r) => s + Number(r.costo || 0), 0)

  return (
    <AdminLayout active="historial" title="Historial" subtitle="Reparaciones completadas">
      <div className="page-header">
        <div>
          <h1 className="page-title">Historial</h1>
          <p className="page-subtitle">{historial.length} reparaciones completadas</p>
        </div>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)', marginBottom: 16 }}>
        <div className="stat-card">
          <div className="stat-card-icon green"><Icon name="check" size={17} /></div>
          <div className="stat-card-label">Completadas</div>
          <div className="stat-card-value">{historial.length}</div>
          <div className="stat-card-delta"><Icon name="arrowUp" size={11} />Total entregadas</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--c-primary-bg)', color: 'var(--c-primary)' }}>
            <Icon name="receipt" size={17} />
          </div>
          <div className="stat-card-label">Total facturado</div>
          <div className="stat-card-value">{formatMoneda(totalFacturado)}</div>
          <div className="stat-card-delta">en reparaciones propias</div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="search">
            <Icon name="search" size={14} />
            <input
              placeholder="Buscar por codigo, cliente o equipo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {cargando ? (
          <div className="muted" style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Cliente</th>
                <th>Dispositivo</th>
                <th>Falla</th>
                <th>Fecha entrega</th>
                <th className="num">Costo</th>
              </tr>
            </thead>
            <tbody>
              {lista.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 32 }} className="muted">
                    Sin reparaciones completadas
                  </td>
                </tr>
              )}
              {lista.map(r => (
                <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/tecnico/${r.id}`)}>
                  <td className="mono small muted">{r.codigo}</td>
                  <td style={{ fontWeight: 500 }}>{r.cliente?.usuario?.nombre || '—'}</td>
                  <td>{r.dispositivo}</td>
                  <td className="muted" style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.problema}
                  </td>
                  <td className="muted">{formatFecha(r.fecha_entrega || r.updatedAt)}</td>
                  <td className="num" style={{ fontFeatureSettings: '"tnum"' }}>{formatMoneda(r.costo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}
