"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { LoginSchema } from "@/application/schemas/authSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/presentation/components/ui/form";
import { CardWrapper } from "./card-wrapper";
import { Button } from "@/presentation/components/ui/button";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";

import { InputFieldAppWithIcon } from "@/presentation/components/ui/inputFields";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { login } from "@/application/useCases/auth/login";

export const LoginForm = () => {
  const searchParams = useSearchParams();

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    // console.log(values)

    login(values).then((data) => {
      setError(data?.error);
      // @ts-ignore
      setSuccess(data?.success);
    });

    // startTransition(() => {
    //   login(values, callbackUrl)
    //     .then((data) => {
    //       if (data?.error) {
    //         form.reset();
    //         setError(data.error);
    //       }

    //       if (data?.success) {
    //         form.reset();
    //         setSuccess(data.success);
    //       }

    //       if (data?.twoFactor) {
    //         setShowTwoFactor(true);
    //       }
    //     })
    //     .catch(() => setError("Something went wrong"));
    // });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="space-y-8">
              {/* {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="123456"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )} */}
              {/* {!showTwoFactor && ( */}
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <InputFieldAppWithIcon
                          className="bg-transparent"
                          Icon={EnvelopeIcon}
                          {...field}
                          disabled={isPending}
                          placeholder="john.doe@example.com"
                          type="email"
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
                    <FormItem className="space-y-1">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <InputFieldAppWithIcon
                          className="bg-transparent"
                          Icon={LockClosedIcon}
                          {...field}
                          disabled={isPending}
                          placeholder="●●●●●●"
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                      <Button
                        size="sm"
                        variant="secondary"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href="/auth/reset">Forgot password?</Link>
                      </Button>
                    </FormItem>
                  )}
                />
              </>
              {/* )} */}
            </div>
            <FormError message={error || urlError} />
            <FormSuccess message={success} />
          </div>
          <Button disabled={isPending} type="submit" className="mt-20 w-full text-violet-50 relative gradient-mask primary-button hover:text-white bg-primary-500 font-medium" size='md'>
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
