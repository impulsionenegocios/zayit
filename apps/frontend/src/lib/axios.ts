import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { getStoredToken, getTokenAsync } from '@/utils/authToken'

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    retryCount?: number;
    _retry?: boolean;
  }
}

const api = axios.create({
  baseURL: 'http://localhost:8000',
})

let isRefreshingToken = false
let failedRequestsQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

const MAX_RETRIES = 3

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

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.retryCount = config.retryCount || 0
  return config
})

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (!config.url?.includes('/auth/')) {
    try {
      const token = await getTokenAsync()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      } else {
        console.warn('No token available for request to:', config.url)
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
    const originalRequest = error.config as InternalAxiosRequestConfig
    
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url?.includes('/auth/me')
    ) {
      if (originalRequest.retryCount && originalRequest.retryCount >= MAX_RETRIES) {
        console.error(`Request to ${originalRequest.url} failed after ${MAX_RETRIES} retries`)
        return Promise.reject(error)
      }
      
      originalRequest._retry = true
      originalRequest.retryCount = (originalRequest.retryCount || 0) + 1
      
      if (!isRefreshingToken) {
        isRefreshingToken = true
        
        try {
          const token = await getTokenAsync()
          
          if (token) {
            processQueue(token)
            
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          } else {
            processQueue(null, new Error('Could not refresh token'))
            return Promise.reject(error)
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
