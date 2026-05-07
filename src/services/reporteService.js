import api from './authService'

export const getReporteReparaciones = (params) => api.get('/reportes/reparaciones', { params })
export const getReporteIngresos     = (params) => api.get('/reportes/ingresos',     { params })
export const getReporteInventario   = (params) => api.get('/reportes/inventario',   { params })
