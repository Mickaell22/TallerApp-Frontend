import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'
import { getCliente } from '../../services/clienteService'
import { ESTADO_LABELS, estadoCSS } from '../../utils/estados'

function formatMoneda(n) {
  if (!n) return '—'
  return '$' + Number(n).toLocaleString('es-EC')
}

function formatFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function DetalleCliente() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [cliente, setCliente] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id || id === 'nuevo') {
      setCargando(false)
      return
    }
    async function cargar() {
      try {
        const res = await getCliente(id)
        setCliente(res.data.data)
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar cliente')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id])

  if (cargando) {
    return (
      <AdminLayout active="clientes" title="Cargando...">
        <div className="muted" style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>
      </AdminLayout>
    )
  }

  if (error || !cliente) {
    return (
      <AdminLayout active="clientes" title="Cliente no encontrado">
        <div className="card" style={{ padding: 64, textAlign: 'center' }}>
          <p className="muted">{error || `No se encontro el cliente con ID ${id}`}</p>
          <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => navigate('/admin/clientes')}>
            Volver a clientes
          </button>
        </div>
      </AdminLayout>
    )
  }

  const reparaciones   = cliente.reparaciones || []
  const totalEntregadas = reparaciones.filter(r => r.estado === 'entregado').length
  const totalGastado   = reparaciones.reduce((s, r) => s + Number(r.costo || 0), 0)

  return (
    <AdminLayout active="clientes" title={cliente.usuario?.nombre || '—'} subtitle={`Cliente desde ${formatFecha(cliente.usuario?.createdAt)}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/clientes')}>
          ← Volver
        </button>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">{cliente.usuario?.nombre || '—'}</h1>
          <p className="page-subtitle">Cliente desde {formatFecha(cliente.usuario?.createdAt)}</p>
        </div>
        <button className="btn btn-secondary">
          <Icon name="settings" size={14} /> Editar cliente
        </button>
      </div>

      <div className="detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 14 }}>Informacion de contacto</h3>
            <dl className="kv">
              <dt>Nombre</dt>     <dd>{cliente.usuario?.nombre || '—'}</dd>
              <dt>Telefono</dt>   <dd className="mono">{cliente.telefono || '—'}</dd>
              <dt>Correo</dt>     <dd>{cliente.usuario?.email || '—'}</dd>
              <dt>Direccion</dt>  <dd>{cliente.direccion || '—'}</dd>
              <dt>Registrado</dt> <dd>{formatFecha(cliente.usuario?.createdAt)}</dd>
            </dl>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Historial de reparaciones</h3>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/admin/reparaciones/nueva')}
              >
                <Icon name="plus" size={13} /> Nueva reparacion
              </button>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Dispositivo</th>
                  <th>Falla</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th className="num">Costo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {reparaciones.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: 24 }} className="muted">
                      Sin reparaciones registradas
                    </td>
                  </tr>
                )}
                {reparaciones.map(r => (
                  <tr
                    key={r.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/admin/reparaciones/${r.id}`)}
                  >
                    <td className="mono small muted">{r.codigo}</td>
                    <td style={{ fontWeight: 500 }}>{r.dispositivo}</td>
                    <td className="muted" style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.problema}
                    </td>
                    <td>
                      <span className={`pill pill-${estadoCSS(r.estado)}`}>{ESTADO_LABELS[r.estado] || r.estado}</span>
                    </td>
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
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div className="card card-pad" style={{ background: 'var(--c-surface-2)' }}>
            <h3 className="card-title" style={{ marginBottom: 14 }}>Resumen</h3>
            <dl className="kv">
              <dt>Total reparaciones</dt> <dd>{reparaciones.length}</dd>
              <dt>Completadas</dt>        <dd>{totalEntregadas}</dd>
              <dt>En curso</dt>           <dd>{reparaciones.length - totalEntregadas}</dd>
              <dt>Total gastado</dt>      <dd style={{ fontWeight: 700 }}>{formatMoneda(totalGastado)}</dd>
            </dl>
          </div>

          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 14 }}>Acciones</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start' }}
                onClick={() => alert(`Mensaje de WhatsApp enviado a ${cliente?.telefono || cliente?.usuario?.nombre || 'el cliente'}`)}
              >
                <Icon name="phone" size={14} /> Llamar al cliente
              </button>
              <button
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start' }}
                onClick={() => alert(`Notificación enviada a ${cliente?.usuario?.nombre || 'el cliente'} por WhatsApp`)}
              >
                <Icon name="bell" size={14} /> Enviar notificacion
              </button>
              <button
                className="btn btn-primary"
                style={{ justifyContent: 'flex-start' }}
                onClick={() => navigate('/admin/reparaciones/nueva')}
              >
                <Icon name="plus" size={14} /> Nueva reparacion
              </button>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}
