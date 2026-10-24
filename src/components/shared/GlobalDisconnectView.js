'use client'

import { RefreshCwIcon, WifiOffIcon } from 'lucide-react'

export default function GlobalDisconnectView() {
  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 p-6 text-center'>
      <div className='flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4 animate-pulse'>
        <WifiOffIcon className='size-10' />
      </div>
      
      <h1 className='text-2xl font-bold text-slate-900 tracking-tight'>
        System Connection Offline
      </h1>
      
      <p className='mt-2 max-w-md text-sm text-slate-500 leading-relaxed'>
        The application is currently unable to authenticate your administrative session because the security registry database is unreachable. This is typically caused by active network geo-blocking or localized DNS drops.
      </p>

      <div className='mt-6'>
        <button
          onClick={() => window.location.reload()}
          className='flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-md shadow hover:bg-primary/90 transition-colors'
          style={{ cursor: "pointer" }}
        >
          <RefreshCwIcon className='size-4 animate-spin' style={{ animationDuration: '3s' }} />
          Re-Authenticate Connection
        </button>
      </div>
    </div>
  )
}
