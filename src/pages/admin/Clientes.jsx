import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'
import { getClientes } from '../../services/clienteService'
import { descargarCSV } from '../../utils/exportCSV'

function formatFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Clientes() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [clientes, setClientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const res = await getClientes()
        setClientes(res.data.data || [])
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar clientes')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const lista = clientes.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return ((c.usuario?.nombre || '') + (c.telefono || '') + (c.usuario?.email || '')).toLowerCase().includes(q)
  })

  return (
    <AdminLayout active="clientes" title="Clientes" subtitle={`${clientes.length} clientes registrados`}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">{clientes.length} clientes registrados</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => descargarCSV(
            clientes.map(c => ({
              Nombre: c.usuario?.nombre || '',
              Email: c.usuario?.email || '',
              Telefono: c.telefono || '',
              Direccion: c.direccion || '',
              'Total reparaciones': c.total_reparaciones || 0,
            })), 'clientes.csv')}>
            <Icon name="download" size={14} /> Exportar
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/clientes/nuevo')}>
            <Icon name="plus" size={14} /> Nuevo cliente
          </button>
        </div>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="table-wrap">
        <div className="table-toolbar">
          <div className="search">
            <Icon name="search" size={14} />
            <input
              placeholder="Buscar por nombre, telefono o correo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {cargando ? (
          <div className="muted" style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Telefono</th>
                <th>Correo</th>
                <th className="num">Reparaciones</th>
                <th>Ultima visita</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lista.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 32 }} className="muted">
                    No hay clientes registrados
                  </td>
                </tr>
              )}
              {lista.map(c => (
                <tr
                  key={c.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/admin/clientes/${c.id}`)}
                >
                  <td style={{ fontWeight: 500 }}>{c.usuario?.nombre || '—'}</td>
                  <td className="mono muted">{c.telefono || '—'}</td>
                  <td className="muted">{c.usuario?.email || '—'}</td>
                  <td className="num">{c.total_reparaciones || 0}</td>
                  <td className="muted">{formatFecha(c.ultima_visita)}</td>
                  <td>
                    <button className="icon-btn" style={{ width: 28, height: 28, border: 'none' }}>
                      <Icon name="chevronRight" size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}
