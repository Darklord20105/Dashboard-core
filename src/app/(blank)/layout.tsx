// React Imports
import type { ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner'

// Component Imports
import BlankLayout from '@/components/layout/BlankLayout'

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <BlankLayout>
      {children}
      <Toaster />
    </BlankLayout>
  )
}

export default PublicLayout
