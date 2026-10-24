// Component Imports
import { Separator } from '@/src/components/ui/separator'

// Component Imports
import ConnectAccount from '@/src/views/pages/user-settings/general/connect-account'
import DangerZone from '@/src/views/pages/user-settings/general/danger-zone'
import EmailPass from '@/src/views/pages/user-settings/general/email-password'
import PersonalInfo from '@/src/views/pages/user-settings/general/personal-info'
import SocialUrl from '@/src/views/pages/user-settings/general/social-url'

const UserGeneral = () => {
  return (
    <section className='py-3'>
      <PersonalInfo />
      <Separator className='my-10' />
      <EmailPass />
      <Separator className='my-10' />
      <ConnectAccount />
      <Separator className='my-10' />
      <SocialUrl />
      <Separator className='my-10' />
      <DangerZone />
    </section>
  )
}

export default UserGeneral
