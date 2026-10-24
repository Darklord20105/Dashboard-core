'use client'

import { useTheme } from '@teispace/next-themes'
import { toast , Toaster as Sonner, type ToasterProps } from 'sonner'
import { CircleCheckIcon, CheckCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from 'lucide-react'
import { Alert, AlertTitle } from '@/src/components/ui/alert'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      icons={{
        success: <CircleCheckIcon className='size-4' />,
        info: <InfoIcon className='size-4' />,
        warning: <TriangleAlertIcon className='size-4' />,
        error: <OctagonXIcon className='size-4' />,
        loading: <Loader2Icon className='size-4 animate-spin' />
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)'
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast'
        }
      }}
      {...props}
    />
  )
}

function successToast(message){
  toast.custom(() => (
      <Alert className='border-green-600 text-green-600 sm:w-122 dark:border-green-400 dark:text-green-400 *:[svg]:row-span-1'>
        <CheckCheckIcon />
        <AlertTitle>{message}</AlertTitle>
      </Alert>
    ))
}
function errorToast(err){
  toast.custom(() => (
      <Alert className='border-destructive text-destructive sm:w-122 dark:border-destructive dark:text-destructive *:[svg]:row-span-1'>
        <OctagonXIcon />
        <AlertTitle>An Error occured {err}</AlertTitle>
      </Alert>
    ))
}

export { Toaster, successToast, errorToast}
