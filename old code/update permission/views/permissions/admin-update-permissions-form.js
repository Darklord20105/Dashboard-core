"use client";
// React imports
// to update data right away or live
import { useState, useTransition } from "react";

// Third-party Imports
import { toast } from 'sonner'

// import zod validator
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

// Component Import
import { Button } from '@/src/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/src/components/ui/field'
import { Input } from '@/src/components/ui/input'
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/src/components/ui/select";
import { Checkbox } from "@/src/components/ui/checkbox"
import { Label } from "@/src/components/ui/label";

import { successToast, errorToast } from "@/src/components/ui/sonner";
import { AVAILABLE_PERMISSIONS } from "@/src/configs/role-permConfig"
import { updatePermissionsAction } from "@/old code/update permission/page/admin-update-permissions/actions";
import { useSession } from '@/src/lib/auth-client'

import AdminListUsers from "./table";

const PERMISSION_IDS = AVAILABLE_PERMISSIONS.map(p => p.id)

export const updatePermissionsSchema = z.object({
  userId: z.string({ required_error: "Target User ID is required" })
    .trim()
    .length(24, "ID must be exactly 24 characters")
    // Ensures it only contains valid hexadecimal characters (0-9, a-f)
    .regex(/^[0-9a-fA-F]{24}$/, "ID must be a valid hexadecimal string"),
  role: z.enum(["client", "maintainer", "owner", "admin"]),
  // Validates an array containing only the elements defined above
  permissions: z.array(z.enum(PERMISSION_IDS))
});

export default function AdminPermissionsUpdateForm({ initialUsers }) {
  const [isLockdown, setIsLockdown] = useState(false);
  const { data: session } = useSession();
  // const [isAdmin, setIsAdmin] = useState('')

  // --- 📊 User Directory Table States ---
  const [isPending, startTransition] = useTransition();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    setError, // 👈 Crucial tool for mapping API/Database errors
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updatePermissionsSchema),
    defaultValues: {
      userId: '',
      role: 'client',
      permissions: []
    }
  });

  // Click hook: copies a user's details straight into the checkboxes form
  const handleSelectUserFromTable = (user) => {
    setValue("userId", user.id, { shouldValidate: true })
    setValue("role", user.role, { shouldValidate: true })
    setValue("permissions", user.permissions, { shouldValidate: true })
  };

  // Submit the changes to the API route
  const handleSavePrivileges = (values) => {

    const adminId = session?.user?.id
    if (adminId === values.userId) {
      return errorToast("Permission Denied, Can't change Role, Cannot self set Lower Role")
    }

    console.log(values)
    if (!values.userId) return toast.error("Please enter a valid User ID from MongoDB");
    setIsLockdown(true);

    // 1. Wrap the execution in startTransition so Next.js handles layout rendering cleanly
    startTransition(async () => {
      // 2. Create a clean inline Promise wrapper that toast can track
      const adminUpdateUserPermission = async () => {
        try {
          const result = await updatePermissionsAction({
            userId: values.userId,
            role: values.role,
            permissions: values.permissions
          });

          // Check if the backend reported a validation or server restriction error
          if (result && !result.success) {
            // 🌟 Throwing the message forces toast to switch to the "error" style instantly
            throw new Error(result.error || "Failed to synchronize privileges.");
          }

          // If everything went perfectly, resolve the promise successfully!
          setIsLockdown(false);
          return (result?.message || "User privileges updated.");
        } catch (error) {
          setIsLockdown(false);
          throw new Error(error);
        }
      };

      // 3. Fire the Promise straight into your Toast interface engine!
      await toast.promise(adminUpdateUserPermission(), {
        loading: "Synchronizing Database...",
        success: () => {
          const message = "Permission update success!"
          return successToast(message)
        },
        error: (err) => {
          return errorToast(err.message)
        },
      });

    });

  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleSavePrivileges)} className="mx-auto mb-5 space-y-6">
        <FieldGroup className='gap-4'>
          {/* name */}
          <Controller
            name='userId'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className='w-full gap-2'>
                <FieldLabel className='leading-5' htmlFor={field.name}>User ID</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder='Enter a valid ID'
                  autoComplete=''
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
                  Change System Role
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

          <Controller
            name="permissions"
            control={control}
            render={({ field, fieldState }) => {
              const currentValues = Array.isArray(field.value) ? field.value : [];

              return (
                <Field data-invalid={fieldState.invalid} className="w-full gap-2">
                  <div className="flex flex-col gap-2">
                    <FieldLabel className="leading-5 font-bold">
                      Feature Permissions Overrides:
                    </FieldLabel>

                    {/* 🌟 Styled List Container matching CheckboxListGroupDemo */}
                    <ul className="flex w-full flex-col divide-y rounded-md border  mt-1">
                      {AVAILABLE_PERMISSIONS.map((perm) => {
                        const isChecked = currentValues.includes(perm.id);

                        return (
                          <li key={perm.id} className='flex items-center gap-2 py-3'>
                            <Checkbox
                              id={perm.id}
                              className="mx-8 my-1"
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const nextValues = checked
                                  ? [...currentValues, perm.id]
                                  : currentValues.filter((id) => id !== perm.id);

                                field.onChange(nextValues);
                              }}
                            />
                            <Label htmlFor={perm.id} >
                              <span className='flex items-center gap-2 *:[svg]:size-4'>
                                {perm.icon} {perm.label}
                              </span>

                            </Label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              );
            }}
          />

          {/* Submit Button */}
          <div className="flex items-center gap-2">
            <Field>
              <Button className='w-full' type='submit' disabled={isLockdown}>
                {isPending ? "Synchronizing Database..." : "Save Feature Permissions"}
              </Button>
            </Field>

            <Field>
              <Button className='w-full' type='submit' onClick={() => reset()}>
                Clear Form
              </Button>
            </Field>
          </div>

        </FieldGroup>
      </form>

      <AdminListUsers initialUsers={initialUsers} onSelectUser={handleSelectUserFromTable} />
    </div>
  );
}