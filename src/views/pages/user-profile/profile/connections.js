// Third-party Imports
import { EllipsisVerticalIcon, UserIcon, UserRoundCheckIcon } from 'lucide-react'

// Components Imports
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader } from '@/src/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/src/components/ui/dropdown-menu'

// Util Imports
import { cn } from '@/src/lib/utils'

const connectionActions = [
  "Share",
  "Suggest Edits",
  "Report Bug"
]

const connections = [
  {
    "id": 1,
    "name": "Cecilia Payne",
    "initials": "CP",
    "avatar": "/images/avatars/avatar-1.webp",
    "totalConnections": "45 Connections",
    "isConnected": false
  },
  {
    "id": 2,
    "name": "Curtis Fletcher",
    "initials": "CF",
    "avatar": "/images/avatars/avatar-2.webp",
    "totalConnections": "1.32k Connections",
    "isConnected": true
  },
  {
    "id": 3,
    "name": "Alice Stone",
    "initials": "AS",
    "avatar": "/images/avatars/avatar-3.webp",
    "totalConnections": "125 Connections",
    "isConnected": true
  },
  {
    "id": 4,
    "name": "Darrell Barnes",
    "initials": "DB",
    "avatar": "/images/avatars/avatar-4.webp",
    "totalConnections": "456 Connections",
    "isConnected": false
  },
  {
    "id": 5,
    "name": "Eugenia Moore",
    "initials": "EM",
    "avatar": "/images/avatars/avatar-5.webp",
    "totalConnections": "1.2k Connections",
    "isConnected": false
  }
]



function Connections({ className }) {
  return (
    <Card className={cn(className)}>
      <CardHeader className='flex items-center justify-between'>
        <span className='text-lg font-medium'>Connections</span>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant='ghost' size='icon' className='text-muted-foreground size-6 rounded-full' />}
          >
            <EllipsisVerticalIcon />
            <span className='sr-only'>Menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-32'>
            <DropdownMenuGroup>
              {connectionActions.map((item, index) => (
                <DropdownMenuItem key={index}>{item}</DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col justify-between gap-4'>
        {connections.map(connection => (
          <div key={connection.id} className='flex items-center justify-between gap-2'>
            <div className='flex items-center justify-between gap-4'>
              <Avatar size='lg'>
                {connection.avatar ? <AvatarImage src={connection.avatar} alt={connection.name} /> : null}
                <AvatarFallback>{connection.initials}</AvatarFallback>
              </Avatar>
              <div className='flex flex-col gap-0.5'>
                <span className='text-base font-medium'>{connection.name}</span>
                <span className='text-muted-foreground text-sm'>{connection.totalConnections}</span>
              </div>
            </div>
            <Button size='icon' variant={connection.isConnected ? 'default' : 'outline'}>
              {connection.isConnected ? <UserRoundCheckIcon /> : <UserIcon />}
            </Button>
          </div>
        ))}
      </CardContent>
      <CardContent>
        <Button variant='outline' className='w-full'>
          View All Connections
        </Button>
      </CardContent>
    </Card>
  )
}

export default Connections
