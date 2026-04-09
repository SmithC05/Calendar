"use client";

import { useEffect, useMemo, useState } from "react";

export type MonthPhotoCredit = {
  photographerName: string;
  photographerUrl: string;
  sourceUrl: string;
};

export type MonthHeroPhoto = {
  imageUrl: string;
  credit: MonthPhotoCredit | null;
};

type UnsplashSearchResponse = {
  results?: Array<{
    urls?: {
      regular?: string;
    };
    user?: {
      name?: string;
      links?: {
        html?: string;
      };
    };
  }>;
};

const CACHE_KEY = "wallstory-month-photos";
const memoryCache = new Map<string, MonthHeroPhoto>();

export function useMonthHeroImage(
  month: Date,
  photoQuery: string,
  fallbackImage: string
) {
  const [photo, setPhoto] = useState<MonthHeroPhoto>({
    imageUrl: fallbackImage,
    credit: null
  });

  const cacheId = useMemo(
    () => `${month.getFullYear()}-${month.getMonth()}-${photoQuery}`,
    [month, photoQuery]
  );

  useEffect(() => {
    setPhoto({
      imageUrl: fallbackImage,
      credit: null
    });
  }, [fallbackImage, cacheId]);

  useEffect(() => {
    const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

    if (!accessKey) {
      return;
    }

    const cachedPhoto = readCachedPhoto(cacheId);

    if (cachedPhoto) {
      setPhoto(cachedPhoto);
      return;
    }

    let isCancelled = false;

    async function fetchMonthPhoto() {
      try {
        const params = new URLSearchParams({
          query: photoQuery,
          orientation: "landscape",
          content_filter: "high",
          per_page: "1"
        });

        const response = await fetch(`https://api.unsplash.com/search/photos?${params.toString()}`, {
          headers: {
            Authorization: `Client-ID ${accessKey}`,
            "Accept-Version": "v1"
          }
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as UnsplashSearchResponse;
        const result = data.results?.[0];
        const imageUrl = result?.urls?.regular;
        const photographerName = result?.user?.name;
        const photographerUrl = result?.user?.links?.html;

        if (!imageUrl || !photographerName || !photographerUrl || isCancelled) {
          return;
        }

        const resolvedPhoto: MonthHeroPhoto = {
          imageUrl: appendImageParams(imageUrl),
          credit: {
            photographerName,
            photographerUrl: `${photographerUrl}?utm_source=wallstory_calendar&utm_medium=referral`,
            sourceUrl: "https://unsplash.com/?utm_source=wallstory_calendar&utm_medium=referral"
          }
        };

        writeCachedPhoto(cacheId, resolvedPhoto);
        setPhoto(resolvedPhoto);
      } catch {
        // Fallback artwork stays in place when photo fetching fails.
      }
    }

    void fetchMonthPhoto();

    return () => {
      isCancelled = true;
    };
  }, [cacheId, photoQuery]);

  return photo;
}

function readCachedPhoto(cacheId: string) {
  const cachedInMemory = memoryCache.get(cacheId);

  if (cachedInMemory) {
    return cachedInMemory;
  }

  try {
    const rawCache = window.localStorage.getItem(CACHE_KEY);

    if (!rawCache) {
      return null;
    }

    const parsedCache = JSON.parse(rawCache) as Record<string, MonthHeroPhoto>;
    const cachedPhoto = parsedCache[cacheId];

    if (cachedPhoto) {
      memoryCache.set(cacheId, cachedPhoto);
      return cachedPhoto;
    }
  } catch {
    window.localStorage.removeItem(CACHE_KEY);
  }

  return null;
}

function writeCachedPhoto(cacheId: string, photo: MonthHeroPhoto) {
  memoryCache.set(cacheId, photo);

  try {
    const rawCache = window.localStorage.getItem(CACHE_KEY);
    const parsedCache = rawCache ? (JSON.parse(rawCache) as Record<string, MonthHeroPhoto>) : {};

    parsedCache[cacheId] = photo;
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(parsedCache));
  } catch {
    // Ignore cache persistence failures and keep the in-memory cache.
  }
}

function appendImageParams(imageUrl: string) {
  const separator = imageUrl.includes("?") ? "&" : "?";
  return `${imageUrl}${separator}w=1600&auto=format&q=80`;
}