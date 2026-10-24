// Next Imports
import Link from 'next/link'

// Third-party Imports
import { LogOutIcon, SettingsIcon, UserIcon, UserKey } from 'lucide-react'

// Component Imports
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Button } from '@/src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/src/components/ui/dropdown-menu'
import { signOut, useSession } from '@/src/lib/auth-client'
import { getInitialsFromName } from '@/src/configs/mailConfig'

const STATIC_USER = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  imageUrl: '/images/avatars/avatar-1.webp',
  initials: 'JD'
}

const ProfileDropdown = () => {
  const { data: session, isPending } = useSession()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant='ghost' size='icon' className='relative rounded-full hover:bg-transparent' />}
      >
        <Avatar>
          {/* <AvatarImage src={STATIC_USER.imageUrl} alt={STATIC_USER.fullName} /> */}
          <AvatarFallback>{!isPending ? getInitialsFromName(session?.user?.name):""}</AvatarFallback>
        </Avatar>
        <span className='ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2' />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-60'>
        <DropdownMenuGroup>
          <DropdownMenuLabel className='flex items-center gap-4 px-2 py-2.5 font-normal'>
            <div className='relative'>
              <Avatar className='size-10'>
                {/* <AvatarImage src={STATIC_USER.imageUrl} alt={STATIC_USER.fullName} /> */}
                <AvatarFallback>{!isPending ? getInitialsFromName(session?.user?.name):""}</AvatarFallback>
              </Avatar>
              <span className='ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2' />
            </div>
            <div className='flex flex-1 flex-col items-start'>
              <span className='text-foreground text-base font-semibold'>{session?.user?.name}</span>
              <span className='text-muted-foreground text-sm'>{session?.user?.email}</span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
        <DropdownMenuItem render={<span></span>}>
            <UserKey />
            <span>{session?.user?.role}</span>
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href='/pages/user-profile?view=profile' />}>
            <UserIcon />
            <span>My Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href='/pages/user-settings?setting=general' />}>
            <SettingsIcon />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem variant='destructive' render={
            <span onClick={
              async () => await signOut({
                fetchOptions: {
                  onSuccess: () => {
                    // Completely reloads the application context onto the login route
                    window.location.href = "/pages/auth/login"; 
                  },
                },
              })}></span>
          }>
            <LogOutIcon />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown
