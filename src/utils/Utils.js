import {notification, Tooltip} from "antd";
import Cookies from "js-cookie";
import React from "react";
import apiFactory from "../api";
import jwtDecode from "jwt-decode";
import imageCompression from "browser-image-compression";

const verifiedAccessToken = async (updateMe) => {
  const accessToken = Cookies.get("access_token");
  if (!accessToken) {
    return false;
  } else {
    if (isTokenExpired(accessToken)) {
      return false;
    }

    try {
      const me = await apiFactory.userApi.getMe();

      if (me?.status === 200) {
        updateMe(me?.data?.user);
        return true;
      } else {
        Cookies.remove("access_token");
        return false;
      }
    } catch (error) {
      return false;
    }
  }
};

function isTokenExpired(token) {
  if (!token) return true;

  const decoded = jwtDecode(token);

  const currentTime = Math.floor(Date.now() / 1000);

  return decoded.exp < currentTime;
}

const showFileName = (shortName) => {
  const shortNameLength = shortName?.length;

  if (shortNameLength > 10) {
    return (
        <Tooltip placement="top" title={shortName}>
          {"..." + shortName.substr(shortName.length - 10, shortName.length - 1)}
        </Tooltip>
    );
  } else {
    return shortName;
  }
};

const showName = (shortName) => {
  const shortNameLength = shortName?.length;

  if (shortNameLength > 30) {
    return (
        <Tooltip placement="top" title={shortName}>
          {shortName.substr(0, 30) + "..."}
        </Tooltip>
    );
  } else {
    return shortName;
  }
};

const formatContent = (part) => {
  let lines = part?.split("\n");
  return lines?.map((line, lineIndex) => (
      <span key={lineIndex}>
      {lineIndex !== 0 && <br/>}
        <span>{line}</span>
    </span>
  ));
};

const urlIfy = (content) => {
  let urlRegex = /(https?:\/\/[^\s]+)/g;
  let parts = content?.split(urlRegex);

  return parts?.map((part, index) => {
    if (part?.match(urlRegex)) {
      return (
          <a
              href={part}
              className="url"
              target="_blank"
              rel="noreferrer"
              key={index}
          >
            {part}
          </a>
      );
    } else {
      let formattedContent = formatContent(part);
      return <span key={index}>{formattedContent}</span>;
    }
  });
};

function getColorFromInitial(initial) {
  const colors = {
    ㄱ: "#FF6F61",
    ㄴ: "#6B5B95",
    ㄷ: "#88B04B",
    ㄹ: "#F7CAC9",
    ㅁ: "#92A8D1",
    ㅂ: "#955251",
    ㅅ: "#B565A7",
    ㅇ: "#009B77",
    ㅈ: "#DD4124",
    ㅊ: "#D65076",
    ㅋ: "#45B8AC",
    ㅌ: "#EFC050",
    ㅍ: "#5B5EA6",
    ㅎ: "#9B2335",
  };
  return colors[initial?.toUpperCase()] || "#fde3cf";
}

function getColor(initial) {
  const colors = {
    ㄱ: "#E74C3C",
    ㄴ: "#3498DB",
    ㄷ: "#2ECC71",
    ㄹ: "#9B59B6",
    ㅁ: "#E67E22",
    ㅂ: "#F1C40F",
    ㅅ: "#1ABC9C",
    ㅇ: "#E74C3C",
    ㅈ: "#3498DB",
    ㅊ: "#2ECC71",
    ㅋ: "#9B59B6",
    ㅌ: "#E67E22",
    ㅍ: "#F1C40F",
    ㅎ: "#1ABC9C",
  };
  return colors[initial?.toUpperCase()] || "#f56a00";
}

const fileStore = process.env.REACT_APP_FILE_STORE || "http://10.1.1.230:8000";
const getAvatar = (user) => {
  if (!user?.avatar) return null;
  const url =
      fileStore +
      "/user/" +
      user.userId +
      user.avatar +
      "?token=" +
      Cookies.get("access_token");
  return url;
};

const openNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
    placement: "top",
    duration: 6.0,
    showProgress: true,
    pauseOnHover: false,
  });
};

export const openNotificationError = (description) => {
  openNotification("error", "Error", description);
};

export const openNotificationSuccess = (description) => {
  openNotification("success", "Success", description);
};

export const openNotificationWarn = (description) => {
  openNotification("warning", "Warning", description);
};

const getImageDimensions = (fileOrBlob) => {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      resolve({width: img.width, height: img.height});
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      resolve({width: 0, height: 0});
      URL.revokeObjectURL(img.src);
    };

    img.src = URL.createObjectURL(fileOrBlob);
  });
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

export {
  isTokenExpired,
  verifiedAccessToken,
  showFileName,
  showName,
  urlIfy,
  getColorFromInitial,
  getColor,
  getAvatar,
};
