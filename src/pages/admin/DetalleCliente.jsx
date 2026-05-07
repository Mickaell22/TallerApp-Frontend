import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'

const ESTADO_LABELS = {
  recibido:    'Recibido',
  diagnostico: 'En diagnóstico',
  reparacion:  'En reparación',
  listo:       'Listo',
  entregado:   'Entregado',
}

const CLIENTES = {
  1: {
    id: 1, nombre: 'Ana Torres', telefono: '+593 99 123 4567',
    email: 'ana.torres@ejemplo.com', direccion: 'Av. 9 de Octubre 123, Guayaquil',
    fechaRegistro: '10 Ene 2026',
    reparaciones: [
      { id: 1, codigo: 'TLR-2026-0148', dispositivo: 'Samsung Galaxy A54', falla: 'Pantalla rota, no enciende',     estado: 'reparacion',  fecha: '03 May 2026', costo: 85000 },
      { id: 9, codigo: 'TLR-2026-0120', dispositivo: 'iPhone 11',          falla: 'Batería se drena rápido',        estado: 'entregado',   fecha: '15 Mar 2026', costo: 55000 },
      { id: 10,codigo: 'TLR-2025-0987', dispositivo: 'Samsung Galaxy A54', falla: 'Conector de carga dañado',       estado: 'entregado',   fecha: '20 Nov 2025', costo: 70000 },
    ],
  },
  2: {
    id: 2, nombre: 'Luis Méndez', telefono: '+593 98 234 5678',
    email: 'luis.mendez@ejemplo.com', direccion: 'Cdla. Kennedy Norte, Guayaquil',
    fechaRegistro: '22 Feb 2026',
    reparaciones: [
      { id: 2, codigo: 'TLR-2026-0147', dispositivo: 'iPhone 13', falla: 'No carga, conector dañado', estado: 'diagnostico', fecha: '03 May 2026', costo: 45000 },
    ],
  },
  3: {
    id: 3, nombre: 'Carmen Ríos', telefono: '+593 97 345 6789',
    email: 'carmen.rios@ejemplo.com', direccion: 'Urdesa Central, Guayaquil',
    fechaRegistro: '05 Mar 2026',
    reparaciones: [
      { id: 3, codigo: 'TLR-2026-0146', dispositivo: 'Xiaomi Redmi Note 11', falla: 'Batería se drena rápido',  estado: 'listo',     fecha: '02 May 2026', costo: 32000 },
      { id: 11,codigo: 'TLR-2026-0098', dispositivo: 'Xiaomi Redmi Note 11', falla: 'Pantalla con manchas',     estado: 'entregado', fecha: '10 Abr 2026', costo: 46000 },
    ],
  },
}

function formatMoneda(n) {
  if (!n) return '—'
  return '$' + n.toLocaleString('es-EC')
}

export default function DetalleCliente() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const cliente  = CLIENTES[id]

  if (!cliente) {
    return (
      <AdminLayout active="clientes" title="Cliente no encontrado">
        <div className="card" style={{ padding: 64, textAlign: 'center' }}>
          <p className="muted">No se encontró el cliente con ID {id}</p>
          <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => navigate('/admin/clientes')}>
            Volver a clientes
          </button>
        </div>
      </AdminLayout>
    )
  }

  const totalGastado   = cliente.reparaciones.reduce((s, r) => s + r.costo, 0)
  const totalEntregadas = cliente.reparaciones.filter(r => r.estado === 'entregado').length

  return (
    <AdminLayout active="clientes" title={cliente.nombre} subtitle={`Cliente desde ${cliente.fechaRegistro}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/clientes')}>
          ← Volver
        </button>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">{cliente.nombre}</h1>
          <p className="page-subtitle">Cliente desde {cliente.fechaRegistro}</p>
        </div>
        <button className="btn btn-secondary">
          <Icon name="settings" size={14} /> Editar cliente
        </button>
      </div>

      <div className="detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 14 }}>Información de contacto</h3>
            <dl className="kv">
              <dt>Nombre</dt>     <dd>{cliente.nombre}</dd>
              <dt>Teléfono</dt>   <dd className="mono">{cliente.telefono}</dd>
              <dt>Correo</dt>     <dd>{cliente.email}</dd>
              <dt>Dirección</dt>  <dd>{cliente.direccion}</dd>
              <dt>Registrado</dt> <dd>{cliente.fechaRegistro}</dd>
            </dl>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Historial de reparaciones</h3>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/admin/reparaciones/nueva')}
              >
                <Icon name="plus" size={13} /> Nueva reparación
              </button>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Dispositivo</th>
                  <th>Falla</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th className="num">Costo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cliente.reparaciones.map(r => (
                  <tr
                    key={r.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/admin/reparaciones/${r.id}`)}
                  >
                    <td className="mono small muted">{r.codigo}</td>
                    <td style={{ fontWeight: 500 }}>{r.dispositivo}</td>
                    <td className="muted" style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.falla}
                    </td>
                    <td>
                      <span className={`pill pill-${r.estado}`}>{ESTADO_LABELS[r.estado]}</span>
                    </td>
                    <td className="muted">{r.fecha}</td>
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
              <dt>Total reparaciones</dt> <dd>{cliente.reparaciones.length}</dd>
              <dt>Completadas</dt>        <dd>{totalEntregadas}</dd>
              <dt>En curso</dt>           <dd>{cliente.reparaciones.length - totalEntregadas}</dd>
              <dt>Total gastado</dt>      <dd style={{ fontWeight: 700 }}>{formatMoneda(totalGastado)}</dd>
            </dl>
          </div>

          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 14 }}>Acciones</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Icon name="phone" size={14} /> Llamar al cliente
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Icon name="bell" size={14} /> Enviar notificación
              </button>
              <button
                className="btn btn-primary"
                style={{ justifyContent: 'flex-start' }}
                onClick={() => navigate('/admin/reparaciones/nueva')}
              >
                <Icon name="plus" size={14} /> Nueva reparación
              </button>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}
