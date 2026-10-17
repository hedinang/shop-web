import {createContext, useContext, useMemo} from "react";
import {CHUNK_SIZE} from "../../config/Constant";
import apiFactory from "../../api";
import {toast} from "react-toastify";

const SendingContext = createContext(null);
export const useSendingContext = () => {
  return useContext(SendingContext);
};

export const SendingProvider = ({children}) => {
  const uploadChunk = async (
      file,
      totalChunks,
      folder,
      isThumbnail,
      previewImgResourceId,
      uploadingIndex,
      eventType,
      signal,
  ) => {
    const start = uploadingIndex * CHUNK_SIZE;
    const end = Math.min(file?.size, start + CHUNK_SIZE);

    const chunk = file?.slice(start, end);

    const resourceRequest = {
      requestUuid: file?.uid,
      chunkIndex: uploadingIndex + 1,
      totalChunk: totalChunks,
      fileName: file?.name,
      folder,
      actualContentType: file?.type || "application/octet-stream",
      width: file.width,
      height: file.height,
      isThumbnail,
      previewImgResourceId,
    };

    try {
      const response = await apiFactory.resourceApi.uploadChunk(
          chunk,
          resourceRequest,
          {signal},
      );

      if (!response?.data) {
        throw new Error(`Upload failed: ${response?.status}`);
      }

      return response;
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      return await uploadChunk(
          file,
          totalChunks,
          folder,
          isThumbnail,
          previewImgResourceId,
          uploadingIndex,
          eventType,
          signal,
      );
    }
  };

  const uploadFile = async (
      file,
      folder = "FREE",
      signal,
      onProgress,
      isThumbnail = false,
      previewImgResourceId = null,
      eventType,
  ) => {
    const totalChunks = Math.ceil(file?.size / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
      if (signal?.aborted) break;

      let response = await uploadChunk(
          file,
          totalChunks,
          folder,
          isThumbnail,
          previewImgResourceId,
          i,
          eventType,
          signal,
      );

      if (response?.data?.resourceId === "-1") {
        toast(`Upload file ${file?.name} failed`);
        return;
      }

      return response;
    }
  };

  const values = useMemo(
      () => ({uploadFile}),
      [],
  );

  return (
      <SendingContext.Provider value={values}>{children}</SendingContext.Provider>
  );
};
