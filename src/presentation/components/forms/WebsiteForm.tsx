'use client';

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import useWebsiteOperations from '@/presentation/hooks/useWebsiteOpperations';

import { WebsiteInputSchemaType } from "@/application/schemas/websiteSchema";
import { Website } from "@/domain/_entities/Website";

import { ErrorMessage, InputFieldApp } from '@/presentation/components/ui/inputFields';
import GoogleSearchConsoleSiteSelector from "@/presentation/components/forms/fields/GoogleSearchConsoleSiteSelection";


interface WebsiteformProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  website?: Website | null;
}


const Websiteform: React.FC<WebsiteformProps> = ({
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

    <GoogleSearchConsoleSiteSelector control={control} setOpen={setOpen} />

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
  )
}

export default Websiteform;