import api from './authService'

export const getFacturas  = ()       => api.get('/facturas')
export const getFactura   = (id)     => api.get(`/facturas/${id}`)
export const createFactura = (datos) => api.post('/facturas', datos)
export const downloadPDF  = (id)     => api.get(`/facturas/${id}/pdf`, { responseType: 'blob' })
