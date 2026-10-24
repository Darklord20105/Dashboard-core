'use client'
// for Editing a user in its view mode should be expanded more 

// React Imports
import { useEffect } from 'react'

// Third-party Imports
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

// Component Imports
import { Button } from '@/src/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/src/components/ui/field'
import { Input } from '@/src/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/src/components/ui/sheet'

const ROLES = ['owner', 'maintainer', 'client']
// const PLANS = ['Free','Basic', 'Team', 'Enterprise']
const STATUSES = ['active', 'pending', 'suspended', 'inactive']

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'India',
  'Japan',
  'Brazil',
  'Netherlands',
  'Singapore',
  'Spain',
  'Italy',
  'Mexico',
  'South Korea'
]

const userFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  // email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  // contact: z.string().optional(),
  // company: z.string().optional(),
  // country: z.string().optional(),
  role: z.enum(['admin', 'owner', 'maintainer', 'client']),
  // plan: z.enum(['Basic', 'Team', 'Enterprise']),
  status: z.enum(['active', 'pending', 'suspended', 'inactive'])
})


const defaultValues = {
  name: '',
  email: '',
  // contact: '',
  // company: '',
  // country: '',
  role: 'Subscriber',
  // plan: 'Basic',
  status: 'Active'
}

export function AddEditUserSheet({ mode, user, onClose, onAdd, onEdit, formStateFunction }) {
  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues
  })

  useEffect(() => {
    if (mode === 'edit' && user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.banned ? "inactive":"active"
        // contact: user.contact ?? '',
        // company: user.company ?? '',
        // country: user.country ?? '',
        // plan: user.plan,
      })

      return
    }

    if (mode === 'add') {
      form.reset(defaultValues)
    }
  }, [form, mode, user])

  const handleSubmit = (values) => {
    const data = {
      name: values.name,
      role: values.role,
      status: values.status
      // email: values.email,
      // contact: values.contact || "",
      // company: values.company || "",
      // country: values.country || "",
      // plan: values.plan,
    }

    if (mode === 'add') {
      onAdd(data)
    }

    if (mode === 'edit' && user) {
      onEdit(user.id, data)
      formStateFunction(false)
    }
  }

  const isAdmin = user?.role === 'admin';

  return (
    <Sheet open={mode !== null} onOpenChange={open => !open && onClose()}>
      <SheetContent side='right' className='w-full overflow-y-auto sm:max-w-[420px]'>
        <SheetHeader className='pb-0'>
          <SheetTitle className='text-lg font-medium'>{mode === 'edit' ? 'Edit User' : 'Add New User'}</SheetTitle>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col gap-4 px-4 pb-4'>
          <FieldGroup className='gap-4'>
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='gap-2'>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input disabled={isAdmin} {...field} id={field.name} placeholder='Full name' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />

            <Controller
              name='email'
              control={form.control}
              disabled={true}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='gap-2'>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type='email'
                    placeholder='name@example.com'
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />

            {/* <Controller
              name='contact'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='gap-2'>
                  <FieldLabel htmlFor={field.name}>Contact</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type='tel'
                    placeholder='+1 (555) 000-0000'
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            /> */}

            {/* <Controller
              name='company'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='gap-2'>
                  <FieldLabel htmlFor={field.name}>Company</FieldLabel>
                  <Input {...field} id={field.name} placeholder='Company name' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            /> */}

            {/* <Controller
              name='country'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='gap-2'>
                  <FieldLabel htmlFor='country'>Country</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id='country' className='w-full'>
                      <SelectValue placeholder='Select country' />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      <SelectGroup>
                        {COUNTRIES.map(country => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            /> */}

            <Controller
              name='role'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='gap-2'>
                  <FieldLabel htmlFor='role'>Role</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger disabled={isAdmin} id='role' className='w-full'>
                      <SelectValue placeholder='Select role' />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      <SelectGroup>
                        {ROLES.map(role => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
{/* 
            <Controller
              name='plan'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='gap-2'>
                  <FieldLabel htmlFor='plan'>Plan</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id='plan' className='w-full'>
                      <SelectValue placeholder='Select plan' />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      <SelectGroup>
                        {PLANS.map(plan => (
                          <SelectItem key={plan} value={plan}>
                            {plan}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            /> */}

            <Controller
              name='status'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='gap-2'>
                  <FieldLabel htmlFor='status'>Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger disabled={isAdmin} id='status' className='w-full'>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      <SelectGroup>
                        {STATUSES.map(status => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
          </FieldGroup>

          <SheetFooter className='px-0 sm:flex-row'>
            <Button type='submit' variant='outline' onClick={onClose} className='sm:flex-1'>
              Cancel
            </Button>
            <Button type='submit' className='sm:flex-1'>
              Save Changes
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
