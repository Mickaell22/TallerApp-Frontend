import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'

const REPUESTOS = [
  { id: 1, sku: 'PNT-IP13P-OEM', nombre: 'Pantalla iPhone 13 Pro (OEM)',    categoria: 'Pantallas',   stock: 2,  minimo: 5,  costo: 78000, ubicacion: 'A-12' },
  { id: 2, sku: 'BAT-IP12-ORIG',  nombre: 'Batería iPhone 12 original',      categoria: 'Baterías',    stock: 14, minimo: 6,  costo: 22000, ubicacion: 'B-04' },
  { id: 3, sku: 'PNT-SAMA52',     nombre: 'Pantalla Samsung A52',            categoria: 'Pantallas',   stock: 1,  minimo: 4,  costo: 41000, ubicacion: 'A-08' },
  { id: 4, sku: 'CON-USBC-XM',   nombre: 'Conector carga USB-C Xiaomi',     categoria: 'Conectores',  stock: 22, minimo: 10, costo: 4500,  ubicacion: 'C-01' },
  { id: 5, sku: 'PNT-IP14',       nombre: 'Pantalla iPhone 14',              categoria: 'Pantallas',   stock: 6,  minimo: 4,  costo: 92000, ubicacion: 'A-15' },
  { id: 6, sku: 'BAT-SAM-S22',   nombre: 'Batería Samsung S22',             categoria: 'Baterías',    stock: 3,  minimo: 5,  costo: 18000, ubicacion: 'B-07' },
  { id: 7, sku: 'CAM-IP13',       nombre: 'Módulo cámara iPhone 13',         categoria: 'Cámaras',     stock: 8,  minimo: 3,  costo: 34000, ubicacion: 'D-02' },
  { id: 8, sku: 'ALT-IP11',       nombre: 'Altavoz iPhone 11',               categoria: 'Audio',       stock: 0,  minimo: 4,  costo: 6800,  ubicacion: 'E-09' },
]

export default function NuevoRepuesto() {
  const navigate  = useNavigate()
  const { id }    = useParams()
  const existente = id ? REPUESTOS.find(r => r.id === Number(id)) : null
  const esEdicion = Boolean(existente)

  const [form, setForm] = useState({
    sku:       existente?.sku       ?? '',
    nombre:    existente?.nombre    ?? '',
    categoria: existente?.categoria ?? '',
    stock:     existente?.stock     ?? '',
    minimo:    existente?.minimo    ?? '',
    costo:     existente?.costo     ?? '',
    ubicacion: existente?.ubicacion ?? '',
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/admin/inventario')
  }

  const titulo   = esEdicion ? 'Editar repuesto' : 'Agregar repuesto'
  const subtitulo = esEdicion ? `Modificando ${existente.nombre}` : 'Registrar nuevo repuesto en inventario'

  return (
    <AdminLayout active="inventario" title={titulo} subtitle={subtitulo}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/inventario')}>
          ← Volver
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div className="card card-pad">
              <h3 className="card-title" style={{ marginBottom: 16 }}>Información del repuesto</h3>
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
                    required
                  />
                </div>
                <div className="field">
                  <label className="label">Categoría</label>
                  <select className="input" name="categoria" value={form.categoria} onChange={handleChange} required>
                    <option value="">Seleccionar...</option>
                    <option>Pantallas</option>
                    <option>Baterías</option>
                    <option>Conectores</option>
                    <option>Cámaras</option>
                    <option>Audio</option>
                    <option>Otro</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label className="label">Ubicación en bodega</label>
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
                  <label className="label">Stock mínimo</label>
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
                <label className="label">Costo unitario ($)</label>
                <input
                  className="input"
                  type="number"
                  name="costo"
                  value={form.costo}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
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
                <dt>Categoría</dt> <dd>{form.categoria || '—'}</dd>
                <dt>Ubicación</dt> <dd className="mono">{form.ubicacion || '—'}</dd>
                <dt>Stock</dt>     <dd>{form.stock !== '' ? `${form.stock} u. (mín ${form.minimo || 0})` : '—'}</dd>
                <dt>Costo</dt>     <dd>{form.costo !== '' ? '$' + Number(form.costo).toLocaleString('es-EC') : '—'}</dd>
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
                El stock ingresado es menor al mínimo. Se generará una alerta.
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
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                <Icon name="check" size={14} /> {esEdicion ? 'Guardar cambios' : 'Agregar repuesto'}
              </button>
            </div>

          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
