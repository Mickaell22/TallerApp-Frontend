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

const ASIGNADAS = [
  { id: 1, codigo: 'TLR-2026-0148', cliente: 'María González', telefono: '+593 99 123 4567', dispositivo: 'iPhone 13 Pro',        falla: 'Pantalla rota tras caída',         estado: 'reparacion',  fechaIngreso: '02 May 2026', costo: 145000, prioridad: 'high' },
  { id: 2, codigo: 'TLR-2026-0147', cliente: 'Juan Pérez',     telefono: '+593 98 234 5678', dispositivo: 'Samsung Galaxy A52',   falla: 'No carga la batería',              estado: 'diagnostico', fechaIngreso: '03 May 2026', costo: 38000,  prioridad: 'med'  },
  { id: 4, codigo: 'TLR-2026-0145', cliente: 'Diego Castro',   telefono: '+593 97 345 6789', dispositivo: 'iPhone 12',            falla: 'Cambio de batería',                estado: 'listo',       fechaIngreso: '01 May 2026', costo: 52000,  prioridad: 'low'  },
  { id: 9, codigo: 'TLR-2026-0140', cliente: 'Valentina Cruz', telefono: '+593 99 456 7890', dispositivo: 'Xiaomi 12T',           falla: 'Botón de encendido no responde',   estado: 'reparacion',  fechaIngreso: '30 Abr 2026', costo: 31000,  prioridad: 'med'  },
]

const FILTROS = [
  { id: 'todas',       label: 'Todas' },
  { id: 'diagnostico', label: 'En diagnóstico' },
  { id: 'reparacion',  label: 'En reparación' },
  { id: 'listo',       label: 'Listas' },
]

export default function MisReparaciones() {
  const navigate = useNavigate()
  const [filtro, setFiltro] = useState('todas')

  const lista = ASIGNADAS.filter(r => filtro === 'todas' || r.estado === filtro)
  const activas = lista.filter(r => r.estado !== 'listo')
  const listas  = lista.filter(r => r.estado === 'listo')

  return (
    <AdminLayout active="asignadas" title="Mis reparaciones" subtitle="Hola, Carlos">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mis reparaciones</h1>
          <p className="page-subtitle">{ASIGNADAS.length} reparaciones asignadas • Hola, Carlos</p>
        </div>
        <button className="btn btn-secondary">
          <Icon name="qr" size={14} /> Escanear código
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {FILTROS.map(f => {
          const count = f.id === 'todas' ? ASIGNADAS.length : ASIGNADAS.filter(r => r.estado === f.id).length
          return (
            <button
              key={f.id}
              className={'filter-chip' + (filtro === f.id ? ' active' : '')}
              onClick={() => setFiltro(f.id)}
            >
              {f.label}
              <span style={{ opacity: .7, marginLeft: 4 }}>{count}</span>
            </button>
          )
        })}
      </div>

      {activas.length > 0 && (
        <>
          <h3 style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 12px' }}>
            En curso
          </h3>
          <div className="assignment-list" style={{ marginBottom: 24 }}>
            {activas.map(r => (
              <div
                key={r.id}
                className="assignment-row"
                onClick={() => navigate(`/tecnico/${r.id}`)}
              >
                <div className={'assignment-priority ' + r.prioridad} />
                <div className="assignment-info">
                  <div className="assignment-device">
                    {r.dispositivo}
                    <span className="mono small muted" style={{ fontWeight: 400, marginLeft: 6 }}>{r.codigo}</span>
                  </div>
                  <div className="assignment-meta">{r.cliente} • {r.falla}</div>
                </div>
                <span className={`pill pill-${r.estado}`}>{ESTADO_LABELS[r.estado]}</span>
                <Icon name="chevronRight" size={16} className="assignment-arrow" />
              </div>
            ))}
          </div>
        </>
      )}

      {listas.length > 0 && (
        <>
          <h3 style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 12px' }}>
            Listas para entregar
          </h3>
          <div className="assignment-list">
            {listas.map(r => (
              <div
                key={r.id}
                className="assignment-row"
                onClick={() => navigate(`/tecnico/${r.id}`)}
              >
                <div className={'assignment-priority ' + r.prioridad} />
                <div className="assignment-info">
                  <div className="assignment-device">
                    {r.dispositivo}
                    <span className="mono small muted" style={{ fontWeight: 400, marginLeft: 6 }}>{r.codigo}</span>
                  </div>
                  <div className="assignment-meta">
                    {r.cliente} • Costo: ${r.costo.toLocaleString('es-EC')}
                  </div>
                </div>
                <span className={`pill pill-${r.estado}`}>{ESTADO_LABELS[r.estado]}</span>
                <Icon name="chevronRight" size={16} className="assignment-arrow" />
              </div>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  )
}
