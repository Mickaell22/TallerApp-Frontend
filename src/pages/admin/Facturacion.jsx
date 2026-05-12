import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'
import { getFacturas, downloadPDF } from '../../services/facturaService'
import { descargarCSV } from '../../utils/exportCSV'

const FILTROS = [
  { id: 'todas',     label: 'Todas' },
  { id: 'pagado',    label: 'Pagadas' },
  { id: 'pendiente', label: 'Pendientes' },
]

function formatMoneda(n) {
  if (!n && n !== 0) return '—'
  return '$' + Number(n).toLocaleString('es-EC', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function formatFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })
}

function estadoPago(estado) {
  return estado === 'pagado' ? 'Pagada' : 'Pendiente'
}

export default function Facturacion() {
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState('todas')
  const [search, setSearch] = useState('')
  const [facturas, setFacturas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const res = await getFacturas()
        setFacturas(res.data.data || [])
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar facturas')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const totalFacturado = facturas.reduce((s, f) => s + Number(f.total || 0), 0)
  const totalPagado    = facturas.filter(f => f.estado_pago === 'pagado').reduce((s, f) => s + Number(f.total || 0), 0)
  const totalPendiente = facturas.filter(f => f.estado_pago === 'pendiente').reduce((s, f) => s + Number(f.total || 0), 0)
  const countPagadas   = facturas.filter(f => f.estado_pago === 'pagado').length

  const lista = facturas.filter(f => {
    if (filtro !== 'todas' && f.estado_pago !== filtro) return false
    if (search) {
      const q = search.toLowerCase()
      const cliente = f.reparacion?.cliente?.usuario?.nombre || ''
      if (!(`${f.id}` + cliente).toLowerCase().includes(q)) return false
    }
    return true
  })

  async function handleDescarga(e, facturaId) {
    e.stopPropagation()
    try {
      const res = await downloadPDF(facturaId)
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `factura-${facturaId}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Error al descargar el PDF')
    }
  }

  return (
    <AdminLayout active="facturacion" title="Facturacion" subtitle={`${facturas.length} facturas emitidas`}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Facturacion</h1>
          <p className="page-subtitle">{facturas.length} facturas emitidas</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => descargarCSV(
            facturas.map(f => ({
              'N Factura': `F-${String(f.id).padStart(6, '0')}`,
              Cliente: f.reparacion?.cliente?.usuario?.nombre || '',
              Fecha: f.fecha || '',
              Estado: f.estado_pago === 'pagado' ? 'Pagada' : 'Pendiente',
              'Total ($)': f.total,
            })), 'facturas.csv')}>
            <Icon name="download" size={14} /> Exportar todas
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/facturacion/nueva')}>
            <Icon name="plus" size={14} /> Nueva factura
          </button>
        </div>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 16 }}>
        <div className="stat-card">
          <div className="stat-card-icon green"><Icon name="receipt" size={17} /></div>
          <div className="stat-card-label">Total facturado</div>
          <div className="stat-card-value">{formatMoneda(totalFacturado)}</div>
          <div className="stat-card-delta"><Icon name="arrowUp" size={11} />Acumulado</div>
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
          <div className="stat-card-delta down">{facturas.length - countPagadas} facturas pendientes</div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="search">
            <Icon name="search" size={14} />
            <input
              placeholder="Buscar factura o cliente..."
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
                  <span style={{ opacity: .7, marginLeft: 4 }}>{facturas.length}</span>
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
                <th>N Factura</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th className="num">Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lista.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 32 }} className="muted">
                    No hay facturas
                  </td>
                </tr>
              )}
              {lista.map(f => (
                <tr
                  key={f.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/admin/facturacion/${f.id}`)}
                >
                  <td className="mono">F-{String(f.id).padStart(6, '0')}</td>
                  <td style={{ fontWeight: 500 }}>{f.reparacion?.cliente?.usuario?.nombre || '—'}</td>
                  <td className="muted">{formatFecha(f.fecha)}</td>
                  <td>
                    <span className="pill" style={{
                      background: f.estado_pago === 'pagado' ? 'var(--c-success-bg)' : 'var(--c-warn-bg)',
                      color:      f.estado_pago === 'pagado' ? 'var(--c-success)'    : 'var(--c-warn)',
                    }}>
                      {estadoPago(f.estado_pago)}
                    </span>
                  </td>
                  <td className="num" style={{ fontWeight: 600, fontFeatureSettings: '"tnum"' }}>
                    {formatMoneda(f.total)}
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={e => handleDescarga(e, f.id)}
                    >
                      <Icon name="download" size={13} /> PDF
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
