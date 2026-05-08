import api from './authService'

export const getUsuarios = () => api.get('/usuarios')
