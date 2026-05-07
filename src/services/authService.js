import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const login = (datos) => api.post('/auth/login', datos)
export const register = (datos) => api.post('/auth/register', datos)
export const recuperarPassword = (email) => api.post('/auth/recuperar-password', { email })

export default api
