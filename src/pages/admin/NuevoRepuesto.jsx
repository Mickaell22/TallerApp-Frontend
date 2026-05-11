import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'
import { getRepuesto, createRepuesto, updateRepuesto } from '../../services/repuestoService'

export default function NuevoRepuesto() {
  const navigate  = useNavigate()
  const { id }    = useParams()
  const esEdicion = Boolean(id)

  const [form, setForm] = useState({
    sku:       '',
    nombre:    '',
    categoria: '',
    stock:     '',
    minimo:    '',
    costo:     '',
    ubicacion: '',
  })
  const [cargando, setCargando] = useState(esEdicion)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!esEdicion) return
    async function cargar() {
      try {
        const res = await getRepuesto(id)
        const r = res.data.data
        setForm({
          sku:       r.sku       || '',
          nombre:    r.nombre    || '',
          categoria: r.categoria || '',
          stock:     r.stock     ?? '',
          minimo:    r.stock_minimo ?? '',
          costo:     r.precio    || '',
          ubicacion: r.ubicacion || '',
        })
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar repuesto')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id, esEdicion])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setGuardando(true)
    const datos = {
      nombre:      form.nombre,
      descripcion: '',
      stock:       Number(form.stock),
      stock_minimo: Number(form.minimo),
      precio:      Number(form.costo),
      sku:         form.sku || undefined,
      categoria:   form.categoria || undefined,
      ubicacion:   form.ubicacion || undefined,
    }
    try {
      if (esEdicion) {
        await updateRepuesto(id, datos)
      } else {
        await createRepuesto(datos)
      }
      navigate('/admin/inventario')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar repuesto')
    } finally {
      setGuardando(false)
    }
  }

  const titulo    = esEdicion ? 'Editar repuesto' : 'Agregar repuesto'
  const subtitulo = esEdicion ? `Modificando ${form.nombre || '...'}` : 'Registrar nuevo repuesto en inventario'

  if (cargando) {
    return (
      <AdminLayout active="inventario" title={titulo} subtitle={subtitulo}>
        <div className="muted" style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout active="inventario" title={titulo} subtitle={subtitulo}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/inventario')}>
          ← Volver
        </button>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div className="card card-pad">
              <h3 className="card-title" style={{ marginBottom: 16 }}>Informacion del repuesto</h3>
              <div className="field">
                <label className="label">Nombre</label>
                <input
                  className="input"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Pantalla iPhone 13 Pro (OEM)"
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label className="label">SKU</label>
                  <input
                    className="input"
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="Ej: PNT-IP13P-OEM"
                  />
                </div>
                <div className="field">
                  <label className="label">Categoria</label>
                  <select className="input" name="categoria" value={form.categoria} onChange={handleChange}>
                    <option value="">Seleccionar...</option>
                    <option>Pantallas</option>
                    <option>Baterias</option>
                    <option>Conectores</option>
                    <option>Camaras</option>
                    <option>Audio</option>
                    <option>Otro</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label className="label">Ubicacion en bodega</label>
                <input
                  className="input"
                  name="ubicacion"
                  value={form.ubicacion}
                  onChange={handleChange}
                  placeholder="Ej: A-12"
                />
              </div>
            </div>

            <div className="card card-pad">
              <h3 className="card-title" style={{ marginBottom: 16 }}>Stock y costos</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label className="label">Stock actual</label>
                  <input
                    className="input"
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div className="field">
                  <label className="label">Stock minimo</label>
                  <input
                    className="input"
                    type="number"
                    name="minimo"
                    value={form.minimo}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Precio unitario ($)</label>
                <input
                  className="input"
                  type="number"
                  name="costo"
                  value={form.costo}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div className="card card-pad" style={{ background: 'var(--c-surface-2)' }}>
              <h3 className="card-title" style={{ marginBottom: 12 }}>Resumen</h3>
              <dl className="kv">
                <dt>Nombre</dt>    <dd>{form.nombre    || '—'}</dd>
                <dt>SKU</dt>       <dd className="mono">{form.sku       || '—'}</dd>
                <dt>Categoria</dt> <dd>{form.categoria || '—'}</dd>
                <dt>Ubicacion</dt> <dd className="mono">{form.ubicacion || '—'}</dd>
                <dt>Stock</dt>     <dd>{form.stock !== '' ? `${form.stock} u. (min ${form.minimo || 0})` : '—'}</dd>
                <dt>Precio</dt>    <dd>{form.costo !== '' ? '$' + Number(form.costo).toLocaleString('es-EC') : '—'}</dd>
              </dl>
            </div>

            {form.stock !== '' && form.minimo !== '' && Number(form.stock) < Number(form.minimo) && (
              <div style={{
                background: 'var(--c-danger-bg)',
                border: '1px solid rgba(196,48,48,.2)',
                borderRadius: 8,
                padding: '12px 14px',
                color: 'var(--c-danger)',
                fontSize: 13,
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}>
                <Icon name="alert" size={14} />
                El stock ingresado es menor al minimo. Se generara una alerta.
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => navigate('/admin/inventario')}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={guardando}>
                <Icon name="check" size={14} /> {guardando ? 'Guardando...' : (esEdicion ? 'Guardar cambios' : 'Agregar repuesto')}
              </button>
            </div>

          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
