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

      <div className="topbar-actions">
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
