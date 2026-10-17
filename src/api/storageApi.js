import Uppy from "@uppy/core";
import AwsS3 from "@uppy/aws-s3";
import apiFactory from "./index";

const CHUNK_SIZE = 10 * 1024 * 1024;
const CONCURRENCY = 3;

export const uploadFileWithUppy = async ({
                                           file,
                                           onProgress,
                                         }) => {
  const uppy = new Uppy({
    autoProceed: false,
    restrictions: {
      maxNumberOfFiles: 1,
    },
  });

  uppy.use(AwsS3, {
    // Luôn dùng multipart.
    // Có thể đổi thành file.size > 100 * 1024 * 1024.
    shouldUseMultipart: true,

    // Uppy tự chia file thành từng chunk 10 MiB.
    getChunkSize: () => 5 * 1024 * 1024,

    // Retry chunk lỗi.
    retryDelays: [0, 1000, 3000, 5000],

    // 1. Java backend tạo multipart upload.
    async createMultipartUpload(uppyFile) {
      const result = await apiFactory.resourceApi.init({
        fileName: uppyFile.name,
        fileSize: uppyFile.size,
        contentType:
            uppyFile.type || "application/octet-stream",
      })

      return {
        uploadId: result?.data?.uploadId,
        key: result?.data?.objectKey,
      };
    },

    // 2. Uppy tự gọi hàm này cho từng chunk.
    async signPart(
        _uppyFile,
        {
          uploadId,
          key,
          partNumber,
          signal,
        },
    ) {

      const response = await apiFactory.resourceApi.partUrl({
        uploadId: uploadId,
        objectKey: key,
        partNumber:
            String(partNumber)
      })

      return {
        url: response?.data?.uploadUrl,
      };
    },

    // Chưa hỗ trợ resume phiên cũ thì trả mảng rỗng.
    async listParts() {
      return [];
    },

    // 3. Java backend complete multipart.
    async completeMultipartUpload(
        _uppyFile,
        {
          uploadId,
          key,
          parts,
        },
    ) {
      const result = await apiFactory.resourceApi.complete({
        uploadId,
        objectKey: key,
        parts: parts.map((part) => ({
          partNumber: part.PartNumber,
          etag: part.ETag,
        })),
      })

      return {
        location: result?.data?.url,
        ...result,
      };
    },

    // 4. Hủy multipart nếu người dùng cancel.
    async abortMultipartUpload(
        _uppyFile,
        {
          uploadId,
          key,
        },
    ) {
      const result = await apiFactory.resourceApi.abort({
        uploadId,
        objectKey: key,
      })
    },
  });

  uppy.on(
      "upload-progress",
      (_uppyFile, progress) => {
        const loaded = progress.bytesUploaded;
        const total = progress.bytesTotal;

        const percent = total
            ? Math.round((loaded / total) * 100)
            : 0;

        onProgress?.({
          percent,
          loaded,
          total,
        });
      },
  );

  try {
    uppy.addFile({
      name: file.name,
      type:
          file.type || "application/octet-stream",
      data: file,
      source: "antd-upload",
    });

    const result = await uppy.upload();

    if (result.failed.length > 0) {
      throw (
          result.failed[0].error ||
          new Error("Upload thất bại")
      );
    }

    const uploadedFile = result.successful[0];

    return {
      file: uploadedFile,
      response: uploadedFile?.response?.body,
    };
  } finally {
    uppy.destroy();
  }
};

export const uploadMultipartFile = async ({
                                            file,
                                            onProgress,
                                            signal,
                                          }) => {
  if (!file) {
    throw new Error("File không tồn tại");
  }

  let uploadId;
  let objectKey;

  try {
    const initResponse = await apiFactory.resourceApi.init({
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type || "application/octet-stream"
    })

    uploadId = initResponse.data.uploadId;
    objectKey = initResponse.data.objectKey;

    const chunks = createChunks(file);

    const loadedByPart = new Map();

    const completedParts = [];

    await runWithConcurrency({
      items: chunks,
      concurrency: CONCURRENCY,

      worker: async (chunk) => {
        const partPresignedResponse = await apiFactory.resourceApi.partUrl({
          uploadId: uploadId,
          objectKey: objectKey,
          partNumber: chunk?.partNumber
        })

        const uploadedResponse = await apiFactory.resourceApi.uploadFile(partPresignedResponse?.data?.uploadUrl,
            chunk.blob, {
              signal,
              onUploadProgress: ({
                                   loaded,
                                   rate,
                                   estimated,
                                 }) => {
                loadedByPart.set(
                    chunk.partNumber,
                    Math.min(loaded, chunk.size),
                );

                const totalLoaded = Array.from(
                    loadedByPart.values(),
                ).reduce(
                    (sum, value) => sum + value,
                    0,
                );

                const percent = Math.min(
                    100,
                    Math.round(
                        (totalLoaded * 100) /
                        file.size,
                    ),
                );

                onProgress?.({
                  percent,
                  loaded: totalLoaded,
                  total: file.size,
                  rate,
                  estimated,
                  partNumber:
                  chunk.partNumber,
                  totalParts:
                  chunks.length,
                });
              },
            })

        const etag = normalizeEtag(
            uploadedResponse.headers.etag,
        );

        completedParts.push({
          partNumber: chunk.partNumber,
          etag,
        });

        // Đảm bảo progress part hoàn thành bằng đúng size.
        loadedByPart.set(
            chunk.partNumber,
            chunk.size,
        );
      },
    });

    completedParts.sort(
        (a, b) => a.partNumber - b.partNumber,
    );

    // 4. Complete multipart upload.
    const completeResponse = await apiFactory.resourceApi.complete({
      uploadId,
      objectKey: objectKey,
      parts: completedParts,
    })

    // return {
    //   location: result?.data?.url,
    //   ...result,
    // };

    onProgress?.({
      percent: 100,
      loaded: file.size,
      total: file.size,
    });

    return completeResponse.data;
  } catch (error) {
    if (uploadId && objectKey) {
      const result = await apiFactory.resourceApi.abort({
        uploadId,
        objectKey,
      })
    }
  }
};

const createChunks = (file) => {
  const chunks = [];

  let partNumber = 1;

  for (
      let start = 0;
      start < file.size;
      start += CHUNK_SIZE
  ) {
    const end = Math.min(
        start + CHUNK_SIZE,
        file.size,
    );

    chunks.push({
      partNumber,
      blob: file.slice(start, end),
      size: end - start,
    });

    partNumber += 1;
  }

  return chunks;
};

const runWithConcurrency = async ({
                                    items,
                                    concurrency,
                                    worker,
                                  }) => {
  let currentIndex = 0;

  const runners = Array.from(
      {
        length: Math.min(concurrency, items.length),
      },
      async () => {
        while (true) {
          const index = currentIndex;
          currentIndex += 1;

          if (index >= items.length) {
            return;
          }

          await worker(items[index], index);
        }
      },
  );

  await Promise.all(runners);
};


const normalizeEtag = (etag) => {
  if (!etag) {
    throw new Error(
        "Không đọc được ETag. Hãy kiểm tra CORS ExposeHeaders.",
    );
  }

  return etag.replaceAll('"', "");
};