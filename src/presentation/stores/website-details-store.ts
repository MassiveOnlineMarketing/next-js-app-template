'use client';

import { getWebsiteById } from "@/application/useCases/website/getWebsiteById";
import { Website } from "@/domain/_entities/Website";
import { create } from "zustand";

export type WebsiteDetailsActions = {
  setWebsiteDetails: (website: Website, userId: string) => void;
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

export const useWebsiteDetailsStore = create<WebsiteDetailsStore>((set) => ({
  websiteDetails: undefined,
  setWebsiteDetails: (website, userId) => {
    set({ websiteDetails: website })
    sessionStorage.setItem('websiteDetails' + userId, JSON.stringify(website))
  },
  resetWebsiteDetails: (userId) => {
    set({ websiteDetails: undefined })
    sessionStorage.removeItem('websiteDetails' + userId)
  },

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

