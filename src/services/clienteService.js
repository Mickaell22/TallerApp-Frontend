import api from './authService'

export const getClientes  = ()        => api.get('/clientes')
export const getCliente   = (id)      => api.get(`/clientes/${id}`)
export const createCliente = (datos)  => api.post('/clientes', datos)
export const updateCliente = (id, datos) => api.put(`/clientes/${id}`, datos)
export const deleteCliente = (id)     => api.delete(`/clientes/${id}`)
