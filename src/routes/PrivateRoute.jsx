import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children, roles = [] }) {
  const { usuario, cargando } = useAuth()

  if (cargando) return null

  if (!usuario) return <Navigate to="/login" replace />

  if (roles.length > 0 && !roles.includes(usuario.rol)) {
    return <Navigate to="/no-autorizado" replace />
  }

  return children
}
