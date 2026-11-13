'use client'

import { useEffect, useRef } from 'react'
import GlobalDisconnectView from '@/components/shared/GlobalDisconnectView'

export default function ConnectionError() {
  const timerRef = useRef(null)
  const checkingRef = useRef(false)

  const checkConnection = async () => {
    if (checkingRef.current) return

    checkingRef.current = true

    try {
      const response = await fetch('/api/health', {
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
      })

      if (!response.ok) {
        throw new Error('Database unavailable')
      }

      // Database is back. Return to the original page.
      const params = new URLSearchParams(window.location.search)
      const returnTo = params.get('returnTo')

      // Prevent external redirects.
      const destination =
        returnTo?.startsWith('/') && !returnTo.startsWith('//')
          ? returnTo
          : '/dashboard'

      window.location.replace(destination)

    } catch (error) {
      console.log('[Connection Recovery] Still offline:', error.message)
    } finally {
      checkingRef.current = false
    }
  }

  useEffect(() => {
    checkConnection()

    timerRef.current = setInterval(checkConnection, 5000)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [])

  return (
    <GlobalDisconnectView onRetry={checkConnection} />
  )
}