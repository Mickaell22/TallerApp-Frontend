import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'

const ESTADO_LABELS = {
  recibido:    'Recibido',
  diagnostico: 'En diagnóstico',
  reparacion:  'En reparación',
  listo:       'Listo',
  entregado:   'Entregado',
}

const reparacionesRecientes = [
  { id: 1, codigo: 'TLR-2026-0148', cliente: 'Ana Torres',     dispositivo: 'Samsung Galaxy A54', estado: 'reparacion' },
  { id: 2, codigo: 'TLR-2026-0147', cliente: 'Luis Méndez',    dispositivo: 'iPhone 13',          estado: 'diagnostico' },
  { id: 3, codigo: 'TLR-2026-0146', cliente: 'Carmen Ríos',    dispositivo: 'Xiaomi Redmi Note 11', estado: 'listo' },
  { id: 4, codigo: 'TLR-2026-0145', cliente: 'Pedro Suárez',   dispositivo: 'iPhone 12 Pro',      estado: 'recibido' },
  { id: 5, codigo: 'TLR-2026-0144', cliente: 'María González', dispositivo: 'Motorola Edge 30',   estado: 'entregado' },
]

const stockBajo = [
  { id: 1, nombre: 'Pantalla iPhone 12',       stock: 1, minimo: 5 },
  { id: 2, nombre: 'Batería Samsung A54',       stock: 0, minimo: 4 },
  { id: 3, nombre: 'Conector de carga USB-C',  stock: 2, minimo: 10 },
  { id: 4, nombre: 'Pantalla Xiaomi Redmi 10', stock: 1, minimo: 3 },
]

const stats = [
  { label: 'Reparaciones totales', value: '1.284', delta: '+12% vs mes anterior', icon: 'wrench',  color: '',      down: false },
  { label: 'Activas',              value: '47',    delta: '8 ingresaron hoy',     icon: 'clock',   color: 'blue',  down: false },
  { label: 'Ingresos del mes',     value: '$3.848', delta: '+23% vs abril',       icon: 'receipt', color: 'green', down: false },
  { label: 'Alertas de stock',     value: '5',     delta: '2 críticos',           icon: 'alert',   color: 'red',   down: true  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const hoy = new Date().toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <AdminLayout active="dashboard" title="Dashboard" subtitle={`Resumen del taller — ${hoy}`}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Resumen del taller — {hoy}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary">
            <Icon name="calendar" size={14} /> Este mes
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/reparaciones/nueva')}>
            <Icon name="plus" size={14} /> Nueva reparación
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className={'stat-card-icon ' + s.color}>
              <Icon name={s.icon} size={17} />
            </div>
            <div className="stat-card-label">{s.label}</div>
            <div className="stat-card-value">{s.value}</div>
            <div className={'stat-card-delta' + (s.down ? ' down' : '')}>
              <Icon name={s.down ? 'arrowDown' : 'arrowUp'} size={11} />
              {s.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Tabla + Stock bajo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Reparaciones recientes</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/reparaciones')}>
              Ver todas <Icon name="arrowRight" size={13} />
            </button>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Dispositivo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reparacionesRecientes.map(r => (
                <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/reparaciones/${r.id}`)}>
                  <td className="mono muted">{r.codigo}</td>
                  <td>{r.cliente}</td>
                  <td className="muted">{r.dispositivo}</td>
                  <td>
                    <span className={`pill pill-${r.estado}`}>
                      {ESTADO_LABELS[r.estado]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Stock bajo</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/inventario')}>
              Ver todo <Icon name="arrowRight" size={13} />
            </button>
          </div>
          <div style={{ padding: '4px 0' }}>
            {stockBajo.map(item => {
              const ratio = item.stock / item.minimo
              const cls = item.stock === 0 ? 'crit' : ratio < 0.5 ? 'crit' : 'warn'
              return (
                <div key={item.id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--c-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{item.nombre}</span>
                    <span className="mono small muted">{item.stock}/{item.minimo}</span>
                  </div>
                  <div className="stock-bar" style={{ width: '100%' }}>
                    <div
                      className={'stock-bar-fill ' + cls}
                      style={{ width: Math.max(4, Math.min(100, ratio * 100)) + '%' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
