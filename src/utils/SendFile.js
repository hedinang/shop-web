import Icon from "@ant-design/icons";
import ShadowComponent from "../components/customComponent/ShadowComponent";
import {
  DocSvg,
  EmptyIcon,
  ExcelSvg,
  HwpIcon,
  Mp3Svg,
  Mp4Svg,
  PdfSvg,
  PptSvg,
  TxtSvg,
  ZipSvg,
} from "../config/Icon";
import { CHUNK_SIZE } from "../config/Constant";
import apiFactory from "../api";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
export const getFileIcon = (fileName) => {
  const lastDotIndex = fileName?.lastIndexOf(".");

  const extension = fileName?.substring(lastDotIndex + 1)?.toLowerCase();

  const audioTypes = ["mp3", "wav", "ogg", "flac"];
  const videoTypes = [
    "mp4",
    "avi",
    "mkv",
    "webm",
    "quicktime",
    "x-flv",
    "x-ms-wmv",
  ];

  if (lastDotIndex === -1) {
    return (
        <ShadowComponent>
          <Icon component={TxtSvg} style={{ fontSize: "56px" }} />
        </ShadowComponent>
    );
  }

  if (audioTypes.includes(extension)) {
    return (
        <ShadowComponent>
          <Icon component={Mp3Svg} style={{ fontSize: "56px" }} />
        </ShadowComponent>
    );
  } else if (videoTypes.includes(extension)) {
    return (
        <ShadowComponent>
          <Icon component={Mp4Svg} style={{ fontSize: "56px" }} />
        </ShadowComponent>
    );
  }

  switch (extension) {
    case "xlsx":
    case "xls":
      return (
          <ShadowComponent>
            <Icon component={ExcelSvg} style={{ fontSize: "56px" }} />
          </ShadowComponent>
      );

      // case "csv":
      //   return <Icon component={CsvSvg} className="text-[56px]" />;
    case "pdf":
      return (
          <ShadowComponent>
            <Icon component={PdfSvg} style={{ fontSize: "56px" }} />
          </ShadowComponent>
      );
      // case "txt":
      //   return <Icon component={TxtSvg} className="text-[56px]" />;
    case "docx":
    case "doc":
      return (
          <ShadowComponent>
            <Icon component={DocSvg} style={{ fontSize: "56px" }} />
          </ShadowComponent>
      );
    case "pptx":
      return (
          <ShadowComponent>
            <Icon component={PptSvg} style={{ fontSize: "56px" }} />
          </ShadowComponent>
      );

    case "zip":
    case "rar":
      return (
          <ShadowComponent>
            <Icon component={ZipSvg} style={{ fontSize: "56px" }} />
          </ShadowComponent>
      );
    case "hwp":
      return (
          <ShadowComponent>
            <Icon component={HwpIcon} style={{ fontSize: "56px" }} />
          </ShadowComponent>
      );

    default:
      return (
          <div className="relative h-[56px]">
            <ShadowComponent>
              <Icon component={EmptyIcon} style={{ fontSize: "56px" }} />
            </ShadowComponent>
            {/* top-1/2 */}
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 font-bold text-[white] text-[9px] uppercase">
              {extension?.substr(0, 3)}
            </div>
          </div>
      );
  }
};

export const uploadFileV2 = async (
    file,
    conversationId,
    folder = "FREE",
    signal,
    onProgress,
    isThumbnail = false,
    previewImgResourceId = null,
) => {
  const totalChunks = Math.ceil(file?.size / CHUNK_SIZE);
  const requestUuid = uuidv4();
  const CONCURRENCY_LIMIT = 3;

  const createChunkData = (index) => {
    const start = index * CHUNK_SIZE;
    const end = Math.min(file?.size, start + CHUNK_SIZE);
    const chunk = file?.slice(start, end);

    const resourceRequest = {
      requestUuid: requestUuid,
      chunkIndex: index + 1,
      totalChunk: totalChunks,
      fileName: file?.name,
      folder: folder,
      conversationId: conversationId,
      actualContentType: file?.type || "application/octet-stream",
      width: file?.width,
      height: file?.height,
      isThumbnail: isThumbnail,
      previewImgResourceId: previewImgResourceId,
    };
    return { chunk, resourceRequest, index };
  };

  let totalChunkUploaded = 0;
  const uploadSingleChunk = async (chunkData) => {
    if (signal?.aborted) throw new Error("User cancelled upload");

    let retries = 3;
    while (retries > 0) {
      try {
        const res = await apiFactory.resourceApi.uploadChunkV2(
            chunkData.chunk,
            chunkData.resourceRequest,
            { signal: signal },
        );
        totalChunkUploaded++;
        if (onProgress) {
          onProgress(totalChunkUploaded, res?.data);
        }
        return res;
      } catch (error) {
        retries--;
        console.warn(
            `Chunk ${chunkData.index + 1} failed. Retrying... (${retries} left)`,
        );
        if (retries === 0) throw error;
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  };

  const normalChunkIndices = [];
  for (let i = 0; i < totalChunks - 1; i++) {
    normalChunkIndices.push(i);
  }

  const executing = [];
  for (const i of normalChunkIndices) {
    if (signal?.aborted) break;

    const chunkData = createChunkData(i);

    const p = uploadSingleChunk(chunkData).then(() => {
      executing.splice(executing.indexOf(p), 1);
    });

    executing.push(p);

    if (executing.length >= CONCURRENCY_LIMIT) {
      try {
        await Promise.race(executing);
      } catch (err) {
        if (signal?.aborted) throw new Error("Upload cancelled");
      }
    }
  }

  await Promise.all(executing);

  const lastChunkData = createChunkData(totalChunks - 1);
  const finalResponse = await uploadSingleChunk(lastChunkData);

  return finalResponse?.data;
};

export const compressImage = async (
    file,
    maxWidthOrHeight = 500,
    maxSizeMB = 0.5,
) => {
  if (!file) {
    console.error("Không tìm thấy file để nén!");
    return null;
  }

  const options = {
    maxSizeMB: maxSizeMB,
    maxWidthOrHeight: maxWidthOrHeight,
    useWebWorker: true,
    fileType: "image/jpeg",
  };

  try {
    const compressedFile = await imageCompression(file, options);

    const dimensions = await getImageDimensions(compressedFile);

    compressedFile.width = dimensions.width;
    compressedFile.height = dimensions.height;

    return compressedFile;
  } catch (error) {
    console.error("Lỗi trong quá trình nén ảnh:", error);
    return null;
  }
};

const getImageDimensions = (fileOrBlob) => {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(img.src);
    };

    img.src = URL.createObjectURL(fileOrBlob);
  });
};
