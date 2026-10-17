// import {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import apiFactory from "../../api";
// import { socketStatus$ } from "../../api/webSocketRx";
// import { eventBusType } from "../../config/Constant";
// import { useInfoUser } from "../../store/UserStore";
// import { downloadEvent$ } from "../../api/eventBus";
//
// export const DOWNLOAD_STATUS = {
//   IDLE: "idle",
//   DOWNLOADING: "downloading",
//   PAUSED: "paused",
//   SUCCESS: "success",
//   ERROR: "error",
//   CANCEL: "cancel",
// };
//
// const getHeader = (headers, key) => {
//   if (!headers) return undefined;
//
//   if (typeof headers.get === "function") {
//     return headers.get(key) || headers.get(key.toLowerCase());
//   }
//
//   return headers[key] || headers[key.toLowerCase()];
// };
//
// const getTotalSizeFromHeaders = (headers) => {
//   const contentRange = getHeader(headers, "content-range");
//
//   if (contentRange) {
//     const match = /bytes \d+-\d+\/(\d+)/.exec(contentRange);
//     if (match?.[1]) return parseInt(match[1], 10);
//   }
//
//   const contentLength = getHeader(headers, "content-length");
//   if (contentLength) return parseInt(contentLength, 10);
//
//   return 0;
// };
//
// const getFilenameFromHeaders = (headers, defaultName = "download") => {
//   const disposition = getHeader(headers, "content-disposition");
//
//   if (!disposition) return defaultName;
//
//   const utf8Match = /filename\*=UTF-8''([^;\n]*)/i.exec(disposition);
//
//   if (utf8Match?.[1]) {
//     return decodeURIComponent(utf8Match[1].replace(/['"]/g, ""));
//   }
//
//   const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i;
//   const matches = filenameRegex.exec(disposition);
//
//   if (matches?.[1]) {
//     return matches[1].replace(/['"]/g, "").trim();
//   }
//
//   return defaultName;
// };
//
// const triggerBrowserDownload = (blob, filename) => {
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//
//   a.href = url;
//   a.download = filename;
//
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
//
//   URL.revokeObjectURL(url);
// };
//
// const parseJsonBlob = async (blob) => {
//   const text = await blob.text();
//   return JSON.parse(text);
// };
//
// const isApiErrorStatus = (status) =>
//   [-1, -2, -3, -4].includes(status) || ![200, 206].includes(status);
//
// const DownloadContext = createContext(null);
//
// /* downloads struture
// * 1. resourceId
// *
// * */
// export const DownloadProvider = ({ children }) => {
//   const { user } = useInfoUser();
//   const [downloads, setDownloads] = useState({});
//
//   const updateDownload = useCallback((resourceId, updater) => {
//     setDownloads((prev) => {
//       const current = prev[resourceId] || {};
//
//       const nextValue =
//         typeof updater === "function"
//           ? updater(current)
//           : {
//               ...current,
//               ...updater,
//             };
//
//       return {
//         ...prev,
//         [resourceId]: nextValue,
//       };
//     });
//   }, []);
//
//   const getDownload = useCallback(
//     (resourceId) => downloads[resourceId],
//     [downloads],
//   );
//
//   const initDownload = useCallback(
//     (resourceId, customFileName) => {
//       const download = {
//         status: DOWNLOAD_STATUS.IDLE,
//         progress: 0,
//         error: null,
//         blob: null,
//         fileUrl: null,
//         controller: new AbortController(),
//         partialBlob: [],
//         receivedLength: 0,
//         totalSize: 0,
//         currentChunkProgress: 0,
//         fileName: customFileName || "download",
//       };
//
//       updateDownload(resourceId, download);
//
//       return download;
//     },
//     [updateDownload],
//   );
//
//   /**
//    * 1. ignore file with empty resourceId
//    * 2. ignore if resourceId is already downloading (can be resumed later)
//    */
//   const startDownload = async (
//     resourceId,
//     customFileName,
//     receivedLength,
//     isSave = true,
//   ) => {
//     downloadEvent$.next({
//       type: eventBusType.STARTING,
//       payload: {
//         resourceId,
//       },
//     });
//   };
//
//   const continueDownload = async (
//     resourceId,
//     customFileName,
//     receivedLength,
//     isSave = true,
//   ) => {
//     try {
//       const headers = {
//         Range: `bytes=${receivedLength || 0}-`,
//       };
//       const handleProgress = (progressEvent) => {};
//
//       const response = await apiFactory.resourceApi.downloadFile(
//         resourceId,
//         handleProgress,
//         null,
//         headers,
//       );
//
//       const chunkBlob = response?.data;
//
//       downloadEvent$.next({
//         type: eventBusType.DOWNLOADING,
//         payload: {
//           resourceId,
//           blob: chunkBlob,
//           totalSize: getTotalSizeFromHeaders(response.headers),
//           fileName: getFilenameFromHeaders(response.headers, "download"),
//           isSave,
//         },
//       });
//     } catch {
//       setDownloads((prev) => ({
//         ...prev,
//         [resourceId]: {
//           ...prev[resourceId],
//           status: DOWNLOAD_STATUS.ERROR,
//         },
//       }));
//     }
//   };
//
//   const startDownloadCompress = useCallback(
//     async (resourceIds, customFileName) => {
//       const downloadId = Array.isArray(resourceIds)
//         ? resourceIds.join(",")
//         : resourceIds;
//
//       const currentDownload = initDownload(downloadId, customFileName);
//
//       updateDownload(downloadId, {
//         status: DOWNLOAD_STATUS.DOWNLOADING,
//         progress: 0,
//         error: null,
//         blob: null,
//         fileUrl: null,
//       });
//
//       try {
//         const handleProgress = (progressEvent) => {
//           const loaded = progressEvent.loaded ?? 0;
//           const total = progressEvent.total ?? currentDownload.totalSize ?? 0;
//
//           if (total > 0) {
//             updateDownload(downloadId, {
//               progress: Math.round((loaded * 100) / total),
//             });
//           }
//         };
//
//         const response = await apiFactory.resourceApi.downloadCompressFile(
//           resourceIds,
//           handleProgress,
//           currentDownload.controller.signal,
//           {},
//         );
//
//         const contentType = (
//           getHeader(response.headers, "content-type") || ""
//         ).toLowerCase();
//
//         if (contentType.includes("application/json")) {
//           const errorObject = await parseJsonBlob(response.data);
//
//           updateDownload(downloadId, {
//             status: DOWNLOAD_STATUS.ERROR,
//             progress: 0,
//             error: errorObject?.message || "Download failed",
//           });
//
//           return;
//         }
//
//         const blobData =
//           response.data instanceof Blob
//             ? response.data
//             : new Blob([response.data], {
//                 type: contentType || "application/zip",
//               });
//
//         const oldDownload = getDownload(downloadId);
//
//         if (oldDownload?.fileUrl) {
//           URL.revokeObjectURL(oldDownload.fileUrl);
//         }
//
//         const fileUrl = URL.createObjectURL(blobData);
//
//         updateDownload(downloadId, {
//           status: DOWNLOAD_STATUS.SUCCESS,
//           progress: 100,
//           blob: blobData,
//           fileUrl,
//         });
//
//         const finalFileName =
//           customFileName ||
//           getFilenameFromHeaders(response.headers, "compressed_files.zip");
//
//         triggerBrowserDownload(blobData, finalFileName);
//       } catch (err) {
//         if (currentDownload.controller.signal.aborted) return;
//
//         updateDownload(downloadId, {
//           status: DOWNLOAD_STATUS.ERROR,
//           progress: 0,
//           error: err?.message || "Download failed",
//         });
//       }
//     },
//     [getDownload, initDownload, updateDownload],
//   );
//
//   const runDownloadZip = useCallback(
//     async (resourceId, customFileName) => {
//       const currentDownload = initDownload(resourceId, customFileName);
//
//       updateDownload(resourceId, {
//         status: DOWNLOAD_STATUS.DOWNLOADING,
//         progress: 0,
//         error: null,
//         blob: null,
//         fileUrl: null,
//       });
//
//       try {
//         const handleProgress = (progressEvent) => {
//           const loaded = progressEvent.loaded ?? 0;
//           const total = progressEvent.total ?? currentDownload.totalSize ?? 0;
//
//           if (total > 0) {
//             updateDownload(resourceId, {
//               progress: Math.round((loaded * 100) / total),
//             });
//           }
//         };
//
//         const response = await apiFactory.resourceApi.downloadZipFile(
//           resourceId,
//           handleProgress,
//           currentDownload.controller.signal,
//           {},
//         );
//
//         const contentType = (
//           getHeader(response.headers, "content-type") || ""
//         ).toLowerCase();
//
//         if (contentType.includes("application/json")) {
//           const errorObject = await parseJsonBlob(response.data);
//
//           updateDownload(resourceId, {
//             status: DOWNLOAD_STATUS.ERROR,
//             progress: 0,
//             error: errorObject?.message || "Download failed",
//           });
//
//           return;
//         }
//
//         const blobData =
//           response.data instanceof Blob
//             ? response.data
//             : new Blob([response.data], {
//                 type: contentType || "application/zip",
//               });
//
//         const oldDownload = getDownload(resourceId);
//
//         if (oldDownload?.fileUrl) {
//           URL.revokeObjectURL(oldDownload.fileUrl);
//         }
//
//         const fileUrl = URL.createObjectURL(blobData);
//
//         updateDownload(resourceId, {
//           status: DOWNLOAD_STATUS.SUCCESS,
//           progress: 100,
//           blob: blobData,
//           fileUrl,
//         });
//
//         const finalFileName =
//           customFileName ||
//           getFilenameFromHeaders(response.headers, "download.zip");
//
//         triggerBrowserDownload(blobData, finalFileName);
//       } catch (err) {
//         if (currentDownload.controller.signal.aborted) return;
//
//         updateDownload(resourceId, {
//           status: DOWNLOAD_STATUS.ERROR,
//           progress: 0,
//           error: err?.message || "Download failed",
//         });
//       }
//     },
//     [getDownload, initDownload, updateDownload],
//   );
//
//   const pauseDownload = (resourceId) => {
//     setDownloads((prev) => {
//       const current = prev[resourceId];
//
//       if (current?.controller) {
//         current.controller.abort();
//       }
//
//       const next = { ...prev };
//       if (next[resourceId]) {
//         next[resourceId] = {
//           ...next[resourceId],
//           status: DOWNLOAD_STATUS.PAUSED,
//         };
//       }
//       return next;
//     });
//   };
//
//   const resumeDownload = async (resourceId) => {
//     setDownloads((prev) => {
//       const current = prev[resourceId];
//
//       if (current?.controller) {
//         current.controller.abort();
//       }
//
//       const next = { ...prev };
//       if (next[resourceId]) {
//         next[resourceId] = {
//           ...next[resourceId],
//           status: DOWNLOAD_STATUS.DOWNLOADING,
//         };
//       }
//
//       continueDownload(resourceId, null, current?.receivedLength ?? 0);
//       return next;
//     });
//   };
//
//   const cancelDownload = (resourceId) => {
//     setDownloads((prev) => {
//       const current = prev[resourceId];
//
//       if (current?.controller) {
//         current.controller.abort();
//       }
//
//       if (current?.fileUrl) {
//         URL.revokeObjectURL(current.fileUrl);
//       }
//
//       const next = { ...prev };
//       delete next[resourceId];
//       return next;
//     });
//   };
//
//   useEffect(() => {
//     const sub = socketStatus$.subscribe((eventData) => {
//       if (!eventData) return;
//
//       /**
//        * after reconnect -> have to continue downloading if there are any downloading file (except paused or cancel)
//        */
//       if (eventData?.status === "CONNECTED") {
//         setDownloads((prev) => {
//           const next = { ...prev };
//           Object.entries(next).forEach(([resourceId, download]) => {
//             if (
//               download.status === DOWNLOAD_STATUS.DOWNLOADING ||
//               download.status === DOWNLOAD_STATUS.IDLE
//             ) {
//               next[resourceId] = {
//                 ...download,
//                 status: DOWNLOAD_STATUS.DOWNLOADING,
//               };
//             }
//           });
//
//           Object.entries(next).forEach(([resourceId, download]) => {
//             continueDownload(resourceId, null, download.receivedLength ?? 0);
//           });
//
//           return next;
//         });
//       }
//     });
//
//     return () => sub.unsubscribe();
//   }, [user?.userId]);
//
//   useEffect(() => {
//     const sub = downloadEvent$.subscribe((event) => {
//       const payload = event?.payload;
//
//       if (event?.type === eventBusType.STARTING) {
//         setDownloads((prev) => {
//           const current = prev?.[payload?.resourceId];
//
//           if (current) {
//             return prev;
//           } else {
//             continueDownload(
//               payload?.resourceId,
//               payload?.fileName,
//               payload?.receivedLength,
//               payload?.isSave,
//             );
//
//             return {
//               ...prev,
//               [payload?.resourceId]: {
//                 status: DOWNLOAD_STATUS.DOWNLOADING,
//                 partialBlob: [],
//                 receivedLength: 0,
//                 totalSize: 0,
//                 progress:
//                   1000 > 0
//                     ? Math.min(
//                         100,
//                         Math.round((payload?.receivedLength * 100) / 1000),
//                       )
//                     : 0,
//               },
//             };
//           }
//         });
//       }
//
//       if (event?.type === eventBusType.DOWNLOADING) {
//         setDownloads((prev) => {
//           const current = prev?.[payload?.resourceId];
//           // || {
//           //   partialBlob: [],
//           //   receivedLength: 0,
//           // };
//
//           if (!current) return prev;
//
//           if (payload?.blob) {
//             current.partialBlob.push(payload.blob);
//             current.receivedLength += payload.blob.size || 0;
//             current.totalSize = payload.totalSize || current.totalSize;
//             current.fileName = payload.fileName || current.fileName;
//             current.isSave = payload.isSave;
//           }
//
//           if (current?.status === DOWNLOAD_STATUS.PAUSED) {
//             return prev;
//           }
//
//           if (current?.status === DOWNLOAD_STATUS.CANCEL) {
//             const next = { ...prev };
//             delete next[payload?.resourceId];
//             return next;
//           }
//
//           if (current.receivedLength < current.totalSize) {
//             continueDownload(
//               payload?.resourceId,
//               payload?.fileName,
//               current.receivedLength,
//               current.isSave,
//             );
//
//             return {
//               ...prev,
//               [payload?.resourceId]: {
//                 status: DOWNLOAD_STATUS.DOWNLOADING,
//                 partialBlob: current.partialBlob,
//                 receivedLength: current.receivedLength,
//                 totalSize: current.totalSize,
//                 currentChunkProgress: 0,
//                 fileName: current.fileName,
//                 progress:
//                   current.totalSize > 0
//                     ? Math.min(
//                         100,
//                         Math.round(
//                           (current.receivedLength * 100) / current.totalSize,
//                         ),
//                       )
//                     : 0,
//                 isSave: current.isSave,
//               },
//             };
//           } else {
//             const finalBlob = new Blob(current.partialBlob, {
//               type: current.partialBlob[0]?.type,
//             });
//
//             if (current.isSave) {
//               triggerBrowserDownload(finalBlob, current.fileName);
//               /** after download is complete -> delete from downloads */
//               const next = { ...prev };
//               delete next[payload?.resourceId];
//               return next;
//             } else {
//               return {
//                 ...prev,
//                 [payload?.resourceId]: {
//                   ...current,
//                   status: DOWNLOAD_STATUS.SUCCESS,
//                 },
//               };
//             }
//           }
//         });
//       }
//
//       if (event?.type === eventBusType.ERROR) {
//         setDownloads((prev) => {
//           const current = prev?.[payload?.resourceId] || {
//             partialBlob: [],
//             receivedLength: 0,
//           };
//
//           if (current?.status === DOWNLOAD_STATUS.CANCEL) {
//             const next = { ...prev };
//             delete next[payload?.resourceId];
//             return next;
//           }
//
//           return prev;
//         });
//       }
//     });
//
//     return () => sub.unsubscribe();
//   }, [user?.userId]);
//
//   return (
//     <DownloadContext.Provider
//       value={{
//         downloads,
//         startDownload,
//         startDownloadCompress,
//         runDownloadZip,
//         pauseDownload,
//         resumeDownload,
//         cancelDownload,
//         DOWNLOAD_STATUS,
//       }}
//     >
//       {children}
//     </DownloadContext.Provider>
//   );
// };
//
// export const useGlobalDownloader = () => {
//   const context = useContext(DownloadContext);
//
//   if (!context) {
//     throw new Error(
//       "useGlobalDownloader must be used within a DownloadProvider",
//     );
//   }
//
//   return context;
// };
