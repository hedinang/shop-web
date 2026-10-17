import {RESOURCE, STORAGE} from "./apiConstant";
import BaseApi from "./baseApi";
import axios from "axios";

class ResourceApi extends BaseApi {
  constructor() {
    super();
    this.BASE_URL = process.env.REACT_APP_AUTHENTICATION_API_URL || "";
    this.$axiosInstance = this.initAxiosInstance();
  }

  remove(body) {
    return this.post("secure" + RESOURCE + "remove", body);
  }

  uploadChunk(file, resourceRequest, config = {}) {
    const formData = new FormData();

    formData.append("file", file);

    const metadataBlob = new Blob([JSON.stringify(resourceRequest)], {
      type: "application/json",
    });
    formData.append("metadata", metadataBlob);

    return this.post("secure" + RESOURCE + "upload-chunk", formData, {
      timeout: 100000,
      ...config,
      headers: {
        ...(config.headers || {}),
        "Content-Type": undefined,
      },
    });
  }

  getStreamFileAsBlob(resourceId, onDownloadProgress, signal, headers = {}) {
    return this.get("secure" + RESOURCE + `file/${resourceId}`, null, {
      responseType: "blob",
      onDownloadProgress,
      signal,
      headers,
    });
  }


  init(body) {
    return this.post("free" + STORAGE + "create-multipart", body);
  }

  partUrl(body) {
    return this.post("free" + STORAGE + "create-part-url", body);
  }

  complete(body) {
    return this.post("free" + STORAGE + "complete", body);
  }

  abort(body) {
    return this.post("free" + STORAGE + "abort", body);
  }

  uploadFile(presignedUrl, file, config) {
    return axios.put(
        presignedUrl,
        file,
        {
          headers: {
            "Content-Type": "application/octet-stream",
          }
        }
    );
  }
}

export default ResourceApi;
