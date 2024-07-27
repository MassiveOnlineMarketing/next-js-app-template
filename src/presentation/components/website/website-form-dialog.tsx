'use client'

import React, { useEffect, useState } from 'react'
import Link from "next/link";

import useWebsiteOperations from '@/presentation/hooks/useWebsiteOpperations';

import useGoogleToken from '@/presentation/hooks/useGoogleRefreshToken';
import { PythonApiSite } from '@/infrastructure/repositories/GoogleSeachConsoleApiRepository';
import { fetchConnectedSites } from '@/application/useCases/googleSearchConsoleApi/fetchConnectedSites';

import { WebsiteInputSchemaType } from '@/application/schemas/websiteSchema';
import { useForm, SubmitHandler, Controller, Control } from "react-hook-form";
import { ErrorMessage, InputFieldApp } from '@/presentation/components/ui/inputFields';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/presentation/components/common/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { Website } from '@/domain/_entities/Website';


interface WebsiteFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  website?: Website | null;
}

const WebsiteFormDialog: React.FC<WebsiteFormDialogProps> = ({
  open,
  setOpen,
  website,
}) => {
  const { handleCreateWebsite, handleUpdateWebsite, handleDeleteWebsite } = useWebsiteOperations();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },

  } = useForm<WebsiteInputSchemaType>({});

  useEffect(() => {
    if (website) {
      setValue("websiteName", website.websiteName);
      setValue("domainUrl", website.domainUrl);
      setValue("gscUrl", website.gscUrl ?? '');
    }
  }, [open]);

  const onSubmit: SubmitHandler<WebsiteInputSchemaType> = async (data) => {
    if (website) {
      const res = await handleUpdateWebsite(data, website.id)
      if (res.success) {
        reset()
        setOpen(false)
      }
    } else {
      const res = await handleCreateWebsite(data)
      if (res.success) {
        reset()
        setOpen(false)
      }
    }
  }

  const onDelete = async () => {
    if (!website) return
    const res = await handleDeleteWebsite(website.id)
    if (res.success) {
      reset()
      setOpen(false)
    }
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-medium text-2xl text-gray-800">
            {website
              ? "Update your Website"
              : "Setup your website"}
          </DialogTitle>
          <p className="font-medium text-base text-gray-500 pt-[4px]">
            Please enter the details of your website
          </p>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 text-gray-800 font-medium"
        >
          <p>Project Name</p>
          <InputFieldApp
            type="text"
            placeholder="My Awsome Website"
            // required
            {...register("websiteName", { required: true })}
          />
          <ErrorMessage message={errors?.websiteName?.message} />
          {errors.websiteName && <span>This field is required</span>}

          <p className="mt-7">Domain Url</p>
          <InputFieldApp
            type="text"
            placeholder="https://www.example.com"
            required
            {...register("domainUrl", { required: true })}
          />
          <ErrorMessage message={errors?.domainUrl?.message} />
          {errors.domainUrl && <p>{errors.domainUrl.message}</p>}

          <GoogleSearchConsoleSiteSelector control={control} />

          <div className='mt-8 w-full inline-flex justify-center text-lg font-semibold'>
            {/* TODO: button styles */}
            {website && (
              <button
                onClick={onDelete}
                type='button'
                className=" px-6 py-2 w-fit flex rounded-lg text-red-500"
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              className=" px-6 py-2 w-fit flex rounded-lg text-green-500"
            >
              {website ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function GoogleSearchConsoleSiteSelector({ control }: { control: Control<WebsiteInputSchemaType> }) {
  const { hasAccess, refreshToken, isLoading } = useGoogleToken("search-console");
  const [sites, setSites] = useState<PythonApiSite[] | null>(null);

  useEffect(() => {
    const fetchSites = async () => {
      if (hasAccess && refreshToken) {
        const connectedSites = await fetchConnectedSites(refreshToken);
        setSites(connectedSites);
      }
    }

    fetchSites()
  }, [refreshToken])


  if (isLoading) return (
    <>
      <p className="mt-7">Connect Google Search Console</p>
      <div className="cursor-pointer mt-3 text-gray-400  inline-flex w-full justify-between  p-4 rounded-xl border border-primary-100 bg-primary-50/50 placeholder-gray-400 ring-primary-500 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">Loading...</div>
      {!hasAccess && (
        <p className="mt-4 w-fit mx-auto text-gray-500 font-normal">
          Authenticate your{" "}
          <Link
            href="/app/settings/integrations"
            className="text-primary-500"
          >
            Search Console{" "}
          </Link>
          Account
        </p>
      )}
    </>
  );

  if (!hasAccess) return (
    <>
      <p className="mt-7">Connect Google Search Console</p>
      <div className="cursor-pointer mt-3 text-gray-400  inline-flex w-full justify-between  p-4 rounded-xl border border-primary-100 bg-primary-50/50 placeholder-gray-400 ring-primary-500 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">Please authenticate Google Search Console Access</div>
      {
        !hasAccess && (
          <p className="mt-4 w-fit mx-auto text-gray-500 font-normal">
            Authenticate your{" "}
            <Link
              href="/app/settings/integrations"
              className="text-primary-500"
            >
              Search Console{" "}
            </Link>
            Account
          </p>
        )
      }
    </>
  )

  return (
    <>
      <p className="mt-7">Connect Google Search Console</p>
      <Controller
        name="gscUrl"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger disabled={!hasAccess || !sites}>
              <SelectValue
                placeholder={
                  !hasAccess
                    ? "Please authenticate Google Search Console Access"
                    : (!sites && "No sites connected to Google Account") ||
                    "Connect a Website"
                }
                className="placeholder-gray-400 text-gray-400 "
              />
            </SelectTrigger>
            <SelectContent>
              <p className="ml-4 text-gray-500">Available Sites</p>
              {sites &&
                sites.map((site: PythonApiSite) => {
                  return (
                    <SelectItem key={site.siteUrl} value={site.siteUrl}>
                      {site.siteUrl}
                    </SelectItem>
                  );
                })}
              <SelectItem value="noWebsite">Don&apos;t use a Website</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
      {!hasAccess && (
        <p className="mt-4 w-fit mx-auto text-gray-500 font-normal">
          Authenticate your{" "}
          <Link
            href="/app/settings/integrations"
            className="text-primary-500"
          >
            Search Console{" "}
          </Link>
          Account
        </p>
      )}
    </>
  )
}

export default WebsiteFormDialog