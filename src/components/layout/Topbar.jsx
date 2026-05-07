import { useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'

export default function Topbar({ title, subtitle, onNuevaReparacion }) {
  const navigate = useNavigate()

  return (
    <header className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        {subtitle && <div className="muted small">{subtitle}</div>}
      </div>

      <div className="topbar-search">
        <Icon name="search" size={15} />
        <input placeholder="Buscar reparaciones, clientes, repuestos..." />
      </div>

      <div className="topbar-actions">
        <button className="icon-btn">
          <Icon name="bell" size={16} />
          <span className="dot" />
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => onNuevaReparacion ? onNuevaReparacion() : navigate('/admin/reparaciones/nueva')}
        >
          <Icon name="plus" size={14} />
          Nueva reparación
        </button>
      </div>
    </header>
  )
}
