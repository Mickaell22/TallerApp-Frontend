import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'
import { getReparaciones } from '../../services/reparacionService'
import { ESTADO_LABELS, estadoCSS } from '../../utils/estados'
import { descargarCSV } from '../../utils/exportCSV'

const FILTROS = [
  { id: 'todos',          label: 'Todos' },
  { id: 'recibido',       label: 'Recibido' },
  { id: 'en_diagnostico', label: 'En diagnostico' },
  { id: 'en_reparacion',  label: 'En reparacion' },
  { id: 'listo',          label: 'Listo' },
  { id: 'entregado',      label: 'Entregado' },
]

function formatMoneda(n) {
  if (!n) return '—'
  return '$' + Number(n).toLocaleString('es-EC')
}

function formatFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Reparaciones() {
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState('todos')
  const [search, setSearch] = useState('')
  const [lista, setLista] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const res = await getReparaciones()
        setLista(res.data.data || [])
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar reparaciones')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const filtradas = useMemo(() => {
    return lista.filter(r => {
      if (filtro !== 'todos' && r.estado !== filtro) return false
      if (search) {
        const q = search.toLowerCase()
        const cliente = r.cliente?.usuario?.nombre || ''
        if (!(r.codigo + cliente + r.dispositivo + r.problema).toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [lista, filtro, search])

  return (
    <AdminLayout active="reparaciones" title="Reparaciones" subtitle={`${filtradas.length} ordenes de servicio`}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reparaciones</h1>
          <p className="page-subtitle">{filtradas.length} reparaciones</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => descargarCSV(
            filtradas.map(r => ({
              Codigo: r.codigo,
              Cliente: r.cliente?.usuario?.nombre || '',
              Dispositivo: r.dispositivo,
              Falla: r.problema,
              Estado: ESTADO_LABELS[r.estado] || r.estado,
              Tecnico: r.tecnico?.nombre || '',
              'Fecha ingreso': r.fecha_entrada || '',
              'Costo ($)': r.costo || '',
            })), 'reparaciones.csv')}>
            <Icon name="download" size={14} /> Exportar
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/reparaciones/nueva')}>
            <Icon name="plus" size={14} /> Nueva reparacion
          </button>
        </div>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

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
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FILTROS.map(f => (
              <button
                key={f.id}
                className={'filter-chip' + (filtro === f.id ? ' active' : '')}
                onClick={() => setFiltro(f.id)}
              >
                {f.label}
                {f.id === 'todos' && (
                  <span style={{ opacity: .7, marginLeft: 4 }}>{lista.length}</span>
                )}
              </button>
            ))}
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
                <th>Estado</th>
                <th>Tecnico</th>
                <th>Ingreso</th>
                <th className="num">Costo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: 32 }} className="muted">
                    No hay reparaciones
                  </td>
                </tr>
              )}
              {filtradas.map(r => (
                <tr
                  key={r.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/admin/reparaciones/${r.id}`)}
                >
                  <td className="mono">{r.codigo}</td>
                  <td>{r.cliente?.usuario?.nombre || '—'}</td>
                  <td>{r.dispositivo}</td>
                  <td className="muted" style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.problema}
                  </td>
                  <td>
                    <span className={`pill pill-${estadoCSS(r.estado)}`}>{ESTADO_LABELS[r.estado] || r.estado}</span>
                  </td>
                  <td className="muted">{r.tecnico?.nombre || 'Sin asignar'}</td>
                  <td className="muted">{formatFecha(r.fecha_entrada)}</td>
                  <td className="num" style={{ fontFeatureSettings: '"tnum"' }}>{formatMoneda(r.costo)}</td>
                  <td>
                    <button className="icon-btn" style={{ width: 28, height: 28, border: 'none' }}>
                      <Icon name="chevronRight" size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}
