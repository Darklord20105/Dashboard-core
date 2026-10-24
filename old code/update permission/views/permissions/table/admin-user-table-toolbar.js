// Next imports
import Link from 'next/link'

// Third-party Imports
import { PlusIcon, SearchIcon } from 'lucide-react'

// Component Imports
import { buttonVariants } from '@/src/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/src/components/ui/input-group'
import { Label } from '@/src/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100]

const ROWS_PER_PAGE_ITEMS = ROWS_PER_PAGE_OPTIONS.map(option => ({
  label: String(option),
  value: String(option)
}))

export default function AdminSimpleUserTableToolbar({ search, rowsPerPage, onSearch, onRowsPerPageChange }) {
  Link
  return (
    <div className='flex gap-4 p-6 max-sm:flex-col sm:items-center sm:justify-between'>
      <div className='w-full max-w-2xs'>
        <Label htmlFor='search-user' className='sr-only'>
          Search User
        </Label>
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            id='search-user'
            value={search}
            onChange={event => onSearch(event.target.value)}
            placeholder='Search user'
            type='text'
          />
        </InputGroup>
      </div>

      <div className='flex flex-wrap items-center gap-2 sm:justify-between'>
        <div className='flex items-center gap-2'>
          <Label htmlFor='rows-per-page' className='sr-only'>
            Show
          </Label>
          <Select
            items={ROWS_PER_PAGE_ITEMS}
            value={String(rowsPerPage)}
            onValueChange={(value) => {
              if (value) {
                onRowsPerPageChange(Number(value))
              }
            }}
          >
            <SelectTrigger id='rows-per-page' className='w-fit whitespace-nowrap'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {ROWS_PER_PAGE_OPTIONS.map(option => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* <Button onClick={k}>
          <PlusIcon />
          <span className='max-lg:hidden'>Add New User</span>
        </Button> */}
        <Link
          href="/admin/create-new-users"
          className={buttonVariants({ variant: "outline", size: "default" })}>
          <PlusIcon />
          <span className='max-lg:hidden'>Add New User</span>
        </Link>
      </div>
    </div>
  )
}
