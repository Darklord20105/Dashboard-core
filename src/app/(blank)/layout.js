// Component Imports
import BlankLayout from '@/src/components/layout/BlankLayout'
import { Toaster } from '@/src/components/ui/sonner'

const PublicLayout = ({ children }) => {
  return <BlankLayout>
    {children}
    <Toaster />
  </BlankLayout>
}

export default PublicLayout
