// Components Imports
import AboutSection from '@/src/views/pages/user-profile/profile/about-section'
import { ActivityTimeline } from '@/src/views/pages/user-profile/profile/activity-timeline'
import Connections from '@/src/views/pages/user-profile/profile/connections'
import ProfileProjectDatatable from '@/src/views/pages/user-profile/profile/profile-project-datatable'
import Teams from '@/src/views/pages/user-profile/profile/teams'

const activityLog = [
  {
    "id": 1,
    "description": "12 Invoices have been paid",
    "timestamp": "12 min ago",
    "detail": "Invoices have been paid to the company.",
    "attachment": {
      "name": "invoice.pdf",
      "fileType": "pdf"
    }
  },
  {
    "id": 2,
    "description": "Client Meeting",
    "timestamp": "45 min ago",
    "detail": "Project meeting with john @10:15am",
    "person": {
      "name": "Lester McCarthy (Client)",
      "initials": "LM",
      "role": "CEO of ThemeSelection",
      "avatar": "/images/avatars/avatar-3.webp"
    }
  },
  {
    "id": 3,
    "description": "Create a new project for client",
    "timestamp": "2 Day Ago",
    "detail": "6 team members in a project",
    "teamMembers": [
      {
        "name": "Alex Carter",
        "initials": "AC",
        "avatar": "/images/avatars/avatar-1.webp"
      },
      {
        "name": "Mia Stewart",
        "initials": "MS",
        "avatar": "/images/avatars/avatar-2.webp"
      },
      {
        "name": "Noah Wilson",
        "initials": "NW",
        "avatar": "/images/avatars/avatar-4.webp"
      }
    ],
    "teamExtraCount": 3
  }
]

function Profile() {
  return (
    <div className='grid grid-cols-12 gap-6'>
      {/* About Section */}
      <div className='col-span-12 space-y-6 lg:col-span-4'>
        <AboutSection />
      </div>

      {/* Activity Section */}
      <div className='col-span-12 lg:col-span-8'>
        <div className='grid grid-cols-12 gap-6'>
          {/* Activity timeline */}
          <ActivityTimeline activityLog={activityLog} className='col-span-12' />
          {/* Connections */}
          <Connections className='col-span-12 lg:col-span-6' />
          {/* Teams */}
          <Teams className='col-span-12 lg:col-span-6' />
          {/* Projects DataTable */}
          <ProfileProjectDatatable className='col-span-12' />
        </div>
      </div>
    </div>
  )
}

export default Profile
