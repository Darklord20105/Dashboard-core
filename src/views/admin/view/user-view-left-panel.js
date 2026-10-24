// Third-party Imports
import {
  CheckSquareIcon,
  LayoutGridIcon,
  UserRoundIcon,
  CrownIcon,
  PencilRulerIcon,
  PencilLineIcon
} from 'lucide-react'

// Component Imports
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import { Separator } from '@/src/components/ui/separator'

// Config Imports
import { getInitialsFromName } from '@/src/configs/mailConfig'

// Util Imports
import { cn } from '@/src/lib/utils'
import TableBanToggleButton from '../list/table-buttons/table-ban-toggle-button'

const STATUS_DOT_STYLES = {
  active: 'bg-green-500',
  pending: 'bg-amber-500',
  suspended: 'bg-destructive',
  inactive: 'bg-destructive'
}

const ROLE_ICONS = {
  admin: <UserRoundIcon className='size-4 text-green-600 dark:text-green-400' />,
  // owner: <BrushIcon className='text-chart-2 size-4' />,
  owner: <CrownIcon className='text-chart-5 size-4' />,
  maintainer: <PencilRulerIcon className='text-chart-3 size-4' />,
  client: <PencilLineIcon className='text-chart-1 size-4' />
}

const formatCompactNumber = (value) => {
  if (value === undefined) {
    return '—'
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}k`
  }

  return String(value)
}



export function UserViewLeftPanel({ user, onEdit }) {
  // console.log(user, 'user view left panel')
  const detailRows = [
    { label: 'Username', value: user.username ?? '—' },
    { label: 'Email', value: user.email },
    { label: 'isVerified', value: user.emailVerified, verifySatus: true },
    { label: 'Status', value: user.banned, isStatus: true },
    { label: 'Role', value: user.role },
    { label: 'Tax ID', value: user.taxId ?? '—' },
    { label: 'Contact', value: user.contact ?? '—' },
    { label: 'Language', value: user.language ?? '—' },
    { label: 'Country', value: user.country ?? '—' }
  ]

  const status = user.banned;
  let statusState = status ? "inactive" : "active"
  return (
    <Card className='overflow-y-auto lg:sticky lg:top-20 lg:h-[calc(100dvh-7.5rem)]'>
      <CardContent className='space-y-6 pt-6'>
        <div className='flex flex-col items-center text-center'>
          <Avatar className='size-24'>
            {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
            <AvatarFallback className='text-2xl'>{getInitialsFromName(user.name)}</AvatarFallback>
          </Avatar>
          <h2 className='mt-4 line-clamp-4 text-xl font-semibold'>{user.name}</h2>
          <Badge variant='secondary' className='mt-2'>
            {ROLE_ICONS[user.role]}<span className='capitalize'>{user.role}</span>
          </Badge>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div className='bg-muted/40 flex flex-col items-center rounded-lg border p-4 text-center'>
            <CheckSquareIcon className='text-primary mb-2 size-5' />
            <span className='text-lg font-semibold'>{formatCompactNumber(user.tasksDone)}</span>
            <span className='text-muted-foreground text-xs'>Task Done</span>
          </div>
          <div className='bg-muted/40 flex flex-col items-center rounded-lg border p-4 text-center'>
            <LayoutGridIcon className='text-primary mb-2 size-5' />
            <span className='text-lg font-semibold'>{formatCompactNumber(user.projectsDone)}</span>
            <span className='text-muted-foreground text-xs'>Project Done</span>
          </div>
        </div>

        <div className='space-y-3'>
          <h3 className='text-sm font-semibold'>Details</h3>
          <Separator />
          {detailRows.map(row => (
            <div key={row.label} className='flex items-center justify-between gap-4 text-sm'>
              <span className='text-muted-foreground'>{row.label}</span>
              {'isStatus' in row && row.isStatus ? (
                <span className='flex items-center gap-2 font-medium'>
                  <span className={cn('size-2 rounded-full', STATUS_DOT_STYLES[statusState])} />
                  {statusState}
                </span>
              ) : ("verifySatus" in row && row.verifySatus ?

                <span className='flex items-center gap-2 font-medium'>
                  <span className={cn('size-2 rounded-full', row.value ? 'bg-green-500' : 'bg-destructive')} />
                  {row.value ? "True" : "False"}
                </span>
                :
                <span className='truncate text-right font-medium'>{row.value}</span>
              )}
            </div>
          ))}
        </div>

        <div className='flex gap-2 max-sm:flex-col'>
          {user.role === "admin" ? <></> : <Button className='sm:flex-1' onClick={onEdit}>Edit</Button>}
          {user.role === "admin" ? <></> : <TableBanToggleButton user={user} isButton={true} />}
        </div>
      </CardContent>
    </Card>
  )
}
