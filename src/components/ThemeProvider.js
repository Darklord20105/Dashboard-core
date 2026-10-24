'use client'

// Third-party Imports
import { ThemeProvider as NextThemesProvider } from '@teispace/next-themes'

export const ThemeProvider = ({ children, ...props }) => {
  const scriptProps = typeof window === 'undefined' ? undefined : { type: 'application/json' }

  return <NextThemesProvider
    attribute='class'
    defaultTheme='system'
    enableSystem
    scriptProps={scriptProps}
    {...props}
  >{children}
  </NextThemesProvider>
}
