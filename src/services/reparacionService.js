import api from './authService'

export const getReparaciones        = ()                    => api.get('/reparaciones')
export const getReparacion          = (id)                  => api.get(`/reparaciones/${id}`)
export const createReparacion       = (datos)               => api.post('/reparaciones', datos)
export const actualizarEstado       = (id, datos)           => api.put(`/reparaciones/${id}/estado`, datos)
export const getHistorialCliente    = (cliente_id)          => api.get(`/reparaciones/cliente/${cliente_id}`)
export const getSeguimiento         = (codigo)              => api.get(`/reparaciones/seguimiento/${codigo}`)
export const agregarRepuesto        = (id, datos)           => api.post(`/reparaciones/${id}/repuestos`, datos)
export const eliminarRepuesto       = (id, repuesto_id)     => api.delete(`/reparaciones/${id}/repuestos/${repuesto_id}`)
