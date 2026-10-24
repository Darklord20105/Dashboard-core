'use client'

// React Imports
import { Suspense } from 'react'
import { useEffect, useState } from "react";

// Component Imports
import Footer from '@/src/components/layout/Footer'
import Header from '@/src/components/layout/Header'
import Sidebar from '@/src/components/layout/Sidebar'
import { SidebarInset } from '@/src/components/ui/sidebar'
import { Toaster } from '@/src/components/ui/sonner'

{/* <Suspense>
  <Sidebar />
</Suspense> */}

const PagesLayout = ({ children }) => {
  // to prevent hydration errors because of Sidebar
  const [isMounted, setIsMounted] = useState(false);

  // 🌟 Forces the engine to wait until initial HTML matching completes
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if(!isMounted) {
    return (
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Empty layout mockups that align with base tag layouts */}
        <div className="hidden md:block w-64 bg-sidebar shrink-0" data-slot="sidebar" />
        <div className="flex-1 bg-background" data-slot="sidebar-inset">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-full w-full min-w-0'>
        <Sidebar />

      <SidebarInset className='flex flex-1 flex-col'>
        <Header />
        <main className='mx-auto size-full max-w-360 flex-1 px-4 py-6 sm:px-6'>{children}</main>
        <Toaster />
        <Footer />
      </SidebarInset>
    </div>
  )
}

export default PagesLayout
