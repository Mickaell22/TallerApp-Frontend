import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'
import SelectBusqueda from '../../components/ui/SelectBusqueda'
import { createFactura, getFacturas } from '../../services/facturaService'
import { getReparaciones } from '../../services/reparacionService'

export default function NuevaFactura() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    reparacion_id: '',
    estado_pago:   'pendiente',
  })
  const [reparaciones, setReparaciones] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const [resRep, resFact] = await Promise.all([getReparaciones(), getFacturas()])
        const yaFacturadas = new Set(
          (resFact.data.data || []).map(f => f.reparacion_id)
        )
        const lista = (resRep.data.data || []).filter(r =>
          (r.estado === 'listo' || r.estado === 'entregado') && !yaFacturadas.has(r.id)
        )
        setReparaciones(lista)
      } catch {
        // silencioso
      }
    }
    cargar()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.reparacion_id) {
      setError('Debes seleccionar una reparacion')
      return
    }
    setError('')
    setCargando(true)
    try {
      await createFactura({
        reparacion_id: Number(form.reparacion_id),
        estado_pago:   form.estado_pago,
      })
      navigate('/admin/facturacion')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al generar la factura')
    } finally {
      setCargando(false)
    }
  }

  const repSeleccionada = reparaciones.find(r => r.id === Number(form.reparacion_id))

  return (
    <AdminLayout active="facturacion" title="Nueva factura" subtitle="Generar factura para una reparacion">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/facturacion')}>
          ← Volver
        </button>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div className="card card-pad">
              <h3 className="card-title" style={{ marginBottom: 16 }}>Reparacion vinculada</h3>
              <div className="field">
                <label className="label">Orden de servicio (listas o entregadas, sin factura)</label>
                <SelectBusqueda
                  items={reparaciones}
                  value={form.reparacion_id ? Number(form.reparacion_id) : ''}
                  onChange={id => setForm(f => ({ ...f, reparacion_id: id }))}
                  getValue={r => r.id}
                  getLabel={r => `${r.codigo} — ${r.cliente?.usuario?.nombre || '—'} (${r.dispositivo || ''})`}
                  renderItem={r => (
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.codigo} &nbsp;·&nbsp; {r.dispositivo || '—'}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--c-text-muted)', marginTop: 2 }}>
                        {r.cliente?.usuario?.nombre || '—'} &nbsp;·&nbsp; {r.cliente?.telefono || r.cliente?.usuario?.email || ''}
                      </div>
                    </div>
                  )}
                  placeholder={`Buscar entre ${reparaciones.length} ordenes sin factura...`}
                  noResultados="No hay reparaciones listas sin factura"
                />
                {reparaciones.length === 0 && (
                  <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                    No hay reparaciones listas o entregadas sin factura generada.
                  </p>
                )}
              </div>
              <div className="field">
                <label className="label">Estado de pago</label>
                <select
                  className="input"
                  name="estado_pago"
                  value={form.estado_pago}
                  onChange={e => setForm(f => ({ ...f, estado_pago: e.target.value }))}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="pagado">Pagado</option>
                </select>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div className="card card-pad" style={{ background: 'var(--c-surface-2)' }}>
              <h3 className="card-title" style={{ marginBottom: 12 }}>Resumen</h3>
              <dl className="kv">
                <dt>Cliente</dt>
                <dd>
                  {repSeleccionada ? (
                    <div>
                      <div style={{ fontWeight: 600 }}>{repSeleccionada.cliente?.usuario?.nombre || '—'}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--c-text-muted)' }}>
                        {repSeleccionada.cliente?.telefono || repSeleccionada.cliente?.usuario?.email || ''}
                      </div>
                    </div>
                  ) : '—'}
                </dd>
                <dt>Dispositivo</dt>  <dd>{repSeleccionada?.dispositivo || '—'}</dd>
                <dt>Reparacion</dt>   <dd className="mono">{repSeleccionada?.codigo || '—'}</dd>
                <dt>Estado pago</dt>  <dd>{form.estado_pago === 'pagado' ? 'Pagado' : 'Pendiente'}</dd>
                <dt>Total</dt>        <dd className="muted">Calculado automaticamente</dd>
              </dl>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => navigate('/admin/facturacion')}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={cargando}>
                <Icon name="check" size={14} /> {cargando ? 'Generando...' : 'Generar factura'}
              </button>
            </div>

          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
