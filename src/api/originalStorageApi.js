import {CreateBucketCommand, GetObjectCommand, HeadBucketCommand, S3Client} from "@aws-sdk/client-s3";
import {Upload} from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  endpoint: "https://localhost:9443",
  region: "us-east-1",
  forcePathStyle: true,

  credentials: {
    accessKeyId: "minioadmin",
    secretAccessKey: "minioadmin123",
  },

  // Tự retry các request lỗi tạm thời
  maxAttempts: 5,
});

const ensureBucketExists = async (bucketName) => {
  try {
    await s3Client.send(
        new HeadBucketCommand({
          Bucket: bucketName,
        }),
    );
  } catch (error) {
    const statusCode = error?.$metadata?.httpStatusCode;

    if (
        statusCode === 404 ||
        error?.name === "NotFound" ||
        error?.name === "NoSuchBucket"
    ) {
      await s3Client.send(
          new CreateBucketCommand({
            Bucket: bucketName,
          }),
      );

      return;
    }

    throw error;
  }
};

const createMultipartUpload = ({
                                 file,
                                 bucket,
                                 objectKey,
                                 onProgress,
                               }) => {
  const uploader = new Upload({
    client: s3Client,

    params: {
      Bucket: bucket,
      Key: objectKey,
      Body: file,
      ContentType: file.type || "application/octet-stream",
    },

    // Mỗi chunk 10 MB
    partSize: 10 * 1024 * 1024,

    // Upload tối đa 4 chunk song song
    queueSize: 4,

    // false: upload thất bại hoàn toàn thì xóa các part đã upload
    leavePartsOnError: false,
  });

  uploader.on("httpUploadProgress", (event) => {
    const loaded = event.loaded ?? 0;
    const total = event.total ?? file.size;

    const percent =
        total > 0
            ? Math.min(100, Math.round((loaded / total) * 100))
            : 0;

    onProgress?.({
      loaded,
      total,
      percent,
    });
  });

  return {
    start: () => uploader.done(),

    cancel: async () => {
      await uploader.abort();
    },
  };
};

const getViewUrl = async (objectKey) => {
  return getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: "videos",
        Key: objectKey,
        ResponseContentDisposition: "inline",
      }),
      {
        expiresIn: 60 * 60,
      },
  );
};

export {s3Client, ensureBucketExists, createMultipartUpload, getViewUrl};

