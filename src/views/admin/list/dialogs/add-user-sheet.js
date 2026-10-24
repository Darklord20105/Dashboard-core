'use client'
// For adding editing users in admin list users page

// React Imports
import { useEffect, useState, } from 'react'

// Icons imports
import { EyeIcon, EyeOffIcon } from 'lucide-react'

// Third-party Imports
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

// Component Imports
import { Button } from '@/src/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/src/components/ui/field'
import { Input } from '@/src/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/src/components/ui/input-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/src/components/ui/sheet'


const ROLES = ['owner', 'maintainer', 'client']
// const PLANS = ['Free','Basic', 'Team', 'Enterprise']

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
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, 'Email is required').email({ message: 'Please enter a valid email address.' }),
  role: z.enum(["client", "maintainer", "owner"], {
    required_error: "Please select a system role.",
  }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"), // 
}).superRefine(({ password, confirmPassword }, ctx) => {
  // ⚡ This checks if passwords match locally
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "The passwords do not match",
      path: ["confirmPassword"], // 👈 Targets the confirmPassword field specifically
    });
  }
});

const defaultValues = {
  name: '',
  email: '',
  role: 'client',
  password: '',
  confirmPassword: '',
}

export function AddEditUserSheet({ user, mode, onClose, onAdd, onEdit }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
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
        status: user.banned ? "inactive" : "active"
      })

      return
    }
    if (mode === 'add') {
      form.reset(defaultValues)
    }

  }, [form, mode, user])

  const onSubmit = async (values) => {
    const data = {
      name: values.name,
      email: values.email,
      role: values.role,
      password: values.password,
    }
    if (mode === 'add') {
      onAdd(data)
    }

    if (mode === 'edit' && user) {
      onEdit(user.id, data)
    }
  }

  return (
    <Sheet open={mode !== null} onOpenChange={open => !open && onClose()}>
      <SheetContent side='right' className='w-full overflow-y-auto sm:max-w-[420px]'>
        <SheetHeader className='pb-0'>
          <SheetTitle className='text-lg font-medium'>{mode === 'edit' ? 'Edit User' : 'Add New User'}</SheetTitle>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4 px-4 pb-4'>
          <FieldGroup className='gap-4'>
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='gap-2'>
                  <FieldLabel htmlFor={field.name}>Name <span className='text-destructive'>*</span></FieldLabel>
                  <Input {...field} id={field.name} placeholder='Full name' aria-invalid={fieldState.invalid} />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />

            <Controller
              name='email'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='gap-2'>
                  <FieldLabel htmlFor={field.name}>Email <span className='text-destructive'>*</span></FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type='email'
                    placeholder='name@example.com'
                    aria-invalid={fieldState.invalid}
                    autoComplete='email'
                  />
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />

            <Controller
              name='role'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='gap-2'>
                  <FieldLabel htmlFor='role'>Role</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id='role' className='w-full'>
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

            <Controller
              name='password'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='gap-2'>
                  <FieldLabel className='leading-5 gap-1' htmlFor={field.name}>Password</FieldLabel>

                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id={field.name}
                      type={isPasswordVisible ? 'text' : 'password'} aria-invalid={fieldState.invalid}
                      placeholder='••••••••••••••••'
                      autoComplete='password'
                    />
                    <InputGroupAddon align='inline-end' className='pr-1.5'>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => setIsPasswordVisible(prevState => !prevState)}
                        className='text-muted-foreground rounded-l-none hover:bg-transparent'
                      >
                        {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                        <span className='sr-only'>{isPasswordVisible ? 'Hide password' : 'Show password'}</span>
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />

            <Controller
              name='confirmPassword'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='gap-2'>
                  <FieldLabel className='leading-5 gap-1' htmlFor={field.name}>Password</FieldLabel>

                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id={field.name}
                      type={isConfirmPasswordVisible ? 'text' : 'password'} aria-invalid={fieldState.invalid}
                      placeholder='••••••••••••••••'
                      autoComplete='password'
                    />
                    <InputGroupAddon align='inline-end' className='pr-1.5'>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => setIsConfirmPasswordVisible(prevState => !prevState)}
                        className='text-muted-foreground rounded-l-none hover:bg-transparent'
                      >
                        {isConfirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                        <span className='sr-only'>{isConfirmPasswordVisible ? 'Hide password' : 'Show password'}</span>
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>

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

            {/* <Controller
              name='status'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='gap-2'>
                  <FieldLabel htmlFor='status'>Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id='status' className='w-full'>
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
            /> */}
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
