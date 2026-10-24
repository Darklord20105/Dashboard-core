// Third-party Imports
import { EllipsisVerticalIcon, MailIcon, UserPlus2Icon, UserRoundCheckIcon } from 'lucide-react'

// Component Imports
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Badge } from '@/src/components/ui/badge'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent } from '@/src/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/src/components/ui/dropdown-menu'
import { Separator } from '@/src/components/ui/separator'

const db = { connectionCardActions: [], connectionCards: [] }
const  connectionCardActions = [
  "Share Connection",
  "Block Connection",
  "Delete"
]

const connectionCards = [
  {
      "id": 1,
      "name": "Mark Gilbert",
      "role": "UI Designer",
      "initials": "MG",
      "avatar": "/images/avatars/avatar-1.webp",
      "tags": [
          {
              "label": "Figma"
          },
          {
              "label": "Sketch"
          }
      ],
      "stats": {
          "projects": "18",
          "tasks": "834",
          "connections": "129"
      },
      "totalConnections": "129 Connections",
      "isConnected": true
  },
  {
      "id": 2,
      "name": "Eugenia Parsons",
      "role": "Developer",
      "initials": "EP",
      "avatar": "/images/avatars/avatar-2.webp",
      "tags": [
          {
              "label": "Angular"
          },
          {
              "label": "React"
          }
      ],
      "stats": {
          "projects": "112",
          "tasks": "2.31k",
          "connections": "1.28k"
      },
      "totalConnections": "1.28k Connections",
      "isConnected": false
  },
  {
      "id": 3,
      "name": "Francis Byrd",
      "role": "Developer",
      "initials": "FB",
      "avatar": "/images/avatars/avatar-3.webp",
      "tags": [
          {
              "label": "HTML"
          },
          {
              "label": "React"
          }
      ],
      "stats": {
          "projects": "32",
          "tasks": "1.25k",
          "connections": "890"
      },
      "totalConnections": "890 Connections",
      "isConnected": false
  },
  {
      "id": 4,
      "name": "Leon Lucas",
      "role": "UI/UX Designer",
      "initials": "LL",
      "avatar": "/images/avatars/avatar-4.webp",
      "tags": [
          {
              "label": "Figma"
          },
          {
              "label": "Sketch"
          },
          {
              "label": "Photoshop"
          }
      ],
      "stats": {
          "projects": "86",
          "tasks": "12.4k",
          "connections": "890"
      },
      "totalConnections": "890 Connections",
      "isConnected": false
  },
  {
      "id": 5,
      "name": "Jayden Rogers",
      "role": "Full Stack Developer",
      "initials": "JR",
      "avatar": "/images/avatars/avatar-5.webp",
      "tags": [
          {
              "label": "React"
          },
          {
              "label": "HTML"
          },
          {
              "label": "Node.js"
          }
      ],
      "stats": {
          "projects": "244",
          "tasks": "23.8k",
          "connections": "2.14k"
      },
      "totalConnections": "2.14k Connections",
      "isConnected": true
  },
  {
      "id": 6,
      "name": "Jeanette Powell",
      "role": "SEO",
      "initials": "JP",
      "avatar": "/images/avatars/avatar-6.webp",
      "tags": [
          {
              "label": "Analysis"
          },
          {
              "label": "Writing"
          }
      ],
      "stats": {
          "projects": "32",
          "tasks": "1.28k",
          "connections": "1.27k"
      },
      "totalConnections": "1.27k Connections",
      "isConnected": false
  }
]

function ConnectionsCard() {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {connectionCards.map(connection => (
        <Card
          key={connection.id}
          className='relative flex flex-col items-center justify-center transition-all hover:-translate-y-0.5 hover:shadow-md'
        >
          <div className='absolute top-4 right-4 z-10'>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant='ghost' size='icon' className='text-muted-foreground size-8 rounded-full' />}
              >
                <EllipsisVerticalIcon className='size-4' />
                <span className='sr-only'>Open {connection.name} actions</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-44'>
                <DropdownMenuGroup>
                  {connectionCardActions.map(action => (
                    <DropdownMenuItem key={action} variant={action === 'Delete' ? 'destructive' : 'default'}>
                      {action}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CardContent>
            <Avatar className='size-25'>
              {connection.avatar ? <AvatarImage src={connection.avatar} alt={connection.name} /> : null}
              <AvatarFallback>{connection.initials}</AvatarFallback>
            </Avatar>
          </CardContent>

          <CardContent className='text-center'>
            <h3 className='text-xl font-medium'>{connection.name}</h3>
            <p className='text-muted-foreground text-base'>{connection.role}</p>
          </CardContent>

          <CardContent className='flex flex-wrap items-center justify-center gap-2'>
            {connection.tags.map(tag => (
              <Badge key={`${connection.id}-${tag.label}`} variant='outline' className='h-6 px-3 py-1'>
                {tag.label}
              </Badge>
            ))}
          </CardContent>

          <CardContent className='flex w-full items-center justify-evenly gap-4'>
            <div className='text-center'>
              <p className='text-lg font-medium'>{connection.stats.projects}</p>
              <p className='text-muted-foreground text-base'>Projects</p>
            </div>
            <Separator orientation='vertical' />
            <div className='text-center'>
              <p className='text-lg font-medium'>{connection.stats.tasks}</p>
              <p className='text-muted-foreground text-base'>Tasks</p>
            </div>
            <Separator orientation='vertical' />
            <div className='text-center'>
              <p className='text-lg font-medium'>{connection.stats.connections}</p>
              <p className='text-muted-foreground text-base'>Connections</p>
            </div>
          </CardContent>

          <CardContent className='flex items-center gap-4'>
            <Button variant={connection.isConnected ? 'default' : 'outline'}>
              {connection.isConnected ? <UserRoundCheckIcon /> : <UserPlus2Icon />}
              {connection.isConnected ? 'Connected' : 'Connect'}
            </Button>
            <Button variant='outline' size='icon'>
              <MailIcon />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default ConnectionsCard
