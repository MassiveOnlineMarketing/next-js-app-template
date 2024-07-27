import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";
import { create } from "zustand";

export type GoogleSearchKeywordResultActions = {
  setKeywordResults: (keywordResults: GoogleSearchLatestKeywordResult[]) => void;
  updateKeywordResults: (newKeywordResults: GoogleSearchLatestKeywordResult[]) => void;
  resetKeywordResults: () => void;
  setSelectedTags: (tags: string[]) => void;
  removeSelectedTag: (tag: string) => void;

  resetSelectedTags: () => void;
}

export type GoogleSearchKeywordResultState = {
  keywordResults: GoogleSearchLatestKeywordResult[] | [];
  selectedTags: string[];
}

export type GoogleSearchKeywordResultStore = GoogleSearchKeywordResultState & GoogleSearchKeywordResultActions;

export const useGoogleSearchKeywordResultStore = create<GoogleSearchKeywordResultStore>((set) => ({
  keywordResults: [],
  selectedTags: [],

  setKeywordResults: (keywordResults: GoogleSearchLatestKeywordResult[]) => {
    set({
      keywordResults: keywordResults,
    });
  },
  updateKeywordResults: (newKeywordResults: GoogleSearchLatestKeywordResult[]) => {
    set((state) => ({
      keywordResults: [...state.keywordResults, ...newKeywordResults],
    }));
  },
  resetKeywordResults: () => {
    set({
      keywordResults: [],
    });
  },

  setSelectedTags: (tags: string[]) => {
    set({
      selectedTags: tags,
    });
  },

  removeSelectedTag: (tag: string) => {
    set((state) => ({
      selectedTags: state.selectedTags.filter((t) => t !== tag),
    }));
  },

  resetSelectedTags: () => {
    set({
      selectedTags: [],
    });
  },
}));