import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './routes/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import RecuperarPassword from './pages/RecuperarPassword'
import Dashboard         from './pages/admin/Dashboard'
import Reparaciones      from './pages/admin/Reparaciones'
import DetalleReparacion from './pages/admin/DetalleReparacion'
import NuevaReparacion   from './pages/admin/NuevaReparacion'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Publicas */}
        <Route path="/"                   element={<Navigate to="/login" replace />} />
        <Route path="/login"              element={<Login />} />
        <Route path="/register"           element={<Register />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />

        {/* Admin — sin auth hasta tener backend */}
        <Route path="/admin"                              element={<Dashboard />} />
        <Route path="/admin/reparaciones"                 element={<Reparaciones />} />
        <Route path="/admin/reparaciones/nueva"           element={<NuevaReparacion />} />
        <Route path="/admin/reparaciones/:id"             element={<DetalleReparacion />} />
      </Routes>
    </BrowserRouter>
  )
}
