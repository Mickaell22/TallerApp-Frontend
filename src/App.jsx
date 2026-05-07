import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './routes/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import RecuperarPassword from './pages/RecuperarPassword'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                   element={<Navigate to="/login" replace />} />
        <Route path="/login"              element={<Login />} />
        <Route path="/register"           element={<Register />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
      </Routes>
    </BrowserRouter>
  )
}
