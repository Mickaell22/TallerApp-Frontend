import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'
import { getRepuestos } from '../../services/repuestoService'
import { descargarCSV } from '../../utils/exportCSV'

const FILTROS = [
  { id: 'todos',   label: 'Todos' },
  { id: 'bajo',    label: 'Stock bajo' },
  { id: 'agotado', label: 'Agotados' },
]

function formatMoneda(n) {
  if (!n) return '—'
  return '$' + Number(n).toLocaleString('es-EC')
}

export default function Inventario() {
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState('todos')
  const [search, setSearch] = useState('')
  const [repuestos, setRepuestos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const res = await getRepuestos()
        setRepuestos(res.data.data || [])
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar inventario')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const lowCount = repuestos.filter(i => i.stock < i.stock_minimo).length

  const lista = repuestos.filter(i => {
    if (filtro === 'bajo'    && !(i.stock < i.stock_minimo)) return false
    if (filtro === 'agotado' && i.stock !== 0)               return false
    if (search) {
      const q = search.toLowerCase()
      if (!((i.sku || '') + i.nombre + (i.categoria || '')).toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <AdminLayout active="inventario" title="Inventario" subtitle={`${repuestos.length} repuestos`}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventario</h1>
          <p className="page-subtitle">
            {repuestos.length} repuestos{lowCount > 0 && (
              <> - <span style={{ color: 'var(--c-danger)', fontWeight: 600 }}>{lowCount} con stock bajo</span></>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => descargarCSV(
            repuestos.map(i => ({
              SKU: i.sku || '',
              Nombre: i.nombre,
              Categoria: i.categoria || '',
              Ubicacion: i.ubicacion || '',
              Stock: i.stock,
              'Stock minimo': i.stock_minimo,
              'Precio ($)': i.precio,
            })), 'inventario.csv')}>
            <Icon name="download" size={14} /> Exportar
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/inventario/nuevo')}>
            <Icon name="plus" size={14} /> Agregar repuesto
          </button>
        </div>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="search">
            <Icon name="search" size={14} />
            <input
              placeholder="Buscar repuestos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {FILTROS.map(f => (
              <button
                key={f.id}
                className={'filter-chip' + (filtro === f.id ? ' active' : '')}
                onClick={() => setFiltro(f.id)}
              >
                {f.label}
                {f.id === 'todos' && (
                  <span style={{ opacity: .7, marginLeft: 4 }}>{repuestos.length}</span>
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
                <th>SKU</th>
                <th>Repuesto</th>
                <th>Categoria</th>
                <th>Stock</th>
                <th>Ubicacion</th>
                <th className="num">Precio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lista.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: 32 }} className="muted">
                    No hay repuestos
                  </td>
                </tr>
              )}
              {lista.map(i => {
                const minimo = i.stock_minimo || 0
                const ratio = minimo === 0 ? 1 : i.stock / minimo
                const cls = i.stock === 0 ? 'crit' : ratio < 0.5 ? 'crit' : ratio < 1 ? 'warn' : 'ok'
                const stockColor = i.stock === 0 ? 'var(--c-danger)' : ratio < 1 ? 'var(--c-warn)' : 'var(--c-text)'
                return (
                  <tr key={i.id}>
                    <td className="mono small muted">{i.sku || '—'}</td>
                    <td style={{ fontWeight: 500 }}>{i.nombre}</td>
                    <td className="muted">{i.categoria || '—'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="stock-bar">
                          <span
                            className={'stock-bar-fill ' + cls}
                            style={{ width: Math.max(4, Math.min(100, ratio * 50)) + '%' }}
                          />
                        </span>
                        <span style={{ color: stockColor, fontWeight: 600, fontFeatureSettings: '"tnum"' }}>
                          {i.stock}
                        </span>
                        <span className="muted small" style={{ marginLeft: 4 }}>/ min {minimo}</span>
                      </div>
                    </td>
                    <td className="mono small muted">{i.ubicacion || '—'}</td>
                    <td className="num" style={{ fontFeatureSettings: '"tnum"' }}>{formatMoneda(i.precio)}</td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => navigate(`/admin/inventario/${i.id}/editar`)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}
