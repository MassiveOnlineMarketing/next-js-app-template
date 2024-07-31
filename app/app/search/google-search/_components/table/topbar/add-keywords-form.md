"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useProcessNewKeywords } from "@/dashboard/google-search/hooks/useProcessNewKeywords";

// utils
import { KeywordsSchema } from "@/dashboard/google-search/schema";
import { z } from "zod";
import { splitAndTrimKeywords } from "@/dashboard/google-search/lib/utils";

// components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTriggerNoButton,
} from "@/website/features/dialog/dialog";
import { useToast } from "@/website/features/toast/use-toast";
import { useGoogleSearchProjectDetailsStore } from "@/lib/zustand/google-search-details-store";
import { TextareaApp } from "@/components/ui/input/fields";

type Schema = z.infer<typeof KeywordsSchema>;

const AddKeywordsFrom = ({
  children,
  buttonClassName,
}: {
  children: React.ReactNode;
  buttonClassName?: string;
}) => {
  const [open, setOpen] = React.useState(false);
  const projectDetails = useGoogleSearchProjectDetailsStore(
    (state) => state.ProjectDetails,
  );
  const { processNewKeywords, isLoading, error } = useProcessNewKeywords();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Schema>({});

  useEffect(() => {
    if (error) {
      toast({
        description: error,
        variant: "destructive",
        icon: "destructive",
        duration: 3000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const onSubmit = async (data: Schema) => {
    setOpen(false);
    // console.log("data", data);

    if (!projectDetails) {
      return;
    }

    const keywordsArray = splitAndTrimKeywords(data.keywords);

    try {
      const res = await processNewKeywords(keywordsArray, projectDetails);
    } catch (error) {
      toast({
        description: "Failed to add keywords",
        variant: "destructive",
        icon: "destructive",
      });
    }

    if (!isLoading) {
      reset();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTriggerNoButton
          className={buttonClassName}
          onClick={() => setOpen(true)}
        >
          {children}
        </DialogTriggerNoButton>
        <DialogContent>
          <DialogHeader>
            <h2 className="font-medium text-2xl text-gray-800">
              Add Keywords to Campaign
            </h2>
            <p className="font-medium text-base text-gray-500 pt-[4px]">
              Please enter the keywords you want to track separated by line.
            </p>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <TextareaApp
              label="Keywords"
              rows={5}
              placeholder="Enter keywords..."
              {...register("keywords")}
            />
            {/* <textarea
              className="border-2 border-black"
              rows={10}
              {...register("keywords")}
            /> */}
            <button
              type="submit"
              className="mt-8 px-6 py-2 w-fit flex mx-auto rounded-lg text-lg font-semibold"
            >
              Add
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddKeywordsFrom;
