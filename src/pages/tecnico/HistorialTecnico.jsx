import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'

const HISTORIAL = [
  { id: 7,  codigo: 'TLR-2026-0142', cliente: 'Camila Ortiz',   dispositivo: 'Samsung S22',       falla: 'Cámara trasera no enfoca',         fechaEntrega: '04 May 2026', costo: 67000  },
  { id: 10, codigo: 'TLR-2026-0139', cliente: 'Bruno Suárez',   dispositivo: 'iPhone XR',          falla: 'Daño por líquido',                 fechaEntrega: '02 May 2026', costo: 89000  },
  { id: 11, codigo: 'TLR-2026-0131', cliente: 'Sofía Romero',   dispositivo: 'Motorola G72',       falla: 'Conector de carga dañado',         fechaEntrega: '28 Abr 2026', costo: 26000  },
  { id: 12, codigo: 'TLR-2026-0118', cliente: 'Diego Castro',   dispositivo: 'iPhone 12',          falla: 'Cambio de batería',                fechaEntrega: '20 Abr 2026', costo: 52000  },
  { id: 13, codigo: 'TLR-2026-0102', cliente: 'Ana Torres',     dispositivo: 'Samsung Galaxy A54', falla: 'Pantalla rota',                    fechaEntrega: '10 Abr 2026', costo: 85000  },
]

function formatMoneda(n) {
  return '$' + n.toLocaleString('es-EC')
}

export default function HistorialTecnico() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const lista = HISTORIAL.filter(r => {
    if (!search) return true
    const q = search.toLowerCase()
    return (r.codigo + r.cliente + r.dispositivo).toLowerCase().includes(q)
  })

  const totalEntregadas = HISTORIAL.length
  const totalFacturado  = HISTORIAL.reduce((s, r) => s + r.costo, 0)

  return (
    <AdminLayout active="historial" title="Historial" subtitle="Reparaciones completadas">
      <div className="page-header">
        <div>
          <h1 className="page-title">Historial</h1>
          <p className="page-subtitle">{totalEntregadas} reparaciones completadas</p>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)', marginBottom: 16 }}>
        <div className="stat-card">
          <div className="stat-card-icon green"><Icon name="check" size={17} /></div>
          <div className="stat-card-label">Completadas (mes)</div>
          <div className="stat-card-value">{totalEntregadas}</div>
          <div className="stat-card-delta"><Icon name="arrowUp" size={11} />+12% vs mes anterior</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--c-primary-bg)', color: 'var(--c-primary)' }}>
            <Icon name="receipt" size={17} />
          </div>
          <div className="stat-card-label">Total facturado</div>
          <div className="stat-card-value">{formatMoneda(totalFacturado)}</div>
          <div className="stat-card-delta">en reparaciones propias</div>
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
        </div>

        <table className="tbl">
          <thead>
            <tr>
              <th>Código</th>
              <th>Cliente</th>
              <th>Dispositivo</th>
              <th>Falla</th>
              <th>Fecha entrega</th>
              <th className="num">Costo</th>
            </tr>
          </thead>
          <tbody>
            {lista.map(r => (
              <tr key={r.id}>
                <td className="mono small muted">{r.codigo}</td>
                <td style={{ fontWeight: 500 }}>{r.cliente}</td>
                <td>{r.dispositivo}</td>
                <td className="muted" style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.falla}
                </td>
                <td className="muted">{r.fechaEntrega}</td>
                <td className="num" style={{ fontFeatureSettings: '"tnum"' }}>{formatMoneda(r.costo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
