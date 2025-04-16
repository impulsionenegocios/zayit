import axios from 'axios'
import { getStoredToken } from '@/utils/authToken'

const api = axios.create({
  baseURL: 'http://localhost:8000',
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  console.log('🚀 Interceptor foi executado', token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
