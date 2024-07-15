'use client';


import { Website } from "@/domain/_entities/Website";
import { create } from "zustand";

export type WebsiteDetailsActions = {
  setWebsiteDetails: (website: Website) => void;
  
  setWebsites: (websites: Website[]) => void; 
  addWebsite: (website: Website) => void;
  updateWebsite: (website: Website) => void;
};

export type WebsiteDetailsState = {
  websiteDetails: Website | undefined;
  websites: Website[] | null;
}

export type WebsiteDetailsStore = WebsiteDetailsState & WebsiteDetailsActions;

export const useWebsiteDetailsStore = create<WebsiteDetailsStore>((set) => ({
  websiteDetails: undefined,
  setWebsiteDetails: (website) => {
    set({ websiteDetails: website })
    sessionStorage.setItem('websiteDetails', JSON.stringify(website))
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
  }
}))

