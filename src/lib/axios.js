
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Detect infrastructure/connectivity failures globally.
api.interceptors.response.use(
  response => response,
  error => {
    // Ignore intentionally cancelled requests.
    if (error.code === 'ERR_CANCELED') {
      return Promise.reject(error)
    }

    const status = error.response?.status

    const isConnectivityFailure =
      !error.response ||
      [502, 503, 504].includes(status) ||
      error.code === 'ECONNABORTED'

    if (
      isConnectivityFailure &&
      typeof window !== 'undefined'
    ) {
      window.dispatchEvent(
        new Event('app:connection-error')
      )
    }

    return Promise.reject(error)
  }
)

export default api
