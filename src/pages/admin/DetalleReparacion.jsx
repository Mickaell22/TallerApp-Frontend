import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'
import { getReparacion, actualizarEstado } from '../../services/reparacionService'
import { getUsuarios } from '../../services/usuarioService'
import SelectBusqueda from '../../components/ui/SelectBusqueda'
import { ESTADO_LABELS, estadoCSS, ESTADOS_ORDEN, ESTADO_TITULOS } from '../../utils/estados'

const ESTADOS_SELECTOR = ['recibido', 'en_diagnostico', 'en_reparacion', 'listo', 'entregado']
const ESTADO_LABELS_SELECTOR = {
  recibido:       'Recibido',
  en_diagnostico: 'En diagnostico',
  en_reparacion:  'En reparacion',
  listo:          'Listo',
  entregado:      'Entregado',
}

function formatMoneda(n) {
  if (!n) return '—'
  return '$' + Number(n).toLocaleString('es-EC')
}

function formatFecha(fecha) {
  if (!fecha) return '—'
  return new Date(fecha).toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })
}

function construirTimeline(estadoActual) {
  const idx = ESTADOS_ORDEN.indexOf(estadoActual)
  return ESTADOS_ORDEN.map((e, i) => ({
    titulo: ESTADO_TITULOS[e] || e,
    done: i < idx,
    current: i === idx,
  }))
}

export default function DetalleReparacion() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [rep, setRep] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [estado, setEstado] = useState('recibido')
  const [nota, setNota] = useState('')
  const [costo, setCosto] = useState('')
  const [tecnicoId, setTecnicoId] = useState('')
  const [tecnicos, setTecnicos] = useState([])
  const [guardando, setGuardando] = useState(false)
  const [msgGuardado, setMsgGuardado] = useState('')

  useEffect(() => {
    async function cargar() {
      try {
        const [resRep, resUsuarios] = await Promise.all([getReparacion(id), getUsuarios()])
        const data = resRep.data.data
        setRep(data)
        setEstado(data.estado)
        setCosto(data.costo ?? '')
        setTecnicoId(data.tecnico?.id || '')
        setTecnicos((resUsuarios.data.data || []).filter(u => u.rol === 'tecnico'))
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar la reparacion')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id])

  async function handleGuardar() {
    setGuardando(true)
    setMsgGuardado('')
    try {
      const res = await actualizarEstado(id, {
        estado,
        notas:      nota || undefined,
        costo:      costo !== '' ? Number(costo) : undefined,
        tecnico_id: tecnicoId || undefined,
      })
      setRep(res.data.data)
      setEstado(res.data.data.estado)
      setCosto(res.data.data.costo ?? '')
      setTecnicoId(res.data.data.tecnico?.id || '')
      setNota('')
      setMsgGuardado('Cambios guardados correctamente')
    } catch (err) {
      setMsgGuardado(err.response?.data?.error || 'Error al guardar')
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return (
      <AdminLayout active="reparaciones" title="Cargando...">
        <div className="muted" style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>
      </AdminLayout>
    )
  }

  if (error || !rep) {
    return (
      <AdminLayout active="reparaciones" title="Reparacion no encontrada">
        <div className="card" style={{ padding: 64, textAlign: 'center' }}>
          <p className="muted">{error || `No se encontro la reparacion con ID ${id}`}</p>
          <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => navigate('/admin/reparaciones')}>
            Volver a reparaciones
          </button>
        </div>
      </AdminLayout>
    )
  }

  const timeline = construirTimeline(rep.estado)
  const repuestos = rep.repuestos || []
  const total = repuestos.reduce((s, r) => s + (r.reparacion_repuesto?.cantidad || 1) * Number(r.precio || 0), 0)

  return (
    <AdminLayout active="reparaciones" title={rep.dispositivo} subtitle={`${rep.cliente?.usuario?.nombre || '—'} - Ingreso ${formatFecha(rep.fecha_entrada)}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/reparaciones')}>
          ← Volver
        </button>
        <span className="muted small mono">{rep.codigo}</span>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">{rep.dispositivo}</h1>
          <p className="page-subtitle">{rep.cliente?.usuario?.nombre || '—'} - Ingreso {formatFecha(rep.fecha_entrada)}</p>
        </div>
        <span className={`pill pill-${estadoCSS(rep.estado)}`} style={{ fontSize: 13, padding: '6px 14px' }}>
          {ESTADO_LABELS[rep.estado] || rep.estado}
        </span>
      </div>

      <div className="detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 14 }}>Informacion del equipo</h3>
            <dl className="kv">
              <dt>Cliente</dt>    <dd>{rep.cliente?.usuario?.nombre || '—'}</dd>
              <dt>Telefono</dt>   <dd className="mono">{rep.cliente?.telefono || '—'}</dd>
              <dt>Dispositivo</dt><dd>{rep.dispositivo}</dd>
              <dt>Falla</dt>      <dd>{rep.problema}</dd>
              <dt>Tecnico</dt>    <dd>{rep.tecnico?.nombre || 'Sin asignar'}</dd>
              <dt>Notas</dt>      <dd className="muted">{rep.notas || '—'}</dd>
            </dl>
          </div>

          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 14 }}>Actualizar estado</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 16 }}>
              {ESTADOS_SELECTOR.map(e => (
                <button
                  key={e}
                  className={'filter-chip' + (estado === e ? ' active' : '')}
                  onClick={() => setEstado(e)}
                  style={{ justifyContent: 'center', padding: '9px 6px', fontSize: 11.5 }}
                >
                  {ESTADO_LABELS_SELECTOR[e]}
                </button>
              ))}
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label className="label">Tecnico asignado</label>
              <SelectBusqueda
                items={tecnicos}
                value={tecnicoId ? Number(tecnicoId) : ''}
                onChange={id => setTecnicoId(id)}
                getValue={t => t.id}
                getLabel={t => t.nombre}
                renderItem={t => (
                  <div>
                    <div style={{ fontWeight: 600 }}>{t.nombre}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--c-text-muted)', marginTop: 2 }}>{t.email}</div>
                  </div>
                )}
                placeholder="Buscar tecnico..."
                noResultados="No se encontro ningun tecnico"
              />
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label className="label">Costo ($)</label>
              <input
                className="input"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={costo}
                onChange={e => setCosto(e.target.value)}
              />
            </div>
            <label className="label">Nota para el cliente (opcional)</label>
            <textarea
              className="input"
              rows="3"
              placeholder="Ej: Pantalla cambiada con exito. Se recomienda usar protector..."
              value={nota}
              onChange={e => setNota(e.target.value)}
            />
            {msgGuardado && (
              <div style={{ marginTop: 8, fontSize: 13, color: msgGuardado.includes('Error') ? 'var(--c-danger)' : 'var(--c-success)' }}>
                {msgGuardado}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 14, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => { setEstado(rep.estado); setCosto(rep.costo ?? ''); setTecnicoId(rep.tecnico?.id || ''); setNota('') }}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleGuardar} disabled={guardando}>
                <Icon name="check" size={14} /> {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Repuestos utilizados</h3>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Repuesto</th>
                  <th className="num">Cant.</th>
                  <th className="num">Precio unit.</th>
                  <th className="num">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {repuestos.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: 24 }} className="muted">
                      Sin repuestos registrados
                    </td>
                  </tr>
                )}
                {repuestos.map((r, i) => {
                  const cant = r.reparacion_repuesto?.cantidad || 1
                  const precio = Number(r.precio || 0)
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{r.nombre}</td>
                      <td className="num">{cant}</td>
                      <td className="num">{formatMoneda(precio)}</td>
                      <td className="num" style={{ fontWeight: 600 }}>{formatMoneda(cant * precio)}</td>
                    </tr>
                  )
                })}
                {repuestos.length > 0 && (
                  <tr style={{ background: 'var(--c-surface-2)' }}>
                    <td colSpan="3" className="num" style={{ fontWeight: 600 }}>Total repuestos</td>
                    <td className="num" style={{ fontWeight: 700, fontSize: 14 }}>{formatMoneda(total)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 18 }}>Linea de tiempo</h3>
            {timeline.map((s, i) => (
              <div key={i} className={`timeline-step${s.done ? ' done' : s.current ? ' current' : ''}`}>
                <div className="timeline-dot">
                  {s.done && <Icon name="check" size={12} />}
                </div>
                <div>
                  <div className="timeline-title">{s.titulo}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card card-pad">
            <h3 className="card-title" style={{ marginBottom: 14 }}>Acciones rapidas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start' }}
                onClick={() => alert(`Mensaje de WhatsApp enviado a ${rep?.cliente?.telefono || rep?.cliente?.usuario?.nombre || 'el cliente'}`)}
              >
                <Icon name="phone" size={14} /> Llamar al cliente
              </button>
              <button
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start' }}
                onClick={() => alert(`Notificación enviada a ${rep?.cliente?.usuario?.nombre || 'el cliente'} por WhatsApp`)}
              >
                <Icon name="bell" size={14} /> Enviar notificacion
              </button>
              <button className="btn btn-primary" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/admin/facturacion/nueva')}>
                <Icon name="receipt" size={14} /> Generar factura
              </button>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}
