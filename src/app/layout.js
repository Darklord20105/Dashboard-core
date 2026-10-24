// React Imports
import { Suspense } from 'react'

// Next Imports
import { Geist, Geist_Mono } from 'next/font/google'

// Third-party Imports
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import mongoose from "mongoose";

// Component Imports
import Providers from '@/src/components/Providers'
import { TooltipProvider } from '@/src/components/ui/tooltip'

// Util Imports
import { cn } from '@/src/lib/utils'

// Style Imports
import './globals.css'
import ScrollToTop from '@/src/components/layout/ScrollToTop'
import { DatabaseConnectivityProvider } from '../components/ErrorProvider';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin']
})

export const metadata = {
  title: 'AdminCN - Free Shadcn Admin Dashboard Template',
  description:
    'Build modern admin dashboards faster with AdminCN Free. A free shadcn admin dashboard template built with Tailwind CSS, featuring responsive layouts and essential pages.',
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}`),
  openGraph: {
    title: 'AdminCN - Free Shadcn Admin Dashboard Template',
    description:
      'Build modern admin dashboards faster with AdminCN Free. A free shadcn admin dashboard template built with Tailwind CSS, featuring responsive layouts and essential pages.',
    type: 'website',
    siteName: 'AdminCN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    images: [
      {
        url: '/images/og-image.png',
        type: 'image/png',
        width: 1200,
        height: 630,
        alt: 'AdminCN - Free Shadcn Admin Dashboard Template'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AdminCN - Free Shadcn Admin Dashboard Template',
    description:
      'Build modern admin dashboards faster with AdminCN Free. A free shadcn admin dashboard template built with Tailwind CSS, featuring responsive layouts and essential pages.'
  }
}

const RootLayout = ({ children }) => {
  // Check the raw Mongoose socket connectivity status on the backend server
  let serverDbCheck = true;

  if (!mongoose.connection || mongoose.connection.readyState === 0) {
    serverDbCheck = false;
  }

  return (
    <html
      lang='en'
      className={cn(geistSans.variable, geistMono.variable, 'flex min-h-full w-full antialiased')}
      data-scroll-behavior='smooth'
      suppressHydrationWarning
    >
      <head />
      <body className="flex min-h-full w-full flex-auto flex-col">
        <NuqsAdapter>
          <DatabaseConnectivityProvider initialDbStatus={serverDbCheck}>
            <Providers sidebarDefaultOpen={true}>
              <TooltipProvider>
                {children}
              </TooltipProvider>
            </Providers>
          </DatabaseConnectivityProvider>
        </NuqsAdapter>

        <ScrollToTop />

      </body>
    </html>
  )
}

export default RootLayout
