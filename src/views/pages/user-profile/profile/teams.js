// Third-party Imports
import { EllipsisVerticalIcon } from 'lucide-react'

// Component Imports
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Badge } from '@/src/components/ui/badge'
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

const teamActions =  [
  "Share Teams",
  "Suggest Edits",
  "Report Bug"
]

const teams =  [
  {
      "id": 1,
      "teams": "React Developers",
      "initials": "RD",
      "avatar": "/images/avatars/avatar-1.webp",
      "totalMembers": "72 Members",
      "teamBadge": {
          "label": "Developer"
      }
  },
  {
      "id": 2,
      "teams": "Vue Developers",
      "initials": "VD",
      "avatar": "/images/avatars/avatar-2.webp",
      "totalMembers": "58 Members",
      "teamBadge": {
          "label": "Developer"
      }
  },
  {
      "id": 3,
      "teams": "Angular Developers",
      "initials": "AD",
      "avatar": "/images/avatars/avatar-3.webp",
      "totalMembers": "65 Members",
      "teamBadge": {
          "label": "Developer"
      }
  },
  {
      "id": 4,
      "teams": "UI Designers",
      "initials": "UD",
      "avatar": "/images/avatars/avatar-4.webp",
      "totalMembers": "72 Members",
      "teamBadge": {
          "label": "Designer"
      }
  },
  {
      "id": 5,
      "teams": "Digital Marketing",
      "initials": "DM",
      "avatar": "/images/avatars/avatar-2.webp",
      "totalMembers": "58 Members",
      "teamBadge": {
          "label": "Marketing"
      }
  }
]

function Teams({ className }) {
  return (
    <Card className={cn(className)}>
      <CardHeader className='flex items-center justify-between'>
        <span className='text-lg font-medium'>Teams</span>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant='ghost' size='icon' className='text-muted-foreground size-6 rounded-full' />}
          >
            <EllipsisVerticalIcon />
            <span className='sr-only'>Menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-32'>
            <DropdownMenuGroup>
              {teamActions.map((item, index) => (
                <DropdownMenuItem key={index}>{item}</DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col justify-between gap-4'>
        {teams.map(team => (
          <div key={team.id} className='flex items-center justify-between gap-2'>
            <div className='flex items-center justify-between gap-4'>
              <Avatar size='lg'>
                {team.avatar ? <AvatarImage src={team.avatar} alt={team.teams} /> : null}
                <AvatarFallback>{team.initials}</AvatarFallback>
              </Avatar>
              <div className='flex flex-col gap-0.5'>
                <span className='text-base font-medium'>{team.teams}</span>
                <span className='text-muted-foreground text-sm'>{team.totalMembers}</span>
              </div>
            </div>
            <Badge variant='outline' className='h-6 px-2 py-1'>
              {team.teamBadge.label}
            </Badge>
          </div>
        ))}
      </CardContent>
      <CardContent>
        <Button variant='outline' className='w-full'>
          View All Teams
        </Button>
      </CardContent>
    </Card>
  )
}

export default Teams
