import axios from 'axios'
import { getStoredToken, getTokenAsync } from '@/utils/authToken'

const api = axios.create({
  baseURL: 'http://localhost:8000',
})

let isRefreshingToken = false
let failedRequestsQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

const processQueue = (token: string | null, error: any = null) => {
  failedRequestsQueue.forEach(request => {
    if (error) {
      request.reject(error)
    } else if (token) {
      request.resolve(token)
    }
  })
  
  failedRequestsQueue = []
}

api.interceptors.request.use(async (config) => {
  if (!config.url?.includes('/auth/')) {
    try {
      const token = await getTokenAsync()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Error getting token for request:', error)
    }
  } else if (config.url === '/auth/me' && !config.headers.Authorization) {
    const token = getStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url?.includes('/auth/me')
    ) {
      originalRequest._retry = true
      
      if (!isRefreshingToken) {
        isRefreshingToken = true
        
        try {
          const token = await getTokenAsync()
          
          if (token) {
            processQueue(token)
          } else {
            processQueue(null, new Error('Could not refresh token'))
          }
          
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          }
        } catch (refreshError) {
          processQueue(null, refreshError)
          return Promise.reject(refreshError)
        } finally {
          isRefreshingToken = false
        }
      } else {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api(originalRequest))
            },
            reject
          })
        })
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
