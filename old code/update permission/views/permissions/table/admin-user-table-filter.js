// AdminSimpleUserTableFilters
// Component Imports
import { Label } from '@/src/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { DEFAULT_ROLE_PERMISSIONS } from '@/src/configs/role-permConfig'

const ROLES = [...Object.keys(DEFAULT_ROLE_PERMISSIONS)]

const ROLE_ITEMS = [{ label: 'All', value: 'all' }, ...ROLES.map(role => ({ label: role, value: role }))]

export default function AdminSimpleUserTableFilters({ filters, onFilterChange }) {
  return (
    <div className='flex flex-col gap-4 border-b p-6'>
      <div className='grid grid-cols-1 gap-6 max-md:*:last:col-span-full sm:grid-cols-2 md:grid-cols-3'>
        <div className='flex w-full flex-col gap-2'>
          <Label htmlFor='filter-role'>Select Role</Label>
          <Select
            items={ROLE_ITEMS}
            value={filters.role}
            onValueChange={(value) => {
              if (value) {
                onFilterChange({ role: value })
              }
            }}
          >
            <SelectTrigger id='filter-role' className='w-full'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='all'>All</SelectItem>
                {ROLES.map(role => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
