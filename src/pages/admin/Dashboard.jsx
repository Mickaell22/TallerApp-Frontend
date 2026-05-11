import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'
import { getReparaciones } from '../../services/reparacionService'
import { getRepuestosAlertas } from '../../services/repuestoService'
import { ESTADO_LABELS, estadoCSS } from '../../utils/estados'

export default function Dashboard() {
  const navigate = useNavigate()
  const hoy = new Date().toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const [reparaciones, setReparaciones] = useState([])
  const [alertas, setAlertas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const [repRes, altRes] = await Promise.all([
          getReparaciones(),
          getRepuestosAlertas(),
        ])
        setReparaciones(repRes.data.data || [])
        setAlertas(altRes.data.data || [])
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar datos')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const total = reparaciones.length
  const activas = reparaciones.filter(r => r.estado !== 'entregado').length
  const recientes = reparaciones.slice(0, 5)

  return (
    <AdminLayout active="dashboard" title="Dashboard" subtitle={`Resumen del taller - ${hoy}`}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Resumen del taller - {hoy}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={() => navigate('/admin/reparaciones/nueva')}>
            <Icon name="plus" size={14} /> Nueva reparacion
          </button>
        </div>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

      {cargando ? (
        <div className="muted" style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-card-icon"><Icon name="wrench" size={17} /></div>
              <div className="stat-card-label">Reparaciones totales</div>
              <div className="stat-card-value">{total}</div>
              <div className="stat-card-delta"><Icon name="arrowUp" size={11} />Total registradas</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon blue"><Icon name="clock" size={17} /></div>
              <div className="stat-card-label">Activas</div>
              <div className="stat-card-value">{activas}</div>
              <div className="stat-card-delta"><Icon name="arrowUp" size={11} />Sin entregar</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon red"><Icon name="alert" size={17} /></div>
              <div className="stat-card-label">Alertas de stock</div>
              <div className="stat-card-value">{alertas.length}</div>
              <div className="stat-card-delta down">Repuestos bajo minimo</div>
            </div>
          </div>

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
                    <th>Codigo</th>
                    <th>Cliente</th>
                    <th>Dispositivo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recientes.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: 24 }} className="muted">
                        No hay reparaciones registradas
                      </td>
                    </tr>
                  )}
                  {recientes.map(r => (
                    <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/reparaciones/${r.id}`)}>
                      <td className="mono muted">{r.codigo}</td>
                      <td>{r.cliente?.usuario?.nombre || '—'}</td>
                      <td className="muted">{r.dispositivo}</td>
                      <td>
                        <span className={`pill pill-${estadoCSS(r.estado)}`}>
                          {ESTADO_LABELS[r.estado] || r.estado}
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
                {alertas.length === 0 && (
                  <div className="muted" style={{ padding: '20px', textAlign: 'center', fontSize: 13 }}>
                    Sin alertas de stock
                  </div>
                )}
                {alertas.slice(0, 6).map(item => {
                  const ratio = item.stock_minimo === 0 ? 1 : item.stock / item.stock_minimo
                  const cls = item.stock === 0 ? 'crit' : ratio < 0.5 ? 'crit' : 'warn'
                  return (
                    <div key={item.id} style={{ padding: '12px 20px', borderBottom: '1px solid var(--c-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{item.nombre}</span>
                        <span className="mono small muted">{item.stock}/{item.stock_minimo}</span>
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
        </>
      )}
    </AdminLayout>
  )
}
