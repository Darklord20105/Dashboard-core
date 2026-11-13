
'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import { onlineManager } from '@tanstack/react-query'

import GlobalDisconnectView from './shared/GlobalDisconnectView'

const ConnectivityContext = createContext({
  isOnline: false,
  isChecking: true,
  retry: () => { },
})

export function DatabaseConnectivityProvider({ children }) {
  const [status, setStatus] = useState('checking')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let active = true
    let timer
    let checkId = 0

    const checkConnection = async () => {
      const currentCheck = ++checkId
      let nextDelay = 15000

      try {
        const response = await fetch('/api/health', {
          cache: 'no-store',
          signal: AbortSignal.timeout(15000),
        })

        if (!response.ok) {
          throw new Error('Application connection unavailable')
        }

        // Ignore outdated health-check responses.
        if (active && currentCheck === checkId) {
          setStatus('online')
        }
      } catch (error) {
        nextDelay = 5000

        console.error('Application connectivity:', error)

        if (active && currentCheck === checkId) {
          setStatus('offline')
        }
      } finally {
        if (active && currentCheck === checkId) {
          timer = setTimeout(checkConnection, nextDelay)
        }
      }
    }

    const handleOnline = () => {
      clearTimeout(timer)
      checkConnection()
    }

    const handleConnectionFailure = () => {
      if (!active) return

      console.error('[Connectivity] app:connection-error event received')

      // Invalidate any health check already in progress.
      checkId++

      clearTimeout(timer)
      setStatus('offline')

      // Check again shortly for automatic recovery.
      timer = setTimeout(checkConnection, 5000)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener(
      'app:connection-error',
      handleConnectionFailure
    )

    checkConnection()

    return () => {
      active = false
      checkId++

      clearTimeout(timer)

      window.removeEventListener('online', handleOnline)
      window.removeEventListener(
        'app:connection-error',
        handleConnectionFailure
      )
    }
  }, [retryCount])

  useEffect(() => {
    onlineManager.setOnline(status === 'online')
  }, [status])

  useEffect(() => {
    console.log('[Connectivity] Current status:', status)
  }, [status])

  const retry = () => {
    setStatus('checking')
    setRetryCount(prev => prev + 1)
  }

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking application connection...
      </div>
    )
  }
  if (status === 'offline') {
    return <GlobalDisconnectView onRetry={retry} />
  }


  return (
    <ConnectivityContext.Provider
      value={{
        isOnline: status === 'online',
        isChecking: status === 'checking',
        retry,
      }}
    >
      {children}
    </ConnectivityContext.Provider>
  )
}

export const useDatabaseStatus = () =>
  useContext(ConnectivityContext)
