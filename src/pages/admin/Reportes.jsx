import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'

const MESES = [
  { m: 'Nov', rep: 86,  ing: 2.1 },
  { m: 'Dic', rep: 102, ing: 2.6 },
  { m: 'Ene', rep: 91,  ing: 2.4 },
  { m: 'Feb', rep: 108, ing: 2.9 },
  { m: 'Mar', rep: 124, ing: 3.2 },
  { m: 'Abr', rep: 119, ing: 3.1 },
  { m: 'May', rep: 142, ing: 3.85 },
]

const POR_ESTADO = [
  { label: 'Entregado',      value: 50, color: 'var(--st-entregado)' },
  { label: 'Listo',          value: 38, color: 'var(--st-listo)' },
  { label: 'En reparación',  value: 24, color: 'var(--st-reparacion)' },
  { label: 'En diagnóstico', value: 18, color: 'var(--st-diagnostico)' },
  { label: 'Recibido',       value: 12, color: 'var(--st-recibido)' },
]

const INVENTARIO_RESUMEN = [
  { categoria: 'Pantallas',  total: 3, bajo: 2, agotado: 0 },
  { categoria: 'Baterías',   total: 2, bajo: 1, agotado: 0 },
  { categoria: 'Conectores', total: 1, bajo: 0, agotado: 0 },
  { categoria: 'Cámaras',    total: 1, bajo: 0, agotado: 0 },
  { categoria: 'Audio',      total: 1, bajo: 1, agotado: 1 },
]

const maxRep = Math.max(...MESES.map(m => m.rep))
const maxIng = Math.max(...MESES.map(m => m.ing))
const totalEstado = POR_ESTADO.reduce((s, e) => s + e.value, 0)

function formatMoneda(n) {
  return '$' + n.toLocaleString('es-EC')
}

export default function Reportes() {
  return (
    <AdminLayout active="reportes" title="Reportes" subtitle="Análisis de los últimos 7 meses">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reportes</h1>
          <p className="page-subtitle">Análisis de los últimos 7 meses</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary">
            <Icon name="calendar" size={14} /> Últimos 7 meses
          </button>
          <button className="btn btn-secondary">
            <Icon name="download" size={14} /> Exportar reporte
          </button>
        </div>
      </div>

      {/* Reparaciones por período */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card card-pad">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div>
              <h3 className="card-title">Reparaciones por mes</h3>
              <div className="muted small">Total ingresadas</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.02em' }}>772</div>
              <div className="small" style={{ color: 'var(--c-success)', fontWeight: 600 }}>+19% vs período anterior</div>
            </div>
          </div>
          <div className="chart-bars">
            {MESES.map(m => (
              <div key={m.m} className="chart-bar">
                <div style={{
                  width: '100%',
                  height: (m.rep / maxRep * 150) + 'px',
                  background: m.m === 'May' ? 'var(--c-accent)' : 'var(--c-primary)',
                  borderRadius: '4px 4px 0 0',
                }} />
                <div className="chart-bar-label">{m.m}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card card-pad">
          <h3 className="card-title">Reparaciones por estado</h3>
          <div className="muted small" style={{ marginBottom: 14 }}>Mes en curso</div>
          <div style={{ display: 'flex', height: 14, borderRadius: 8, overflow: 'hidden', marginBottom: 18 }}>
            {POR_ESTADO.map((e, i) => (
              <div key={i} style={{ background: e.color, width: (e.value / totalEstado * 100) + '%' }} />
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {POR_ESTADO.map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: e.color, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{e.label}</span>
                <span className="muted" style={{ fontFeatureSettings: '"tnum"' }}>{e.value}</span>
                <span style={{ fontWeight: 600, width: 42, textAlign: 'right', fontFeatureSettings: '"tnum"' }}>
                  {Math.round(e.value / totalEstado * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ingresos mensuales */}
      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div>
            <h3 className="card-title">Ingresos mensuales</h3>
            <div className="muted small">Millones de pesos</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.02em' }}>$20,15M</div>
            <div className="small" style={{ color: 'var(--c-success)', fontWeight: 600 }}>+27% YoY</div>
          </div>
        </div>
        <div className="chart-bars" style={{ height: 200 }}>
          {MESES.map(m => (
            <div key={m.m} className="chart-bar">
              <div style={{
                width: '100%',
                height: (m.ing / maxIng * 170) + 'px',
                background: 'var(--c-accent)',
                opacity: .85,
                borderRadius: '4px 4px 0 0',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: -22, left: 0, right: 0,
                  textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--c-text)',
                }}>
                  ${m.ing.toFixed(1)}M
                </div>
              </div>
              <div className="chart-bar-label">{m.m}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Reporte de inventario */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Inventario por categoría</h3>
            <div className="muted small" style={{ marginTop: 2 }}>Estado actual del stock</div>
          </div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Categoría</th>
              <th className="num">Total repuestos</th>
              <th className="num">Stock bajo</th>
              <th className="num">Agotados</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {INVENTARIO_RESUMEN.map(cat => {
              const tieneProblema = cat.agotado > 0 || cat.bajo > 0
              const estadoColor   = cat.agotado > 0 ? 'var(--c-danger)' : cat.bajo > 0 ? 'var(--c-warn)' : 'var(--c-success)'
              const estadoBg      = cat.agotado > 0 ? 'var(--c-danger-bg)' : cat.bajo > 0 ? 'var(--c-warn-bg)' : 'var(--c-success-bg)'
              const estadoLabel   = cat.agotado > 0 ? 'Crítico' : cat.bajo > 0 ? 'Stock bajo' : 'Normal'
              return (
                <tr key={cat.categoria}>
                  <td style={{ fontWeight: 500 }}>{cat.categoria}</td>
                  <td className="num">{cat.total}</td>
                  <td className="num" style={{ color: cat.bajo > 0 ? 'var(--c-warn)' : 'var(--c-text-muted)', fontWeight: cat.bajo > 0 ? 600 : 400 }}>
                    {cat.bajo}
                  </td>
                  <td className="num" style={{ color: cat.agotado > 0 ? 'var(--c-danger)' : 'var(--c-text-muted)', fontWeight: cat.agotado > 0 ? 600 : 400 }}>
                    {cat.agotado}
                  </td>
                  <td>
                    <span className="pill" style={{ background: estadoBg, color: estadoColor }}>
                      {estadoLabel}
                    </span>
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
