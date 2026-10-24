"use client";

// React Import
import { useState } from "react";

// Next Imports
import { useRouter } from "next/navigation";

// Third-party Imports
import { EyeIcon, EyeOffIcon } from 'lucide-react'

// import the better auth client
import { authClient } from "@/src/lib/auth-client";

// import zod validator
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

// Component Import
import { Button } from '@/src/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/src/components/ui/field'
import { Input } from '@/src/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/src/components/ui/input-group'
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/src/components/ui/select";

import { toast } from 'sonner'
import { errorToast, successToast } from "@/src/components/ui/sonner";

import { DEFAULT_ROLE_PERMISSIONS } from "@/src/configs/role-permConfig"

const registerSchema = z.object({
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


export default function ProvisionUsersForm() {
  const router = useRouter();
  const [isLockdown, setIsLockdown] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

  // 2. Initialize useForm with your Zod resolver
  const {
    control,
    handleSubmit,
    setError, // 👈 Crucial tool for mapping API/Database errors
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'client',
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (values) => {
    console.log(values)

    const automaticDefaults = DEFAULT_ROLE_PERMISSIONS[values.role] || [];
    setIsLockdown(true); 

    const AdminCreateUserAction = async () => {
      const { data, error: authError } = await authClient.admin.createUser({
        email: values.email,
        password: values.password,
        name: values.name,
        role: values.role,
        permissions: automaticDefaults,
      });

      if (authError) {
        if (authError.status === 500) {
          setError("root", { type: "server", message: authError.message || "The database is currently unreachable." });
          throw new Error(authError.message || "Database is offline.");
        }
        else if (authError.status === 422 || authError.message?.toLowerCase().includes("exists")) {
          setError("email", { type: "server", message: "This email is already in use." });
        } else {
          setError("root", { type: "server", message: "Database connection failed." });
        }
        setIsLockdown(false); 
        // 2. Reject the promise so sonner knows it failed, passing along the error message
        throw new Error(authError.message || "Registration failed.");
      }

      // 3. Resolve the promise on success
      return data
    };

    // ⚡ This triggers the loader toast and hooks into the promise lifecycle

    await toast.promise(AdminCreateUserAction(), {
      loading: "Creating user account...",
      success: () => {
        // should redirect to users list for the admin
        router.push("/dashboard/orders");
        const message = "Account created successfully! Welcome 🎉 Redirecting ..."
        return successToast(message)
      },
      error: (err) => {
        return errorToast(err)
      },
    });

  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-6">
      <FieldGroup className='gap-4'>
        {/* name */}
        <Controller
          name='name'
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className='w-full gap-2'>
              <FieldLabel className='leading-5 gap-1' htmlFor={field.name}>Name<span className='text-destructive'>*</span></FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder='Enter a name'
                autoComplete='name'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Email */}
        <Controller
          name='email'
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className='w-full gap-2'>
              <FieldLabel className='leading-5 gap-1' htmlFor={field.name}>Email<span className='text-destructive'>*</span></FieldLabel>
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

        {/* Role Select */}
        <Controller
          name="role" // Adjust to match your schema key
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-full gap-2">
              <FieldLabel className="leading-5" htmlFor={field.name}>
                Assign System Role <span className='text-destructive'>*</span>
              </FieldLabel>

              <Select
                value={field.value ?? ""}
                onValueChange={field.onChange}
                name={field.name}
              >
                <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select a system role" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="client">
                    Client (Lowest Access)
                  </SelectItem>
                  <SelectItem value="maintainer">
                    Maintainer (Standard Employee Access)
                  </SelectItem>
                  <SelectItem value="owner">
                    Owner (Full Business Account Control)
                  </SelectItem>
                </SelectContent>
              </Select>

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
              <FieldLabel className='leading-5 gap-1' htmlFor={field.name}>Password<span className='text-destructive'>*</span></FieldLabel>
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

        {/* Confirm Password */}
        <Controller
          name='confirmPassword'
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className='w-full gap-2'>
              <FieldLabel className='leading-5 gap-1' htmlFor={field.name}>Confirm Password<span className='text-destructive'>*</span></FieldLabel>
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button className='w-full' type='submit' disabled={isLockdown}>
            {isLockdown ? "Processing..." : "Sign up"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}