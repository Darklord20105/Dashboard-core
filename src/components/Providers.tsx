// React Imports
import type { ReactNode } from 'react'

// Component Imports
import { QueryProvider } from './QueryProvider'
import { ThemeProvider } from './ThemeProvider'
import { SidebarProvider } from './ui/sidebar'
import { TooltipProvider } from './ui/tooltip'

type Props = {
  children: ReactNode
  sidebarDefaultOpen?: boolean
}

const Providers = ({ children, sidebarDefaultOpen }: Props) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem={true}>
      <TooltipProvider>
        <QueryProvider>
          <SidebarProvider defaultOpen={sidebarDefaultOpen}>{children}</SidebarProvider>
        </QueryProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default Providers
