import { useState } from 'react'
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

const REPARACIONES = [
  { id: 1, codigo: 'TLR-2026-0148', cliente: 'Ana Torres',      dispositivo: 'Samsung Galaxy A54',   falla: 'Pantalla rota, no enciende',        estado: 'reparacion',  tecnico: 'Carlos M.',   fechaIngreso: '03 May 2026', costo: 85000 },
  { id: 2, codigo: 'TLR-2026-0147', cliente: 'Luis Méndez',     dispositivo: 'iPhone 13',             falla: 'No carga, conector dañado',         estado: 'diagnostico', tecnico: 'Carlos M.',   fechaIngreso: '03 May 2026', costo: 45000 },
  { id: 3, codigo: 'TLR-2026-0146', cliente: 'Carmen Ríos',     dispositivo: 'Xiaomi Redmi Note 11',  falla: 'Batería se drena rápido',            estado: 'listo',       tecnico: 'Pedro A.',    fechaIngreso: '02 May 2026', costo: 32000 },
  { id: 4, codigo: 'TLR-2026-0145', cliente: 'Pedro Suárez',    dispositivo: 'iPhone 12 Pro',         falla: 'Pantalla con líneas, táctil falla',  estado: 'recibido',    tecnico: 'Sin asignar', fechaIngreso: '02 May 2026', costo: 0 },
  { id: 5, codigo: 'TLR-2026-0144', cliente: 'María González',  dispositivo: 'Motorola Edge 30',      falla: 'Cámara no enfoca',                   estado: 'entregado',   tecnico: 'Pedro A.',    fechaIngreso: '30 Abr 2026', costo: 28000 },
  { id: 6, codigo: 'TLR-2026-0143', cliente: 'Jorge Vásquez',   dispositivo: 'Samsung Galaxy S22',    falla: 'Micrófono no funciona en llamadas',  estado: 'reparacion',  tecnico: 'Carlos M.',   fechaIngreso: '30 Abr 2026', costo: 40000 },
  { id: 7, codigo: 'TLR-2026-0142', cliente: 'Lucía Paredes',   dispositivo: 'iPhone 11',             falla: 'Face ID no reconoce',                estado: 'diagnostico', tecnico: 'Pedro A.',    fechaIngreso: '29 Abr 2026', costo: 0 },
]

const FILTROS = [
  { id: 'todos',       label: 'Todos' },
  { id: 'recibido',    label: 'Recibido' },
  { id: 'diagnostico', label: 'En diagnóstico' },
  { id: 'reparacion',  label: 'En reparación' },
  { id: 'listo',       label: 'Listo' },
  { id: 'entregado',   label: 'Entregado' },
]

function formatMoneda(n) {
  if (!n) return '—'
  return '$' + n.toLocaleString('es-EC')
}

export default function Reparaciones() {
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState('todos')
  const [search, setSearch] = useState('')

  const lista = REPARACIONES.filter(r => {
    if (filtro !== 'todos' && r.estado !== filtro) return false
    if (search) {
      const q = search.toLowerCase()
      if (!(r.codigo + r.cliente + r.dispositivo + r.falla).toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <AdminLayout active="reparaciones" title="Reparaciones" subtitle={`${lista.length} órdenes de servicio`}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reparaciones</h1>
          <p className="page-subtitle">{lista.length} reparaciones</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary">
            <Icon name="download" size={14} /> Exportar
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/reparaciones/nueva')}>
            <Icon name="plus" size={14} /> Nueva reparación
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="search">
            <Icon name="search" size={14} />
            <input
              placeholder="Buscar por código, cliente o equipo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FILTROS.map(f => (
              <button
                key={f.id}
                className={'filter-chip' + (filtro === f.id ? ' active' : '')}
                onClick={() => setFiltro(f.id)}
              >
                {f.label}
                {f.id === 'todos' && (
                  <span style={{ opacity: .7, marginLeft: 4 }}>{REPARACIONES.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <table className="tbl">
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Dispositivo</th>
              <th>Falla</th>
              <th>Estado</th>
              <th>Técnico</th>
              <th>Ingreso</th>
              <th className="num">Costo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lista.map(r => (
              <tr
                key={r.id}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/admin/reparaciones/${r.id}`)}
              >
                <td className="mono">{r.codigo}</td>
                <td>{r.cliente}</td>
                <td>{r.dispositivo}</td>
                <td className="muted" style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.falla}
                </td>
                <td>
                  <span className={`pill pill-${r.estado}`}>{ESTADO_LABELS[r.estado]}</span>
                </td>
                <td className="muted">{r.tecnico}</td>
                <td className="muted">{r.fechaIngreso}</td>
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
    </AdminLayout>
  )
}
