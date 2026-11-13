'use client'

import { useState } from 'react'
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query'

function isConnectivityError(error) {
  const err = error 

  const status = Number(
    err?.response?.status ??
    err?.status ??
    err?.statusCode
  )

  if (status >= 500 && status <= 599) return true

  if (
    err?.isAxiosError &&
    !err?.response
  ) {
    return true
  }

  if (
    err?.code === 'ERR_NETWORK' ||
    err?.code === 'ECONNABORTED' ||
    err instanceof TypeError
  ) {
    return true
  }

  return false
}

function notifyConnectionFailure(error) {
  if (
    isConnectivityError(error) &&
    typeof window !== 'undefined'
  ) {
    window.dispatchEvent(
      new Event('app:connection-error')
    )
  }
}

export function QueryProvider({ children }) {
  const [queryClient] = useState(() => {
    return new QueryClient({
      queryCache: new QueryCache({
        onError: error => {
          notifyConnectionFailure(error)
        },
      }),

      mutationCache: new MutationCache({
        onError: error => {
          notifyConnectionFailure(error)
        },
      }),

      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          refetchOnWindowFocus: false,
          retry: 1,
        },

        mutations: {
          retry: 0,
        },
      },
    })
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
