import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'

const FACTURAS = [
  { id: 1, codigo: 'F-2026-0089', cliente: 'Camila Ortiz',   fecha: '04 May 2026', concepto: 'Cambio cámara Samsung S22',              monto: 67000,  estado: 'Pagada' },
  { id: 2, codigo: 'F-2026-0088', cliente: 'Bruno Suárez',   fecha: '03 May 2026', concepto: 'Reparación daño líquido iPhone XR',       monto: 89000,  estado: 'Pagada' },
  { id: 3, codigo: 'F-2026-0087', cliente: 'Diego Castro',   fecha: '02 May 2026', concepto: 'Cambio batería iPhone 12',                monto: 52000,  estado: 'Pagada' },
  { id: 4, codigo: 'F-2026-0086', cliente: 'Tomás Aguilar',  fecha: '01 May 2026', concepto: 'Pantalla iPhone 14',                     monto: 175000, estado: 'Pendiente' },
  { id: 5, codigo: 'F-2026-0085', cliente: 'Patricia Núñez', fecha: '30 Abr 2026', concepto: 'Conector carga Motorola G72',             monto: 26000,  estado: 'Pagada' },
  { id: 6, codigo: 'F-2026-0084', cliente: 'Andrés Torres',  fecha: '28 Abr 2026', concepto: 'Diagnóstico + limpieza Samsung A12',      monto: 8500,   estado: 'Pagada' },
]

const FILTROS = [
  { id: 'todas',      label: 'Todas' },
  { id: 'Pagada',     label: 'Pagadas' },
  { id: 'Pendiente',  label: 'Pendientes' },
]

function formatMoneda(n) {
  return '$' + n.toLocaleString('es-EC')
}

export default function Facturacion() {
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState('todas')
  const [search, setSearch] = useState('')

  const totalFacturado = FACTURAS.reduce((s, f) => s + f.monto, 0)
  const totalPagado    = FACTURAS.filter(f => f.estado === 'Pagada').reduce((s, f) => s + f.monto, 0)
  const totalPendiente = FACTURAS.filter(f => f.estado === 'Pendiente').reduce((s, f) => s + f.monto, 0)
  const countPagadas   = FACTURAS.filter(f => f.estado === 'Pagada').length

  const lista = FACTURAS.filter(f => {
    if (filtro !== 'todas' && f.estado !== filtro) return false
    if (search) {
      const q = search.toLowerCase()
      if (!(f.codigo + f.cliente + f.concepto).toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <AdminLayout active="facturacion" title="Facturación" subtitle={`${FACTURAS.length} facturas emitidas en mayo`}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Facturación</h1>
          <p className="page-subtitle">{FACTURAS.length} facturas emitidas en mayo</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary">
            <Icon name="download" size={14} /> Exportar todas
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/facturacion/nueva')}>
            <Icon name="plus" size={14} /> Nueva factura
          </button>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 16 }}>
        <div className="stat-card">
          <div className="stat-card-icon green"><Icon name="receipt" size={17} /></div>
          <div className="stat-card-label">Total facturado (mayo)</div>
          <div className="stat-card-value">{formatMoneda(totalFacturado)}</div>
          <div className="stat-card-delta"><Icon name="arrowUp" size={11} />+23% vs abril</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--c-primary-bg)', color: 'var(--c-primary)' }}>
            <Icon name="check" size={17} />
          </div>
          <div className="stat-card-label">Pagadas</div>
          <div className="stat-card-value">{formatMoneda(totalPagado)}</div>
          <div className="stat-card-delta">{countPagadas} facturas</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon"><Icon name="clock" size={17} /></div>
          <div className="stat-card-label">Pendientes de cobro</div>
          <div className="stat-card-value">{formatMoneda(totalPendiente)}</div>
          <div className="stat-card-delta down">1 factura pendiente</div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="search">
            <Icon name="search" size={14} />
            <input
              placeholder="Buscar factura, cliente o concepto..."
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
                {f.id === 'todas' && (
                  <span style={{ opacity: .7, marginLeft: 4 }}>{FACTURAS.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <table className="tbl">
          <thead>
            <tr>
              <th>N° Factura</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Concepto</th>
              <th>Estado</th>
              <th className="num">Monto</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lista.map(f => (
              <tr
                key={f.id}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/admin/facturacion/${f.id}`)}
              >
                <td className="mono">{f.codigo}</td>
                <td style={{ fontWeight: 500 }}>{f.cliente}</td>
                <td className="muted">{f.fecha}</td>
                <td className="muted" style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.concepto}
                </td>
                <td>
                  <span className="pill" style={{
                    background: f.estado === 'Pagada' ? 'var(--c-success-bg)' : 'var(--c-warn-bg)',
                    color:      f.estado === 'Pagada' ? 'var(--c-success)'    : 'var(--c-warn)',
                  }}>
                    {f.estado}
                  </span>
                </td>
                <td className="num" style={{ fontWeight: 600, fontFeatureSettings: '"tnum"' }}>
                  {formatMoneda(f.monto)}
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={e => { e.stopPropagation(); }}
                  >
                    <Icon name="download" size={13} /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
