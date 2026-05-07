import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'

const FACTURAS = {
  1: {
    id: 1, codigo: 'F-2026-0089',
    cliente: 'Camila Ortiz', telefono: '+593 98 765 4321', email: 'camila@ejemplo.com',
    fecha: '04 May 2026', concepto: 'Cambio cámara Samsung S22',
    reparacion: 'TLR-2026-0143', estado: 'Pagada',
    items: [
      { descripcion: 'Mano de obra — cambio de cámara', cantidad: 1, precio: 25000 },
      { descripcion: 'Módulo cámara Samsung S22 (OEM)', cantidad: 1, precio: 42000 },
    ],
  },
  2: {
    id: 2, codigo: 'F-2026-0088',
    cliente: 'Bruno Suárez', telefono: '+593 99 111 2233', email: 'bruno@ejemplo.com',
    fecha: '03 May 2026', concepto: 'Reparación daño líquido iPhone XR',
    reparacion: 'TLR-2026-0141', estado: 'Pagada',
    items: [
      { descripcion: 'Mano de obra — limpieza y reparación por líquido', cantidad: 1, precio: 40000 },
      { descripcion: 'Conector de carga iPhone XR',                       cantidad: 1, precio: 18000 },
      { descripcion: 'Batería iPhone XR (OEM)',                           cantidad: 1, precio: 31000 },
    ],
  },
  3: {
    id: 3, codigo: 'F-2026-0087',
    cliente: 'Diego Castro', telefono: '+593 98 444 5566', email: 'diego@ejemplo.com',
    fecha: '02 May 2026', concepto: 'Cambio batería iPhone 12',
    reparacion: 'TLR-2026-0140', estado: 'Pagada',
    items: [
      { descripcion: 'Mano de obra — cambio de batería', cantidad: 1, precio: 15000 },
      { descripcion: 'Batería iPhone 12 original',       cantidad: 1, precio: 37000 },
    ],
  },
  4: {
    id: 4, codigo: 'F-2026-0086',
    cliente: 'Tomás Aguilar', telefono: '+593 97 888 9900', email: 'tomas@ejemplo.com',
    fecha: '01 May 2026', concepto: 'Pantalla iPhone 14',
    reparacion: 'TLR-2026-0139', estado: 'Pendiente',
    items: [
      { descripcion: 'Mano de obra — cambio de pantalla', cantidad: 1, precio: 30000 },
      { descripcion: 'Pantalla iPhone 14 (OEM)',           cantidad: 1, precio: 145000 },
    ],
  },
  5: {
    id: 5, codigo: 'F-2026-0085',
    cliente: 'Patricia Núñez', telefono: '+593 99 222 3344', email: 'patricia@ejemplo.com',
    fecha: '30 Abr 2026', concepto: 'Conector carga Motorola G72',
    reparacion: 'TLR-2026-0138', estado: 'Pagada',
    items: [
      { descripcion: 'Mano de obra — cambio conector', cantidad: 1, precio: 12000 },
      { descripcion: 'Conector USB-C Motorola G72',    cantidad: 1, precio: 14000 },
    ],
  },
  6: {
    id: 6, codigo: 'F-2026-0084',
    cliente: 'Andrés Torres', telefono: '+593 98 555 6677', email: 'andres@ejemplo.com',
    fecha: '28 Abr 2026', concepto: 'Diagnóstico + limpieza Samsung A12',
    reparacion: 'TLR-2026-0137', estado: 'Pagada',
    items: [
      { descripcion: 'Diagnóstico técnico',    cantidad: 1, precio: 5000 },
      { descripcion: 'Limpieza interna',       cantidad: 1, precio: 3500 },
    ],
  },
}

function formatMoneda(n) {
  return '$' + n.toLocaleString('es-EC')
}

export default function DetalleFactura() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const factura   = FACTURAS[id]

  const [estado, setEstado] = useState(factura?.estado || 'Pendiente')

  if (!factura) {
    return (
      <AdminLayout active="facturacion" title="Factura no encontrada">
        <div className="card" style={{ padding: 64, textAlign: 'center' }}>
          <p className="muted">No se encontró la factura con ID {id}</p>
          <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => navigate('/admin/facturacion')}>
            Volver a facturación
          </button>
        </div>
      </AdminLayout>
    )
  }

  const subtotal = factura.items.reduce((s, i) => s + i.cantidad * i.precio, 0)
  const iva      = Math.round(subtotal * 0.15)
  const total    = subtotal + iva

  return (
    <AdminLayout active="facturacion" title={factura.codigo} subtitle={`${factura.cliente} • ${factura.fecha}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/facturacion')}>
          ← Volver
        </button>
        <span className="muted small mono">{factura.codigo}</span>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">{factura.codigo}</h1>
          <p className="page-subtitle">{factura.cliente} • {factura.fecha}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="pill" style={{
            background: estado === 'Pagada' ? 'var(--c-success-bg)' : 'var(--c-warn-bg)',
            color:      estado === 'Pagada' ? 'var(--c-success)'    : 'var(--c-warn)',
            fontSize: 13, padding: '6px 14px',
          }}>
            {estado}
          </span>
          <button className="btn btn-primary">
            <Icon name="download" size={14} /> Descargar PDF
          </button>
        </div>
      </div>

      <div className="detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 14 }}>Datos del cliente</h3>
            <dl className="kv">
              <dt>Cliente</dt>     <dd>{factura.cliente}</dd>
              <dt>Teléfono</dt>    <dd className="mono">{factura.telefono}</dd>
              <dt>Correo</dt>      <dd>{factura.email}</dd>
              <dt>Reparación</dt>  <dd className="mono">{factura.reparacion}</dd>
              <dt>Concepto</dt>    <dd>{factura.concepto}</dd>
            </dl>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Desglose</h3>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th className="num">Cant.</th>
                  <th className="num">Precio unit.</th>
                  <th className="num">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {factura.items.map((item, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{item.descripcion}</td>
                    <td className="num">{item.cantidad}</td>
                    <td className="num">{formatMoneda(item.precio)}</td>
                    <td className="num" style={{ fontWeight: 600 }}>{formatMoneda(item.cantidad * item.precio)}</td>
                  </tr>
                ))}
                <tr style={{ background: 'var(--c-surface-2)' }}>
                  <td colSpan="3" className="num" style={{ fontWeight: 600 }}>Subtotal</td>
                  <td className="num" style={{ fontFeatureSettings: '"tnum"' }}>{formatMoneda(subtotal)}</td>
                </tr>
                <tr style={{ background: 'var(--c-surface-2)' }}>
                  <td colSpan="3" className="num muted">IVA 15%</td>
                  <td className="num muted" style={{ fontFeatureSettings: '"tnum"' }}>{formatMoneda(iva)}</td>
                </tr>
                <tr style={{ background: 'var(--c-surface-2)' }}>
                  <td colSpan="3" className="num" style={{ fontWeight: 700, fontSize: 14 }}>Total</td>
                  <td className="num" style={{ fontWeight: 700, fontSize: 14, fontFeatureSettings: '"tnum"' }}>{formatMoneda(total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 14 }}>Estado de pago</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {['Pagada', 'Pendiente'].map(e => (
                <button
                  key={e}
                  className={'filter-chip' + (estado === e ? ' active' : '')}
                  onClick={() => setEstado(e)}
                  style={{ justifyContent: 'flex-start', padding: '10px 14px' }}
                >
                  {e}
                </button>
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              <Icon name="check" size={14} /> Guardar cambios
            </button>
          </div>

          <div className="card card-pad" style={{ background: 'var(--c-surface-2)' }}>
            <h3 className="card-title" style={{ marginBottom: 12 }}>Resumen</h3>
            <dl className="kv">
              <dt>N° Factura</dt>  <dd className="mono">{factura.codigo}</dd>
              <dt>Fecha</dt>       <dd>{factura.fecha}</dd>
              <dt>Estado</dt>
              <dd>
                <span className="pill" style={{
                  background: estado === 'Pagada' ? 'var(--c-success-bg)' : 'var(--c-warn-bg)',
                  color:      estado === 'Pagada' ? 'var(--c-success)'    : 'var(--c-warn)',
                }}>
                  {estado}
                </span>
              </dd>
              <dt>Total</dt>       <dd style={{ fontWeight: 700 }}>{formatMoneda(total)}</dd>
            </dl>
          </div>

          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 14 }}>Acciones</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                <Icon name="download" size={14} /> Descargar PDF
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Icon name="bell" size={14} /> Enviar por correo
              </button>
              <button
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start' }}
                onClick={() => navigate(`/admin/reparaciones`)}
              >
                <Icon name="wrench" size={14} /> Ver reparación
              </button>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}
