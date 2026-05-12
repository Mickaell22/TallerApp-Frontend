import { useState, useEffect, useMemo } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'
import { getReporteReparaciones, getReporteIngresos, getReporteInventario } from '../../services/reporteService'

function formatMoneda(n) {
  if (!n && n !== 0) return '—'
  return '$' + Number(n).toLocaleString('es-EC')
}

function primerDiaMes() {
  const hoy = new Date()
  return new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().slice(0, 10)
}

function hoy() {
  return new Date().toISOString().slice(0, 10)
}

const ESTADO_COLORS = {
  recibido:       'var(--st-recibido)',
  en_diagnostico: 'var(--st-diagnostico)',
  en_reparacion:  'var(--st-reparacion)',
  listo:          'var(--st-listo)',
  entregado:      'var(--st-entregado)',
}

const ESTADO_LABELS_ES = {
  recibido:       'Recibido',
  en_diagnostico: 'En diagnostico',
  en_reparacion:  'En reparacion',
  listo:          'Listo',
  entregado:      'Entregado',
}

export default function Reportes() {
  const [desde, setDesde] = useState(primerDiaMes())
  const [hasta, setHasta] = useState(hoy())
  const [datosRep, setDatosRep] = useState(null)
  const [datosIng, setDatosIng] = useState(null)
  const [datosInv, setDatosInv] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      setCargando(true)
      setError('')
      try {
        const [repRes, ingRes, invRes] = await Promise.all([
          getReporteReparaciones({ desde, hasta }),
          getReporteIngresos({ desde, hasta }),
          getReporteInventario(),
        ])
        setDatosRep(repRes.data.data?.resumen || null)
        setDatosIng(ingRes.data.data?.resumen || null)
        setDatosInv(invRes.data.data?.repuestos || [])
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar reportes')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [desde, hasta])

  const { porEstado, totalEstado, estadosEntradas } = useMemo(() => {
    const porEstado = datosRep?.por_estado || {}
    const totalEstado = Object.values(porEstado).reduce((s, v) => s + v, 0)
    const estadosEntradas = Object.entries(porEstado)
    return { porEstado, totalEstado, estadosEntradas }
  }, [datosRep])

  const categorias = useMemo(() => {
    const inv = datosInv || []
    const map = {}
    inv.forEach(r => {
      const cat = r.categoria || 'Sin categoria'
      if (!map[cat]) map[cat] = { total: 0, bajo: 0, agotado: 0 }
      map[cat].total++
      if (r.stock < r.stock_minimo) map[cat].bajo++
      if (r.stock === 0) map[cat].agotado++
    })
    return Object.entries(map).map(([cat, v]) => ({ categoria: cat, ...v }))
  }, [datosInv])

  return (
    <AdminLayout active="reportes" title="Reportes" subtitle="Analisis del periodo seleccionado">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reportes</h1>
          <p className="page-subtitle">Analisis del periodo seleccionado</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            type="date"
            className="input"
            style={{ width: 150 }}
            value={desde}
            onChange={e => setDesde(e.target.value)}
          />
          <span className="muted">-</span>
          <input
            type="date"
            className="input"
            style={{ width: 150 }}
            value={hasta}
            onChange={e => setHasta(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

      {cargando ? (
        <div className="muted" style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 16 }}>
            <div className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h3 className="card-title">Reparaciones en el periodo</h3>
                  <div className="muted small">Total ingresadas</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.02em' }}>{datosRep?.total || 0}</div>
                </div>
              </div>
              {estadosEntradas.length === 0 && (
                <div className="muted" style={{ textAlign: 'center', padding: 20 }}>Sin datos en el periodo</div>
              )}
              {estadosEntradas.length > 0 && (
                <>
                  <div style={{ display: 'flex', height: 14, borderRadius: 8, overflow: 'hidden', marginBottom: 18 }}>
                    {estadosEntradas.map(([e, v], i) => (
                      <div key={i} style={{ background: ESTADO_COLORS[e] || 'var(--c-primary)', width: (v / totalEstado * 100) + '%' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {estadosEntradas.map(([e, v], i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: ESTADO_COLORS[e] || 'var(--c-primary)', flexShrink: 0 }} />
                        <span style={{ flex: 1 }}>{ESTADO_LABELS_ES[e] || e}</span>
                        <span className="muted" style={{ fontFeatureSettings: '"tnum"' }}>{v}</span>
                        <span style={{ fontWeight: 600, width: 42, textAlign: 'right', fontFeatureSettings: '"tnum"' }}>
                          {Math.round(v / totalEstado * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <h3 className="card-title">Ingresos en el periodo</h3>
                  <div className="muted small">Total facturado</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.02em' }}>
                    {formatMoneda(datosIng?.total_ingresos)}
                  </div>
                  <div className="small muted">{datosIng?.cantidad_facturas || 0} facturas</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 0 }}>
            <div className="card-header">
              <div>
                <h3 className="card-title">Inventario por categoria</h3>
                <div className="muted small" style={{ marginTop: 2 }}>Estado actual del stock</div>
              </div>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th className="num">Total repuestos</th>
                  <th className="num">Stock bajo</th>
                  <th className="num">Agotados</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {categorias.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: 32 }} className="muted">
                      Sin datos de inventario
                    </td>
                  </tr>
                )}
                {categorias.map(cat => {
                  const estadoColor = cat.agotado > 0 ? 'var(--c-danger)' : cat.bajo > 0 ? 'var(--c-warn)' : 'var(--c-success)'
                  const estadoBg   = cat.agotado > 0 ? 'var(--c-danger-bg)' : cat.bajo > 0 ? 'var(--c-warn-bg)' : 'var(--c-success-bg)'
                  const estadoLabel = cat.agotado > 0 ? 'Critico' : cat.bajo > 0 ? 'Stock bajo' : 'Normal'
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
        </>
      )}
    </AdminLayout>
  )
}
