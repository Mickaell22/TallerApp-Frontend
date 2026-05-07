import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'

const CLIENTES = [
  { id: 1, nombre: 'Ana Torres',      telefono: '+593 99 123 4567', email: 'ana.torres@ejemplo.com',      reparaciones: 3, ultimaVisita: '03 May 2026', gasto: 210000 },
  { id: 2, nombre: 'Luis Méndez',     telefono: '+593 98 234 5678', email: 'luis.mendez@ejemplo.com',     reparaciones: 1, ultimaVisita: '03 May 2026', gasto: 45000  },
  { id: 3, nombre: 'Carmen Ríos',     telefono: '+593 97 345 6789', email: 'carmen.rios@ejemplo.com',     reparaciones: 2, ultimaVisita: '02 May 2026', gasto: 78000  },
  { id: 4, nombre: 'Pedro Suárez',    telefono: '+593 99 456 7890', email: 'pedro.suarez@ejemplo.com',    reparaciones: 4, ultimaVisita: '02 May 2026', gasto: 320000 },
  { id: 5, nombre: 'María González',  telefono: '+593 98 567 8901', email: 'maria.gonzalez@ejemplo.com',  reparaciones: 1, ultimaVisita: '30 Abr 2026', gasto: 28000  },
  { id: 6, nombre: 'Jorge Vásquez',   telefono: '+593 97 678 9012', email: 'jorge.vasquez@ejemplo.com',   reparaciones: 2, ultimaVisita: '30 Abr 2026', gasto: 95000  },
  { id: 7, nombre: 'Lucía Paredes',   telefono: '+593 99 789 0123', email: 'lucia.paredes@ejemplo.com',   reparaciones: 1, ultimaVisita: '29 Abr 2026', gasto: 0      },
  { id: 8, nombre: 'Camila Ortiz',    telefono: '+593 98 765 4321', email: 'camila.ortiz@ejemplo.com',    reparaciones: 2, ultimaVisita: '04 May 2026', gasto: 134000 },
  { id: 9, nombre: 'Bruno Suárez',    telefono: '+593 99 111 2233', email: 'bruno@ejemplo.com',           reparaciones: 1, ultimaVisita: '03 May 2026', gasto: 89000  },
]

function formatMoneda(n) {
  if (!n) return '—'
  return '$' + n.toLocaleString('es-EC')
}

export default function Clientes() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const lista = CLIENTES.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return (c.nombre + c.telefono + c.email).toLowerCase().includes(q)
  })

  return (
    <AdminLayout active="clientes" title="Clientes" subtitle={`${CLIENTES.length} clientes registrados`}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">{CLIENTES.length} clientes registrados</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary">
            <Icon name="download" size={14} /> Exportar
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/clientes/nuevo')}>
            <Icon name="plus" size={14} /> Nuevo cliente
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="search">
            <Icon name="search" size={14} />
            <input
              placeholder="Buscar por nombre, teléfono o correo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="tbl">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th className="num">Reparaciones</th>
              <th>Última visita</th>
              <th className="num">Total gastado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lista.map(c => (
              <tr
                key={c.id}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/admin/clientes/${c.id}`)}
              >
                <td style={{ fontWeight: 500 }}>{c.nombre}</td>
                <td className="mono muted">{c.telefono}</td>
                <td className="muted">{c.email}</td>
                <td className="num">{c.reparaciones}</td>
                <td className="muted">{c.ultimaVisita}</td>
                <td className="num" style={{ fontFeatureSettings: '"tnum"' }}>{formatMoneda(c.gasto)}</td>
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
