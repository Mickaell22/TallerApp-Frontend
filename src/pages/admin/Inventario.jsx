import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'

const REPUESTOS = [
  { id: 1, sku: 'PNT-IP13P-OEM', nombre: 'Pantalla iPhone 13 Pro (OEM)',    categoria: 'Pantallas',   stock: 2,  minimo: 5,  costo: 78000, ubicacion: 'A-12' },
  { id: 2, sku: 'BAT-IP12-ORIG',  nombre: 'Batería iPhone 12 original',      categoria: 'Baterías',    stock: 14, minimo: 6,  costo: 22000, ubicacion: 'B-04' },
  { id: 3, sku: 'PNT-SAMA52',     nombre: 'Pantalla Samsung A52',            categoria: 'Pantallas',   stock: 1,  minimo: 4,  costo: 41000, ubicacion: 'A-08' },
  { id: 4, sku: 'CON-USBC-XM',   nombre: 'Conector carga USB-C Xiaomi',     categoria: 'Conectores',  stock: 22, minimo: 10, costo: 4500,  ubicacion: 'C-01' },
  { id: 5, sku: 'PNT-IP14',       nombre: 'Pantalla iPhone 14',              categoria: 'Pantallas',   stock: 6,  minimo: 4,  costo: 92000, ubicacion: 'A-15' },
  { id: 6, sku: 'BAT-SAM-S22',   nombre: 'Batería Samsung S22',             categoria: 'Baterías',    stock: 3,  minimo: 5,  costo: 18000, ubicacion: 'B-07' },
  { id: 7, sku: 'CAM-IP13',       nombre: 'Módulo cámara iPhone 13',         categoria: 'Cámaras',     stock: 8,  minimo: 3,  costo: 34000, ubicacion: 'D-02' },
  { id: 8, sku: 'ALT-IP11',       nombre: 'Altavoz iPhone 11',               categoria: 'Audio',       stock: 0,  minimo: 4,  costo: 6800,  ubicacion: 'E-09' },
]

const FILTROS = [
  { id: 'todos',   label: 'Todos' },
  { id: 'bajo',    label: 'Stock bajo' },
  { id: 'agotado', label: 'Agotados' },
]

function formatMoneda(n) {
  return '$' + n.toLocaleString('es-EC')
}

export default function Inventario() {
  const navigate = useNavigate()
  const [filtro, setFiltro]   = useState('todos')
  const [search, setSearch]   = useState('')

  const lowCount = REPUESTOS.filter(i => i.stock < i.minimo).length

  const lista = REPUESTOS.filter(i => {
    if (filtro === 'bajo'    && !(i.stock < i.minimo)) return false
    if (filtro === 'agotado' && i.stock !== 0)         return false
    if (search) {
      const q = search.toLowerCase()
      if (!(i.sku + i.nombre + i.categoria).toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <AdminLayout active="inventario" title="Inventario" subtitle={`${REPUESTOS.length} repuestos`}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventario</h1>
          <p className="page-subtitle">
            {REPUESTOS.length} repuestos •{' '}
            <span style={{ color: 'var(--c-danger)', fontWeight: 600 }}>{lowCount} con stock bajo</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary">
            <Icon name="download" size={14} /> Exportar
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/inventario/nuevo')}>
            <Icon name="plus" size={14} /> Agregar repuesto
          </button>
        </div>
      </div>

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
                  <span style={{ opacity: .7, marginLeft: 4 }}>{REPUESTOS.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <table className="tbl">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Repuesto</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Ubicación</th>
              <th className="num">Costo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lista.map(i => {
              const ratio      = i.minimo === 0 ? 1 : i.stock / i.minimo
              const cls        = i.stock === 0 ? 'crit' : ratio < 0.5 ? 'crit' : ratio < 1 ? 'warn' : 'ok'
              const stockColor = i.stock === 0 ? 'var(--c-danger)' : ratio < 1 ? 'var(--c-warn)' : 'var(--c-text)'
              return (
                <tr key={i.id}>
                  <td className="mono small muted">{i.sku}</td>
                  <td style={{ fontWeight: 500 }}>{i.nombre}</td>
                  <td className="muted">{i.categoria}</td>
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
                      <span className="muted small" style={{ marginLeft: 4 }}>/ mín {i.minimo}</span>
                    </div>
                  </td>
                  <td className="mono small muted">{i.ubicacion}</td>
                  <td className="num" style={{ fontFeatureSettings: '"tnum"' }}>{formatMoneda(i.costo)}</td>
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
      </div>
    </AdminLayout>
  )
}
