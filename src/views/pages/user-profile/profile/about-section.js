// Third-party Imports
import {
  CheckCheckIcon,
  CheckIcon,
  FlagIcon,
  LanguagesIcon,
  LayoutGridIcon,
  MailIcon,
  MessagesSquareIcon,
  PhoneIcon,
  StarIcon,
  UserIcon
} from 'lucide-react'

// Components Imports
import { Card, CardContent } from '@/src/components/ui/card'

const profileIconMap = {
  UserIcon,
  CheckCheckIcon,
  StarIcon,
  FlagIcon,
  LanguagesIcon,
  PhoneIcon,
  MessagesSquareIcon,
  MailIcon
}

const overviewIconMap = {
  CheckIcon,
  UserIcon,
  LayoutGridIcon
}

const profileSectionsData = [
  {
      "title": "About",
      "items": [
          {
              "iconKey": "UserIcon",
              "label": "Full Name",
              "value": "John Doe"
          },
          {
              "iconKey": "CheckCheckIcon",
              "label": "Status",
              "value": "Active"
          },
          {
              "iconKey": "StarIcon",
              "label": "Role",
              "value": "Developer"
          },
          {
              "iconKey": "FlagIcon",
              "label": "Country",
              "value": "USA"
          },
          {
              "iconKey": "LanguagesIcon",
              "label": "Languages",
              "value": "English"
          }
      ]
  },
  {
      "title": "Contacts",
      "items": [
          {
              "iconKey": "PhoneIcon",
              "label": "Contact",
              "value": "(123) 456-7890"
          },
          {
              "iconKey": "MessagesSquareIcon",
              "label": "Skype",
              "value": "John.doe"
          },
          {
              "iconKey": "MailIcon",
              "label": "Email",
              "value": "john.doe@example.com"
          }
      ]
  },
  {
      "title": "Teams",
      "items": [
          {
              "label": "Backend Developer",
              "value": "(126 Members)"
          },
          {
              "label": "React Developer",
              "value": "(34 Members)"
          }
      ]
  }
]

const overviewSectionsData =  [
  {
      "title": "Overview",
      "items": [
          {
              "iconKey": "CheckIcon",
              "label": "Task Compiled",
              "value": "13.5k"
          },
          {
              "iconKey": "UserIcon",
              "label": "Connections",
              "value": "897"
          },
          {
              "iconKey": "LayoutGridIcon",
              "label": "Projects Compiled",
              "value": "146"
          }
      ]
  }
]

const profileSections = profileSectionsData.map(section => ({
  title: section.title,
  items: section.items.map(item => ({
    label: item.label,
    value: item.value,
    icon:
      item.iconKey && item.iconKey in profileIconMap
        ? profileIconMap[item.iconKey]
        : undefined
  }))
}))

const overviewSections = overviewSectionsData.map(section => ({
  title: section.title,
  items: section.items.map(item => ({
    label: item.label,
    value: item.value,
    icon:
      item.iconKey && item.iconKey in overviewIconMap
        ? overviewIconMap[item.iconKey]
        : undefined
  }))
}))

function AboutSection() {
  return (
    <div className='space-y-6'>
      <Card>
        <CardContent className='space-y-5'>
          {profileSections.map(section => (
            <div className='space-y-2' key={section.title}>
              <p className='text-muted-foreground text-xs font-medium uppercase'>{section.title}</p>
              <ul className='space-y-3'>
                {section.items.map(item => {
                  const Icon = item.icon

                  return (
                    <li className='flex items-center gap-2' key={item.label}>
                      {Icon ? <Icon className='size-4' /> : null}
                      <span className='text-sm font-medium'>{item.label}:</span>
                      <span className='text-sm'>{item.value}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardContent className='space-y-5'>
          {overviewSections.map(section => (
            <div className='space-y-2' key={section.title}>
              <p className='text-muted-foreground text-xs font-medium uppercase'>{section.title}</p>
              <ul className='space-y-3'>
                {section.items.map(item => {
                  const Icon = item.icon

                  return (
                    <li className='flex items-center gap-2' key={item.label}>
                      {Icon ? <Icon className='size-4' /> : null}
                      <span className='text-sm font-medium'>{item.label}:</span>
                      <span className='text-sm'>{item.value}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default AboutSection
