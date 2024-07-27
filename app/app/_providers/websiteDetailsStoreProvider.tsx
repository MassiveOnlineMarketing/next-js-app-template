'use client'

import { Website } from "@/domain/_entities/Website"
import { useWebsiteDetailsStore } from "@/presentation/stores/website-details-store"
import { useEffect } from "react"

export const WebsiteDetailsProvider = ({ websites }: { websites: Website[] | undefined | null}) => {
  // console.log('re render websites providers', websites)

  const setWebsites = useWebsiteDetailsStore((state) => state.setWebsites)
  useEffect(() => {
    if (websites !== undefined && websites !== null)
      setWebsites(websites)
  }, [])

  return null
}