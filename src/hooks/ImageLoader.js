import {useCallback, useEffect, useState} from "react";
import apiFactory from "../api";
import {toast} from "react-toastify";

export const useImageLoader = (resourceId) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [blob, setBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const IMAGE_EXPIRATION_SECONDS = 5184000;

  function isImageBlobRenderable(blob) {
    return new Promise((resolve) => {
      if (!blob || !blob.type.startsWith("image/")) {
        resolve(false);
        return;
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(blob);

      const cleanup = () => {
        URL.revokeObjectURL(objectUrl);
      };

      img.onload = () => {
        cleanup();
        resolve(true);
      };

      img.onerror = () => {
        cleanup();
        resolve(false);
      };

      img.src = objectUrl;
    });
  }

  useEffect(() => {
    if (!resourceId) {
      setLoading(false);
      setError("Bad request");
      setImageUrl(null);
      setBlob(null);
      return;
    }

    const controller = new AbortController();
    let objectUrl = null;

    const handleProgress = (progressEvent) => {
      if (progressEvent.total) {
        const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
        );
        setProgress(percentCompleted);
      }
    };

    const fetchImage = async () => {
      setLoading(true);
      setError(null);
      setImageUrl(null);
      setBlob(null);
      setProgress(0);

      try {
        const cache = await caches.open("image-cache");
        const cacheKeyUrl = `/willo-image-cache/${resourceId}`;
        const cacheRequest = new Request(cacheKeyUrl);

        const cachedResponse = await cache.match(cacheRequest);
        let imageBlob = null;

        if (cachedResponse) {
          const timestampHeader =
              cachedResponse.headers.get("X-Cache-Timestamp");

          if (!timestampHeader) {
            await cache.delete(cacheRequest);
          }

          const cacheTimestamp = parseInt(timestampHeader, 10);
          const now = Date.now();

          if ((now - cacheTimestamp) / 1000 > IMAGE_EXPIRATION_SECONDS) {
            await cache.delete(cacheRequest);
          }

          try {
            imageBlob = await cachedResponse.blob();
          } catch (cacheError) {
            await cache.delete(cacheRequest);
            imageBlob = null;
          }
        }

        try {
          if (!imageBlob) {
            const fetchedBlob = await apiFactory.resourceApi.getStreamFileAsBlob(
                resourceId,
                handleProgress,
                controller.signal,
            );

            if (
                !fetchedBlob ||
                fetchedBlob.size === 0
                // ||
                // fetchedBlob.type.startsWith("application/json")
            ) {
              throw new Error("Failed to fetch image data, received JSON.");
            }

            if (fetchedBlob && fetchedBlob.size > 0) {
              imageBlob = fetchedBlob;

              const headers = new Headers(fetchedBlob.headers);
              headers.set("X-Cache-Timestamp", Date.now());
              headers.set("X-Author-By", "cai gi kho de Cuong cong an lo cho");

              const responseToCache = new Response(imageBlob, {
                headers: headers,
              });

              await cache.put(cacheRequest, responseToCache);
            } else {
              throw new Error("Image blob is empty or invalid after fetching.");
            }
          }
        } catch (e) {
          console.log(e)
        }


        if (imageBlob) {
          const isRenderable = await isImageBlobRenderable(imageBlob);

          if (isRenderable) {
            setBlob(imageBlob);
            objectUrl = URL.createObjectURL(imageBlob);
            setImageUrl(objectUrl);
          } else {
            const fetchedBlob =
                await apiFactory.resourceApi.getStreamFileAsBlob(
                    resourceId,
                    handleProgress,
                    controller.signal,
                );

            if (
                !fetchedBlob ||
                fetchedBlob.size === 0 ||
                fetchedBlob.type.startsWith("application/json")
            ) {
              throw new Error("Failed to fetch image data, received JSON.");
            }

            if (fetchedBlob && fetchedBlob.size > 0) {
              imageBlob = fetchedBlob;

              const headers = new Headers(fetchedBlob.headers);
              headers.set("X-Cache-Timestamp", Date.now());
              headers.set("X-Author-By", "cai gi kho de Cuong cong an lo cho");

              const responseToCache = new Response(imageBlob, {
                headers: headers,
              });

              await cache.put(cacheRequest, responseToCache);

              objectUrl = URL.createObjectURL(imageBlob);
              setImageUrl(objectUrl);
              console.log("22")
            } else {
              throw new Error("Image blob is empty or invalid after fetching.");
            }
          }
        }
      } catch (err) {
        if (
            err?.name !== "AbortError" &&
            err?.name !== "CanceledError" &&
            err?.message !== "ERR_CANCELED"
        ) {
          setError(err.message || "An unknown error occurred");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      controller.abort();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [resourceId]);

  const download = useCallback(
      (filename = "willo-image") => {
        if (!blob || error) {
          toast("Cannot download image!");
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      [blob, error],
  );

  return {imageUrl, setImageUrl, loading, error, download, progress};
};
