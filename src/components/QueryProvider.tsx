// // app/providers.tsx
// 'use client';

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { useState } from 'react';

// export function QueryProvider({ children }) {
//   // Use useState to ensure the client is instantiated exactly once per session
//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             staleTime: 1000 * 60 * 5, // Data stays "fresh" for 5 minutes before re-fetching
//             refetchOnWindowFocus: false, // Prevents aggressive reloading on tab focus
//           },
//         },
//       })
//   );

//   return (
//     <QueryClientProvider client={queryClient}>
//       {children}
//     </QueryClientProvider>
//   );
// }

'use client'

import { useState } from 'react'
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query'

function isConnectivityError(error: unknown) {
  const err = error as any

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

function notifyConnectionFailure(error: unknown) {
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
