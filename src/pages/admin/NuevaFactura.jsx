import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'

const REPARACIONES = [
  { codigo: 'TLR-2026-0148', cliente: 'Ana Torres',     dispositivo: 'Samsung Galaxy A54' },
  { codigo: 'TLR-2026-0147', cliente: 'Luis Méndez',    dispositivo: 'iPhone 13' },
  { codigo: 'TLR-2026-0146', cliente: 'Carmen Ríos',    dispositivo: 'Xiaomi Redmi Note 11' },
  { codigo: 'TLR-2026-0145', cliente: 'Pedro Suárez',   dispositivo: 'iPhone 12 Pro' },
]

const ITEM_VACIO = { descripcion: '', cantidad: 1, precio: '' }

function formatMoneda(n) {
  const num = Number(n)
  if (!num) return '—'
  return '$' + num.toLocaleString('es-EC')
}

export default function NuevaFactura() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    reparacion: '',
    cliente:    '',
    email:      '',
    telefono:   '',
  })
  const [items, setItems] = useState([{ ...ITEM_VACIO }])

  function handleChange(e) {
    const { name, value } = e.target
    if (name === 'reparacion') {
      const rep = REPARACIONES.find(r => r.codigo === value)
      setForm({ ...form, reparacion: value, cliente: rep?.cliente || '' })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  function handleItemChange(i, field, value) {
    const next = items.map((item, j) => j === i ? { ...item, [field]: value } : item)
    setItems(next)
  }

  function addItem() {
    setItems([...items, { ...ITEM_VACIO }])
  }

  function removeItem(i) {
    setItems(items.filter((_, j) => j !== i))
  }

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/admin/facturacion')
  }

  const subtotal = items.reduce((s, i) => s + (Number(i.cantidad) * Number(i.precio) || 0), 0)
  const iva      = Math.round(subtotal * 0.15)
  const total    = subtotal + iva

  return (
    <AdminLayout active="facturacion" title="Nueva factura" subtitle="Generar factura para una reparación">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/facturacion')}>
          ← Volver
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div className="card card-pad">
              <h3 className="card-title" style={{ marginBottom: 16 }}>Reparación vinculada</h3>
              <div className="field">
                <label className="label">Orden de servicio</label>
                <select className="input" name="reparacion" value={form.reparacion} onChange={handleChange} required>
                  <option value="">Seleccionar reparación...</option>
                  {REPARACIONES.map(r => (
                    <option key={r.codigo} value={r.codigo}>
                      {r.codigo} — {r.cliente} ({r.dispositivo})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="field">
                  <label className="label">Cliente</label>
                  <input
                    className="input"
                    name="cliente"
                    value={form.cliente}
                    onChange={handleChange}
                    placeholder="Nombre del cliente"
                    required
                  />
                </div>
                <div className="field">
                  <label className="label">Correo electrónico</label>
                  <input
                    className="input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Líneas de factura</h3>
                <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>
                  <Icon name="plus" size={13} /> Agregar línea
                </button>
              </div>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th className="num" style={{ width: 70 }}>Cant.</th>
                    <th className="num" style={{ width: 120 }}>Precio unit.</th>
                    <th className="num" style={{ width: 110 }}>Subtotal</th>
                    <th style={{ width: 40 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          className="input"
                          style={{ margin: 0 }}
                          placeholder="Ej: Mano de obra, repuesto..."
                          value={item.descripcion}
                          onChange={e => handleItemChange(i, 'descripcion', e.target.value)}
                          required
                        />
                      </td>
                      <td>
                        <input
                          className="input"
                          style={{ margin: 0, textAlign: 'right' }}
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={e => handleItemChange(i, 'cantidad', e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="input"
                          style={{ margin: 0, textAlign: 'right' }}
                          type="number"
                          min="0"
                          placeholder="0"
                          value={item.precio}
                          onChange={e => handleItemChange(i, 'precio', e.target.value)}
                        />
                      </td>
                      <td className="num" style={{ fontWeight: 600, fontFeatureSettings: '"tnum"' }}>
                        {formatMoneda(Number(item.cantidad) * Number(item.precio))}
                      </td>
                      <td>
                        {items.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => removeItem(i)}
                          >
                            ×
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: 'var(--c-surface-2)' }}>
                    <td colSpan="3" className="num" style={{ fontWeight: 600 }}>Subtotal</td>
                    <td className="num" style={{ fontFeatureSettings: '"tnum"' }}>{formatMoneda(subtotal)}</td>
                    <td></td>
                  </tr>
                  <tr style={{ background: 'var(--c-surface-2)' }}>
                    <td colSpan="3" className="num muted">IVA 15%</td>
                    <td className="num muted" style={{ fontFeatureSettings: '"tnum"' }}>{formatMoneda(iva)}</td>
                    <td></td>
                  </tr>
                  <tr style={{ background: 'var(--c-surface-2)' }}>
                    <td colSpan="3" className="num" style={{ fontWeight: 700, fontSize: 14 }}>Total</td>
                    <td className="num" style={{ fontWeight: 700, fontSize: 14, fontFeatureSettings: '"tnum"' }}>{formatMoneda(total)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div className="card card-pad" style={{ background: 'var(--c-surface-2)' }}>
              <h3 className="card-title" style={{ marginBottom: 12 }}>Resumen</h3>
              <dl className="kv">
                <dt>Cliente</dt>     <dd>{form.cliente    || '—'}</dd>
                <dt>Reparación</dt>  <dd className="mono">{form.reparacion || '—'}</dd>
                <dt>Líneas</dt>      <dd>{items.length} ítem{items.length !== 1 ? 's' : ''}</dd>
                <dt>Subtotal</dt>    <dd>{formatMoneda(subtotal)}</dd>
                <dt>IVA 15%</dt>     <dd>{formatMoneda(iva)}</dd>
                <dt>Total</dt>       <dd style={{ fontWeight: 700 }}>{formatMoneda(total)}</dd>
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
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                <Icon name="check" size={14} /> Generar factura
              </button>
            </div>

          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
