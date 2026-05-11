import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './routes/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import RecuperarPassword from './pages/RecuperarPassword'
import PaginaPublica    from './pages/PaginaPublica'
import Configuracion    from './pages/admin/Configuracion'
import Dashboard         from './pages/admin/Dashboard'
import Reparaciones      from './pages/admin/Reparaciones'
import DetalleReparacion from './pages/admin/DetalleReparacion'
import NuevaReparacion   from './pages/admin/NuevaReparacion'
import Inventario        from './pages/admin/Inventario'
import NuevoRepuesto     from './pages/admin/NuevoRepuesto'
import Facturacion       from './pages/admin/Facturacion'
import Reportes          from './pages/admin/Reportes'
import DetalleFactura    from './pages/admin/DetalleFactura'
import NuevaFactura      from './pages/admin/NuevaFactura'
import Clientes            from './pages/admin/Clientes'
import DetalleCliente      from './pages/admin/DetalleCliente'
import MisReparaciones          from './pages/tecnico/MisReparaciones'
import DetalleTecnico           from './pages/tecnico/DetalleTecnico'
import HistorialTecnico         from './pages/tecnico/HistorialTecnico'
import MisReparacionesCliente   from './pages/cliente/MisReparacionesCliente'
import DetalleReparacionCliente from './pages/cliente/DetalleReparacionCliente'
import NoAutorizado  from './pages/NoAutorizado'
import NuevoCliente  from './pages/admin/NuevoCliente'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Publicas */}
        <Route path="/"                   element={<PaginaPublica />} />
        <Route path="/login"              element={<Login />} />
        <Route path="/register"           element={<Register />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />

        {/* Admin */}
        <Route path="/admin" element={<PrivateRoute roles={['administrador']}><Dashboard /></PrivateRoute>} />
        <Route path="/admin/reparaciones" element={<PrivateRoute roles={['administrador']}><Reparaciones /></PrivateRoute>} />
        <Route path="/admin/reparaciones/nueva" element={<PrivateRoute roles={['administrador']}><NuevaReparacion /></PrivateRoute>} />
        <Route path="/admin/reparaciones/:id" element={<PrivateRoute roles={['administrador']}><DetalleReparacion /></PrivateRoute>} />
        <Route path="/admin/inventario" element={<PrivateRoute roles={['administrador']}><Inventario /></PrivateRoute>} />
        <Route path="/admin/inventario/nuevo" element={<PrivateRoute roles={['administrador']}><NuevoRepuesto /></PrivateRoute>} />
        <Route path="/admin/inventario/:id/editar" element={<PrivateRoute roles={['administrador']}><NuevoRepuesto /></PrivateRoute>} />
        <Route path="/admin/facturacion" element={<PrivateRoute roles={['administrador']}><Facturacion /></PrivateRoute>} />
        <Route path="/admin/facturacion/nueva" element={<PrivateRoute roles={['administrador']}><NuevaFactura /></PrivateRoute>} />
        <Route path="/admin/facturacion/:id" element={<PrivateRoute roles={['administrador']}><DetalleFactura /></PrivateRoute>} />
        <Route path="/admin/reportes" element={<PrivateRoute roles={['administrador']}><Reportes /></PrivateRoute>} />
        <Route path="/admin/clientes" element={<PrivateRoute roles={['administrador']}><Clientes /></PrivateRoute>} />
        <Route path="/admin/clientes/nuevo" element={<PrivateRoute roles={['administrador']}><NuevoCliente /></PrivateRoute>} />
        <Route path="/admin/clientes/:id" element={<PrivateRoute roles={['administrador']}><DetalleCliente /></PrivateRoute>} />
        <Route path="/admin/configuracion" element={<PrivateRoute roles={['administrador']}><Configuracion /></PrivateRoute>} />

        {/* Tecnico */}
        <Route path="/tecnico" element={<PrivateRoute roles={['tecnico']}><MisReparaciones /></PrivateRoute>} />
        <Route path="/tecnico/historial" element={<PrivateRoute roles={['tecnico']}><HistorialTecnico /></PrivateRoute>} />
        <Route path="/tecnico/:id" element={<PrivateRoute roles={['tecnico']}><DetalleTecnico /></PrivateRoute>} />

        {/* Sin autorización */}
        <Route path="/no-autorizado" element={<NoAutorizado />} />

        {/* Cliente registrado */}
        <Route path="/cliente" element={<PrivateRoute roles={['cliente']}><MisReparacionesCliente /></PrivateRoute>} />
        <Route path="/cliente/:id" element={<PrivateRoute roles={['cliente']}><DetalleReparacionCliente /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
