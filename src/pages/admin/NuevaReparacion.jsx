import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'
import SelectBusqueda from '../../components/ui/SelectBusqueda'
import { createReparacion } from '../../services/reparacionService'
import { getClientes } from '../../services/clienteService'
import { getUsuarios } from '../../services/usuarioService'

export default function NuevaReparacion() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    cliente_id: '',
    tecnico_id: '',
    marca: '', modelo: '',
    falla: '', observaciones: '',
    costo: '',
  })
  const [clientes, setClientes] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [resClientes, resUsuarios] = await Promise.all([getClientes(), getUsuarios()])
        setClientes(resClientes.data.data || [])
        setTecnicos((resUsuarios.data.data || []).filter(u => u.rol === 'tecnico'))
      } catch {
        // silencioso
      }
    }
    cargarDatos()
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.cliente_id) {
      setError('Debes seleccionar un cliente')
      return
    }
    setError('')
    setCargando(true)
    try {
      await createReparacion({
        cliente_id:  Number(form.cliente_id),
        dispositivo: `${form.marca} ${form.modelo}`.trim(),
        problema:    form.falla,
        notas:       form.observaciones || undefined,
        tecnico_id:  form.tecnico_id ? Number(form.tecnico_id) : undefined,
        costo:       form.costo ? Number(form.costo) : undefined,
      })
      navigate('/admin/reparaciones')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar la reparacion')
    } finally {
      setCargando(false)
    }
  }

  const clienteSeleccionado = clientes.find(c => c.id === Number(form.cliente_id))
  const tecnicoSeleccionado = tecnicos.find(t => t.id === Number(form.tecnico_id))

  return (
    <AdminLayout active="reparaciones" title="Nueva reparacion" subtitle="Registrar ingreso de equipo">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/reparaciones')}>
          ← Volver
        </button>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 className="card-title">Cliente</h3>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => navigate('/admin/clientes/nuevo')}
                >
                  <Icon name="plus" size={13} /> Nuevo cliente
                </button>
              </div>
              <div className="field">
                <label className="label">Buscar cliente registrado</label>
                <SelectBusqueda
                  items={clientes}
                  value={form.cliente_id ? Number(form.cliente_id) : ''}
                  onChange={id => setForm(f => ({ ...f, cliente_id: id }))}
                  getValue={c => c.id}
                  getLabel={c => `${c.usuario?.nombre || ''} — ${c.telefono || c.usuario?.email || ''}`}
                  renderItem={c => (
                    <div>
                      <div style={{ fontWeight: 600 }}>{c.usuario?.nombre || '—'}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--c-text-muted)', marginTop: 2 }}>
                        {c.telefono || '—'} &nbsp;·&nbsp; {c.usuario?.email || ''}
                      </div>
                    </div>
                  )}
                  placeholder={`Buscar entre ${clientes.length} clientes...`}
                  noResultados="No se encontró ningún cliente"
                />
              </div>
            </div>

            <div className="card card-pad">
              <h3 className="card-title" style={{ marginBottom: 16 }}>Tecnico asignado</h3>
              <div className="field">
                <label className="label">Tecnico (opcional)</label>
                <SelectBusqueda
                  items={tecnicos}
                  value={form.tecnico_id ? Number(form.tecnico_id) : ''}
                  onChange={id => setForm(f => ({ ...f, tecnico_id: id }))}
                  getValue={t => t.id}
                  getLabel={t => t.nombre}
                  renderItem={t => (
                    <div>
                      <div style={{ fontWeight: 600 }}>{t.nombre}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--c-text-muted)', marginTop: 2 }}>{t.email}</div>
                    </div>
                  )}
                  placeholder={tecnicos.length > 0 ? `Buscar entre ${tecnicos.length} tecnicos...` : 'Sin tecnicos registrados'}
                  noResultados="No se encontro ningun tecnico"
                />
              </div>
            </div>

            <div className="card card-pad">
              <h3 className="card-title" style={{ marginBottom: 16 }}>Equipo</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label className="label">Marca</label>
                  <select className="input" name="marca" value={form.marca} onChange={handleChange} required>
                    <option value="">Seleccionar...</option>
                    <option>Apple</option>
                    <option>Samsung</option>
                    <option>Xiaomi</option>
                    <option>Motorola</option>
                    <option>Huawei</option>
                    <option>TECNO</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="field">
                  <label className="label">Modelo</label>
                  <input className="input" name="modelo" value={form.modelo} onChange={handleChange} placeholder="Ej: iPhone 13, Galaxy A54..." required minLength={2} maxLength={100} />
                </div>
              </div>
              <div className="field">
                <label className="label">Falla reportada por el cliente</label>
                <textarea className="input" name="falla" value={form.falla} onChange={handleChange} rows="3" placeholder="Describe el problema con el equipo..." required minLength={10} maxLength={500} />
              </div>
              <div className="field">
                <label className="label">Costo estimado (opcional)</label>
                <input className="input" type="number" name="costo" value={form.costo} onChange={handleChange} min="0" step="0.01" placeholder="0.00" />
              </div>
              <div className="field">
                <label className="label">Observaciones del tecnico (opcional)</label>
                <textarea className="input" name="observaciones" value={form.observaciones} onChange={handleChange} rows="2" placeholder="Estado fisico del equipo, accesorios recibidos..." />
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div className="card card-pad" style={{ background: 'var(--c-surface-2)' }}>
              <h3 className="card-title" style={{ marginBottom: 12 }}>Resumen</h3>
              <dl className="kv">
                <dt>Cliente</dt>
                <dd>
                  {clienteSeleccionado ? (
                    <div>
                      <div style={{ fontWeight: 600 }}>{clienteSeleccionado.usuario?.nombre}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--c-text-muted)' }}>{clienteSeleccionado.telefono || clienteSeleccionado.usuario?.email}</div>
                    </div>
                  ) : '—'}
                </dd>
                <dt>Equipo</dt>        <dd>{[form.marca, form.modelo].filter(Boolean).join(' ') || '—'}</dd>
                <dt>Tecnico</dt>       <dd>{tecnicoSeleccionado?.nombre || <span className="muted">Sin asignar</span>}</dd>
                <dt>Costo estimado</dt><dd>{form.costo ? `$${Number(form.costo).toFixed(2)}` : <span className="muted">—</span>}</dd>
                <dt>Estado inicial</dt><dd><span className="pill pill-recibido">Recibido</span></dd>
              </dl>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/admin/reparaciones')}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={cargando}>
                <Icon name="check" size={14} /> {cargando ? 'Registrando...' : 'Registrar ingreso'}
              </button>
            </div>

          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
