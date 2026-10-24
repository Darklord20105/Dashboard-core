// Component Imports
import { QueryProvider } from './QueryProvider'
import { ThemeProvider } from './ThemeProvider'
import { SidebarProvider } from './ui/sidebar'
import { TooltipProvider } from './ui/tooltip'

const Providers = ({ children, sidebarDefaultOpen }) => {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <QueryProvider>
          <SidebarProvider defaultOpen={sidebarDefaultOpen}>{children}</SidebarProvider>
        </QueryProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default Providers
