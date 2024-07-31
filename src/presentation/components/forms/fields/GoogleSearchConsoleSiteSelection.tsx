
import { useEffect, useState } from "react";
import Link from "next/link";
import { Controller, Control } from "react-hook-form";

import useGoogleToken from "@/presentation/hooks/useGoogleRefreshToken";
import { fetchConnectedSites } from "@/application/useCases/googleSearchConsoleApi/fetchConnectedSites";

import { WebsiteInputSchemaType } from "@/application/schemas/websiteSchema";
import { PythonApiSite } from "@/infrastructure/repositories/GoogleSeachConsoleApiRepository";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';

function GoogleSearchConsoleSiteSelector({ control, setOpen }: { control: Control<WebsiteInputSchemaType>, setOpen: (open: boolean) => void; }) {
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
            onClick={() => setOpen(false)}
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


export default GoogleSearchConsoleSiteSelector;
