import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './routes/PrivateRoute'

const Login                     = lazy(() => import('./pages/Login'))
const Register                  = lazy(() => import('./pages/Register'))
const RecuperarPassword         = lazy(() => import('./pages/RecuperarPassword'))
const PaginaPublica             = lazy(() => import('./pages/PaginaPublica'))
const NoAutorizado              = lazy(() => import('./pages/NoAutorizado'))
const Dashboard                 = lazy(() => import('./pages/admin/Dashboard'))
const Reparaciones              = lazy(() => import('./pages/admin/Reparaciones'))
const DetalleReparacion         = lazy(() => import('./pages/admin/DetalleReparacion'))
const NuevaReparacion           = lazy(() => import('./pages/admin/NuevaReparacion'))
const Inventario                = lazy(() => import('./pages/admin/Inventario'))
const NuevoRepuesto             = lazy(() => import('./pages/admin/NuevoRepuesto'))
const Facturacion               = lazy(() => import('./pages/admin/Facturacion'))
const Reportes                  = lazy(() => import('./pages/admin/Reportes'))
const DetalleFactura            = lazy(() => import('./pages/admin/DetalleFactura'))
const NuevaFactura              = lazy(() => import('./pages/admin/NuevaFactura'))
const Clientes                  = lazy(() => import('./pages/admin/Clientes'))
const DetalleCliente            = lazy(() => import('./pages/admin/DetalleCliente'))
const NuevoCliente              = lazy(() => import('./pages/admin/NuevoCliente'))
const Configuracion             = lazy(() => import('./pages/admin/Configuracion'))
const MisReparaciones           = lazy(() => import('./pages/tecnico/MisReparaciones'))
const DetalleTecnico            = lazy(() => import('./pages/tecnico/DetalleTecnico'))
const HistorialTecnico          = lazy(() => import('./pages/tecnico/HistorialTecnico'))
const MisReparacionesCliente    = lazy(() => import('./pages/cliente/MisReparacionesCliente'))
const DetalleReparacionCliente  = lazy(() => import('./pages/cliente/DetalleReparacionCliente'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="muted" style={{ padding: 40, textAlign: 'center' }}>Cargando...</div>}>
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
      </Suspense>
    </BrowserRouter>
  )
}
