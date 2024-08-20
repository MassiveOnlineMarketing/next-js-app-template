'use client';

import { getWebsiteById } from "@/application/useCases/website/getWebsiteById";
import { Website } from "@/domain/_entities/Website";
import { create } from "zustand";

export type WebsiteDetailsActions = {
  setWebsiteDetails: (website: Website, userId: string) => void;
  setWebsiteById: (websiteId: string, userId: string) => void;
  resetWebsiteDetails: (userId: string) => void;
  
  setWebsites: (websites: Website[]) => void; 
  addWebsite: (website: Website) => void;
  updateWebsite: (website: Website) => void;
  removeWebsite: (websiteId: string) => void;
};

export type WebsiteDetailsState = {
  websiteDetails: Website | undefined;
  websites: Website[] | null;
}

export type WebsiteDetailsStore = WebsiteDetailsState & WebsiteDetailsActions;

export const useWebsiteDetailsStore = create<WebsiteDetailsStore>((set, get) => ({
  websiteDetails: undefined,
  setWebsiteDetails: (website, userId) => {
    set({ websiteDetails: website })
    sessionStorage.setItem(`websiteDetails-${userId}`, JSON.stringify(website))
  },
  resetWebsiteDetails: (userId) => {
    set({ websiteDetails: undefined })
    sessionStorage.removeItem(`websiteDetails-${userId}`)
  },
  setWebsiteById: async (websiteId, userId) => {
    const currentWebsiteId = get().websiteDetails?.id;
    if (currentWebsiteId === websiteId) {
      return;
    }

    const website = await getWebsiteById(websiteId);
    if (website.data) {
      set({ websiteDetails: website.data });
      sessionStorage.setItem(`websiteDetails-${userId}`, JSON.stringify(website.data))  
    }
  },





  // Delete later when we dont need use website opperations anymore
  websites: null,
  setWebsites: (websites) => set({ websites }),
  addWebsite: (website) => {
    set((state) => {
      if (state.websites) {
        return { websites: [...state.websites, website] };
      }
      return state;
    });
  },
  updateWebsite: (website) => {
    set((state) => {
      if (state.websites) {
        return {
          websites: state.websites.map((w) => {
            if (w.id === website.id) {
              return website;
            }
            return w;
          }),
        };
      }
      return state;
    });
  },
  removeWebsite: (websiteId: string) => {
    set((state) => {
      if (state.websites) {
        return {
          websites: state.websites.filter((w) => w.id !== websiteId),
        };
      }
      return state;
    });
  }
}))

