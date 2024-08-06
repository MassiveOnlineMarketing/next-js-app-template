"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";

// Form
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GeneralUserSettingsSchema } from "@/application/schemas/authSchema";
import { FormError } from "@/presentation/auth/forms/form-error";
import { FormSuccess } from "@/presentation/auth/forms/form-success";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/presentation/components/ui/form";
import { InputField } from "@/presentation/components/ui/inputFields";

// Comp
import { Button } from "@/presentation/components/ui/button";

// Auth
import { updateUserDetails } from "@/application/useCases/auth/settings";
import { useCurrentUser } from "@/presentation/auth/hooks/user-current-user";

const GeneralUserSettingsForm = () => {
  const currentUser = useCurrentUser();
  const provider = currentUser?.loginProvider;
  const { update } = useSession();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof GeneralUserSettingsSchema>>({
    resolver: zodResolver(GeneralUserSettingsSchema),
    defaultValues: {
      name: currentUser?.name || undefined,
      email: currentUser?.email || undefined,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof GeneralUserSettingsSchema>,
  ) => {
    setError("");
    setSuccess("");
  
    startTransition(async () => {
      const res = await updateUserDetails(values);
      if (!res.success) {
        return setError(res.error);
      }
  
      if ('message' in res) {
        setSuccess(res.message as string);
      }
  
      if (res.success && 'data' in res) {
        setSuccess(res.message);
        if (res.data) {
          // Set the new user details in the form
          console.log('restting form')
          form.reset({
            name: res.data.name || undefined,
            email: res.data.email || undefined,
            password: '',
            passwordConfirmation: '',
            currentPassword: '',
          });
          // Update the session --> Auth.ts
          update({ name: res.data.name, email: res.data.email });
        }
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-10 space-y-[16px]">
          <p className="text-base leading-6 font-semibold text-gray-800">
            Personal
          </p>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <InputField
                    {...field}
                    disabled={isPending}
                    // placeholder="******"
                    type="name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <InputField
                    {...field}
                    disabled={isPending}
                    // placeholder="******"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {provider === "credentials" && (
          <div className="space-y-[16px]">
            <p className="text-base leading-6 font-semibold text-gray-800">
              Change Password
            </p>
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <InputField
                      {...field}
                      disabled={isPending}
                      // placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <InputField
                      {...field}
                      disabled={isPending}
                      // placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <InputField
                      {...field}
                      disabled={isPending}
                      // placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormError message={error} className="mt-[16px]" />
        <FormSuccess message={success} className="mt-[16px]" />

        <Button
          disabled={isPending}
          type="submit"
          className="mt-10  w-fit px-6 py-3 bg-primary-500 text-sm leading-5 font-semibold text-white"
        >
          Save Changes
        </Button>
      </form>
    </Form>
  );
};

export default GeneralUserSettingsForm;
