'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from '@/src/lib/auth-client' // Your Better Auth client hook
import GlobalDisconnectView from './shared/GlobalDisconnectView'

// 1. Create a simple context to share the online status if child components want it
const ConnectivityContext = createContext({ isOnline: true })

export function DatabaseConnectivityProvider({ 
  children,
  initialDbStatus // We pass the initial server-side check down as a baseline
}) {
  const [isDbOnline, setIsDbOnline] = useState(initialDbStatus)
  const { isPending, error } = useSession()

  useEffect(() => {
    // 🌟 FRONTEND MONITOR: If Better Auth's useSession throws an error under the hood
    // (like an HTTP 500 session validation error from your DNS block), intercept it!
    if (error) {
      console.log("Client detected a critical auth connection drop:", error)
      setIsDbOnline(false)
    }
  }, [error])

  // 🌟 THE PROTECTION GATE: If the connection is broken on load or drops mid-session,
  // we drop the children completely and lock down the viewport with the disconnect page.
  if (!isDbOnline) {
    return <GlobalDisconnectView />
  }

  return (
    <ConnectivityContext.Provider value={{ isOnline: isDbOnline }}>
      {children}
    </ConnectivityContext.Provider>
  )
}

// Custom hook to use if child forms want to check database status manually
export const useDatabaseStatus = () => useContext(ConnectivityContext)
