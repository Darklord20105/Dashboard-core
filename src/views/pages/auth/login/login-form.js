'use client'

// React Import
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from "next/navigation";

// Third-party Imports
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { toast } from 'sonner'

//import the better auth client
import { signIn } from "@/lib/auth-client";

// import zod validator
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

// Components Import
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

import { errorToast, successToast } from "@/components/ui/sonner";

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

const LoginForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  // 2. Initialize useForm with your Zod resolver
  const {
    control,
    handleSubmit,
    setError, // 👈 Crucial tool for mapping API/Database errors
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  console.log(process.env.NEXT_PUBLIC_APP_URL, "url in login form" )

  const onSubmit = async (values) => {
    console.log(values)

    const loginPromise = async () => {
      const { data, error: authError } = await signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/`,
      });

      if (authError) {
        // If it's a structural connection or server error
        if (authError.status === 500) {
          setError("root", {
            type: "server",
            message: authError.message || "The database is currently unreachable."
          });
          throw new Error(authError.message || "Database is offline.");
        }
        // 2. Reject the promise so sonner knows it failed, passing along the error message
        return new Error(authError.message || "Login failed.");
      }

      // 3. Resolve the promise on success
      return data;
    };

    // ⚡ This triggers the loader toast and hooks into the promise lifecycle
    toast.promise(loginPromise(), {
      loading: "Logging in to your account...",
      success: () => {
        const message = "Account Login success! Welcome 🎉 Redirecting ...";
        return successToast(message);
      },
      error: (err) => {
        // console.log(err.message)
        return errorToast(err.message || err);
      },
    });

  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className='gap-4'>
        {/* Email */}
        <Controller
          name='email'
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className='w-full gap-2'>
              <FieldLabel className='leading-5' htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type='email'
                aria-invalid={fieldState.invalid}
                placeholder='Email Address'
                autoComplete='email'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Password */}
        <Controller
          name='password'
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className='w-full gap-2'>
              <FieldLabel className='leading-5' htmlFor={field.name}>Password</FieldLabel>
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* Remember Me and Forgot Password */}
        <div className='flex items-center justify-between gap-y-2'>
          <Field orientation='horizontal' className='flex items-center gap-2'>
            <Checkbox id='rememberMe' />
            <FieldLabel htmlFor='rememberMe' className='text-muted-foreground'>
              {' '}
              Remember Me
            </FieldLabel>
          </Field>
          <Link href='/pages/auth/forgot-password' className='text-base text-nowrap hover:underline'>
            Forgot Password?
          </Link>
        </div>
        <Field>
          <Button className='w-full' type='submit' disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Sign in"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}

export default LoginForm
