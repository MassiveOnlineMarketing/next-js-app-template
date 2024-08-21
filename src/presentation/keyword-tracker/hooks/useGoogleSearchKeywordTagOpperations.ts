'use client';

import { useToast } from "@/presentation/components/toast/use-toast";
import { useMemo } from "react";
import { ensureArray } from "@/presentation/lib/utils";

import { useGoogleSearchKeywordResultStore } from "@/presentation/stores/google-search-keyword-result-store";

import { GoogleSearchKeywordTag } from "@/domain/serpTracker/models/GoogleSearchKeywordTag";

import { addGoogleSearchTagToKeywords } from "@/application/useCases/googleSearchKeyword/addGoogleSearchTagToKeywords";
import { deleteGoogleSearchTagFromKeywords } from "@/application/useCases/googleSearchKeyword/deleteGoogleSearchTagFromKeywords";
import { createGoogleSearchKeywordTag } from "@/application/useCases/googleSearchKeyword/createGoogleSearchKeywordTag";


/**
 * Custom hook for performing operations related to Google search keyword tags.
 * Provides functions for adding, deleting, and creating tags, as well as retrieving unique tags.
 * @returns An object containing the available operations.
 */
export const useGoogleSearchKeywordTagOpperations = () => {
  const { toast } = useToast();

  const results = useGoogleSearchKeywordResultStore((state) => state.keywordResults);
  const setResults = useGoogleSearchKeywordResultStore((state) => state.setKeywordResults);
  const removeSelectedTag = useGoogleSearchKeywordResultStore((state) => state.removeSelectedTag);

  /**
   * Adds a tag to the google search result store based on the tag object and keyword IDs.
   *
   * @param tag - The tag object to be added.
   * @param keywordIds - The ID(s) of the keywords to add the tag to. 
   * @returns A promise that resolves with the response from adding the tag to keywords.
   */
  const addTagToResults = (
    tag: GoogleSearchKeywordTag,
    keywordIds: string[],
  ) => {
    const updatedResults = results.map((result) => {
      if (keywordIds.includes(result.keywordId)) {
        // If tag is a string, convert it to an object with id and name properties
        // If tag is an array, map over it and convert each string to an object
        const tagsToAdd = Array.isArray(tag)
          ? tag.map((t) => ({ id: t, name: t }))
          : [{ id: tag.id, name: tag.name }];

        return {
          ...result,
          tags: [...result.tags!, ...tagsToAdd],
        };
      }
      return result;
    });
    setResults(updatedResults);
  };

  /**
   * Adds a tag to keywords and displays a toast notification.
   *
   * @param tag - The tag to be added.
   * @param keywordIds - The ID(s) of the keywords to add the tag to.
   * @returns A promise that resolves with the response from adding the tag to keywords.
   */
  const addTag = async (
    tag: GoogleSearchKeywordTag,
    keywordIds: string[] | string,
  ) => {
    try {
      const tagResponse = await addGoogleSearchTagToKeywords(tag.name, keywordIds);
      if (tagResponse) {
        const keywordIdsArray = ensureArray(keywordIds);
        addTagToResults(tag, keywordIdsArray);

        // Check the length of the tagResponse array
        const toastTitle = keywordIdsArray.length === 1
            ? `Tag ${tag.name} added to keyword`
            : `Tag ${tag.name} added to keywords`;

        toast({
          description: toastTitle,
          variant: "success",
          icon: "success",
          duration: 5000,
        });

        // console.log("Tag added to keywords:", tagResponse);
        return tagResponse;
      }
    } catch (error) {
      toast({
        description: `Failed to add tag to keywords`,
        variant: "destructive",
        icon: "destructive",
        duration: 5000,
      });
      console.error("Failed to add tag to keywords:", error);
    }
  };

  /**
   * Deletes a tag from the google search results store based on the tag name and keyword IDs.
   *
   * @param tagName - The name of the tag to delete.
   * @param keywordIds - The IDs of the keywords associated with the tag.
   */
  const deleteTagFromResults = (
    tagName: string,
    keywordIds: string[] | string,
  ) => {
    const updatedResults = results.map((result) => {
      if (keywordIds.includes(result.keywordId)) {
        const tagsToDelete = ensureArray(tagName);
        return {
          ...result,
          tags: result.tags?.filter(
            (tag: GoogleSearchKeywordTag) => !tagsToDelete.includes(tag.name),
          ),
        };
      }
      return result;
    });
    setResults(updatedResults);
    removeSelectedTag(tagName);
  };

  /**
   * Deletes a tag from keywords and displays a toast notification.
   *
   * @param tagName - The name of the tag to be deleted.
   * @param keywordIds - The IDs of the keywords from which the tag should be deleted.
   * @returns A promise that resolves to the response from deleting the tag.
   */
  const deleteTag = async (
    tagName: string,
    keywordIds: string[] | string,
  ) => {
    try {
      // batch the keywords in batches of 50 and then request deleteTagFromkeywords

      const batchSize = 50;
      const keywordIdsArray = ensureArray(keywordIds);
      const batches = [];
      for (let i = 0; i < keywordIdsArray.length; i += batchSize) {
        const batch = keywordIdsArray.slice(i, i + batchSize);
        batches.push(batch);
      }

      const tagResponse = [];

      for (const batch of batches) {
        const response = await deleteGoogleSearchTagFromKeywords(tagName, batch);

        if (tagResponse) {
          tagResponse.push(response);
          // console.log("Tag deleted from keywords:", response);
        }
      }

      if (tagResponse) {
        deleteTagFromResults(tagName, keywordIds);

        // Check the length of the tagResponse array
        const toastTitle =
          tagResponse.length === 1
            ? `Tag ${tagName} deleted from keyword`
            : `Tag ${tagName} deleted from keywords`;

        toast({
          description: toastTitle,
          variant: "success",
          icon: "success",
          duration: 5000,
        });

        console.log("Tag deleted from keywords:", tagResponse);
        return tagResponse;
      }
    } catch (error) {
      toast({
        description: `Failed to delete tag from keywords`,
        variant: "destructive",
        icon: "destructive",
        duration: 5000,
      });
      console.error("Failed to delete tag from keywords:", error);
    }
  };

  const keywordResults = useGoogleSearchKeywordResultStore(
    (state) => state.keywordResults,
  );
  /**
   * Calculates the unique tags from the results array.
   *
   * @returns An array of unique tags.
   */
  const uniqueTags = useMemo(() => {
    const allTags = keywordResults.reduce(
      (acc: GoogleSearchKeywordTag[], result) => {
        result.tags?.forEach((tag: GoogleSearchKeywordTag) => {
          if (
            tag &&
            !acc.some((existingTag) => existingTag.name === tag.name)
          ) {
            acc.push({ id: tag.id, name: tag.name });
          }
        });
        return acc;
      },
      [],
    );
    return allTags;
  }, [keywordResults]);

  /**
   * Creates a new tag with the given tag name and keyword IDs.
   * @param tagName - The name of the tag.
   * @param keywordIds - An array of keyword IDs.
   * @returns An object indicating the success of the operation.
   */
  const createNewTag = async (tagName: string, keywordIds: string[]) => {
    if (!tagName || tagName === "") {
      toast({
        description: "Tag name cannot be empty",
        variant: "destructive",
        icon: "destructive",
      });
      return {success: false};
    }

    try {
      const res = await createGoogleSearchKeywordTag(tagName, keywordIds);
      const tag = res.data
      if (!tag) {
        toast({
          description: "Failed to create tag",
          variant: "destructive",
          icon: "destructive",
        });
        return { success: false };
      }
      addTagToResults(tag, keywordIds);
      return { success: true };
    } catch (error) {
      toast({
        description: "Failed to create tag",
        variant: "destructive",
        icon: "destructive",
      });
      return { success: false };
    }
  }

  return { createNewTag, addTag, deleteTag, uniqueTags };
};

export default useGoogleSearchKeywordTagOpperations;