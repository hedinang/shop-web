import { format, subHours } from "date-fns";
import moment from "moment-timezone";

export const formatLastTime = (lastTime) => {
  const currentTime = new Date();
  const timeDifference = currentTime - lastTime;

  if (timeDifference < 60000) {
    return "Few sec";
  } else if (timeDifference < 3600000) {
    const minutes = Math.floor(timeDifference / 60000);
    return `${minutes} mins`;
  } else if (timeDifference < 86400000) {
    const hours = Math.floor(timeDifference / 3600000);
    return `${hours} hour`;
  } else if (timeDifference < 691200000) {
    const days = Math.floor(timeDifference / 86400000);
    return `${days} days`;
  } else {
    return lastTime.toLocaleDateString();
  }
};

export const formatDate = (time) => {
  if (!format(new Date(time), "dd/MM/yyyy")) {
    return "";
  }
  return format(new Date(time), "dd/MM/yyyy");
};

export const formatTime = (time) => {
  if (!time) return "";

  if (!format(new Date(time), "HH:mm dd/MM/yyyy")) {
    return "";
  }
  return format(new Date(time), "HH:mm dd/MM/yyyy");
};

export const minusFormatTime = (time) => {
  if (!time) return "";

  if (!format(new Date(time), "HH:mm dd/MM/yyyy")) {
    return "";
  }

  const prefixTime = time?.split(" ")?.[1];

  return format(
    subHours(new Date(time), prefixTime === "10:00:00" ? 8 : 3),
    "HH:mm dd/MM/yyyy"
  );
};

export const expiredBidOrder = (time) => {
  if (!time) return false;

  if (!format(new Date(time), "dd/MM/yyyy HH:mm")) {
    return false;
  }

  const prefixTime = time?.split(" ")?.[1];
  return subHours(new Date(time), prefixTime === "10:00:00" ? 8 : 3) < new Date();
};

//format "YYYY-MM-DDTHH:mm:ss.SSSZ" || "YYYY-MM-DD HH:mm:ss"
export const formatDateTime = (time, format) => {
  if (!time) return "";

  const date = moment.tz(time, moment.tz.guess());

  return date?.format(format);
};

export function extractDay(time, locale = "vi-VI") {
  if (!time) return null;

  return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(
    new Date(time)
  );
}