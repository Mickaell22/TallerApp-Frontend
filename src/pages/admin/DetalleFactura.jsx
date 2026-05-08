import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'
import { getFactura, downloadPDF } from '../../services/facturaService'

function formatMoneda(n) {
  if (!n && n !== 0) return '—'
  return '$' + Number(n).toLocaleString('es-EC')
}

function formatFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function DetalleFactura() {
  const { id }    = useParams()
  const navigate  = useNavigate()

  const [factura, setFactura] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const res = await getFactura(id)
        setFactura(res.data.data)
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar la factura')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id])

  async function handleDescarga() {
    try {
      const res = await downloadPDF(id)
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `factura-${id}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Error al descargar el PDF')
    }
  }

  if (cargando) {
    return (
      <AdminLayout active="facturacion" title="Cargando...">
        <div className="muted" style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>
      </AdminLayout>
    )
  }

  if (error || !factura) {
    return (
      <AdminLayout active="facturacion" title="Factura no encontrada">
        <div className="card" style={{ padding: 64, textAlign: 'center' }}>
          <p className="muted">{error || `No se encontro la factura con ID ${id}`}</p>
          <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => navigate('/admin/facturacion')}>
            Volver a facturacion
          </button>
        </div>
      </AdminLayout>
    )
  }

  const repuestos = factura.reparacion?.repuestos || []
  const total = Number(factura.total || 0)
  const codigoFactura = `F-${String(factura.id).padStart(6, '0')}`
  const cliente = factura.reparacion?.cliente
  const nombreCliente = cliente?.usuario?.nombre || '—'
  const estadoPago = factura.estado_pago === 'pagado' ? 'Pagada' : 'Pendiente'

  return (
    <AdminLayout active="facturacion" title={codigoFactura} subtitle={`${nombreCliente} - ${formatFecha(factura.fecha)}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/facturacion')}>
          ← Volver
        </button>
        <span className="muted small mono">{codigoFactura}</span>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">{codigoFactura}</h1>
          <p className="page-subtitle">{nombreCliente} - {formatFecha(factura.fecha)}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="pill" style={{
            background: factura.estado_pago === 'pagado' ? 'var(--c-success-bg)' : 'var(--c-warn-bg)',
            color:      factura.estado_pago === 'pagado' ? 'var(--c-success)'    : 'var(--c-warn)',
            fontSize: 13, padding: '6px 14px',
          }}>
            {estadoPago}
          </span>
          <button className="btn btn-primary" onClick={handleDescarga}>
            <Icon name="download" size={14} /> Descargar PDF
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 14 }}>Datos del cliente</h3>
            <dl className="kv">
              <dt>Cliente</dt>     <dd>{nombreCliente}</dd>
              <dt>Telefono</dt>    <dd className="mono">{cliente?.telefono || '—'}</dd>
              <dt>Correo</dt>      <dd>{cliente?.usuario?.email || '—'}</dd>
              <dt>Reparacion</dt>  <dd className="mono">{factura.reparacion?.codigo || '—'}</dd>
              <dt>Dispositivo</dt> <dd>{factura.reparacion?.dispositivo || '—'}</dd>
            </dl>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Desglose de repuestos</h3>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Repuesto</th>
                  <th className="num">Cant.</th>
                  <th className="num">Precio unit.</th>
                  <th className="num">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {repuestos.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: 24 }} className="muted">
                      Sin repuestos detallados
                    </td>
                  </tr>
                )}
                {repuestos.map((rep, i) => {
                  const cant = rep.reparacion_repuesto?.cantidad || 1
                  const precio = Number(rep.precio || 0)
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{rep.nombre}</td>
                      <td className="num">{cant}</td>
                      <td className="num">{formatMoneda(precio)}</td>
                      <td className="num" style={{ fontWeight: 600 }}>{formatMoneda(cant * precio)}</td>
                    </tr>
                  )
                })}
                <tr style={{ background: 'var(--c-surface-2)' }}>
                  <td colSpan="3" className="num" style={{ fontWeight: 700, fontSize: 14 }}>Total</td>
                  <td className="num" style={{ fontWeight: 700, fontSize: 14, fontFeatureSettings: '"tnum"' }}>{formatMoneda(total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div className="card card-pad" style={{ background: 'var(--c-surface-2)' }}>
            <h3 className="card-title" style={{ marginBottom: 12 }}>Resumen</h3>
            <dl className="kv">
              <dt>N Factura</dt>  <dd className="mono">{codigoFactura}</dd>
              <dt>Fecha</dt>       <dd>{formatFecha(factura.fecha)}</dd>
              <dt>Estado</dt>
              <dd>
                <span className="pill" style={{
                  background: factura.estado_pago === 'pagado' ? 'var(--c-success-bg)' : 'var(--c-warn-bg)',
                  color:      factura.estado_pago === 'pagado' ? 'var(--c-success)'    : 'var(--c-warn)',
                }}>
                  {estadoPago}
                </span>
              </dd>
              <dt>Total</dt>       <dd style={{ fontWeight: 700 }}>{formatMoneda(total)}</dd>
            </dl>
          </div>

          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 14 }}>Acciones</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-primary" style={{ justifyContent: 'flex-start' }} onClick={handleDescarga}>
                <Icon name="download" size={14} /> Descargar PDF
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Icon name="bell" size={14} /> Enviar por correo
              </button>
              <button
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start' }}
                onClick={() => navigate(`/admin/reparaciones/${factura.reparacion?.id}`)}
              >
                <Icon name="wrench" size={14} /> Ver reparacion
              </button>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}
