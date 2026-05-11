import api from './authService'

export const getRepuestos       = ()           => api.get('/repuestos')
export const getRepuesto        = (id)         => api.get(`/repuestos/${id}`)
export const createRepuesto     = (datos)      => api.post('/repuestos', datos)
export const updateRepuesto     = (id, datos)  => api.put(`/repuestos/${id}`, datos)
export const deleteRepuesto     = (id)         => api.delete(`/repuestos/${id}`)
export const getRepuestosAlertas = ()          => api.get('/repuestos/alertas/stock-minimo')
