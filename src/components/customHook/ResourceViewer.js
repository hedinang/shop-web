import { useEffect, useState } from "react";
import apiFactory from "../../api";
import { useMenuContext } from "../../context/MenuContext";
import { set } from "lodash";

export const useResourceViewer = () => {
  const { selectedConversation, setKeydownMenuOn } = useMenuContext();
  const [visible, setVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const [hasMorePrev, setHasMorePrev] = useState(true);
  const [hasMoreNext, setHasMoreNext] = useState(true);

  const handleOpenViewer = async (
    media = null,
    pivotDate,
    direction = "",
    scrollContainer = null
  ) => {
    setVisible(true);
    setLoadingMedia(true);
    setKeydownMenuOn(false);
    if (media) {
      setSelected(media);
      setIsFirstOpen(true);
    }

    // input yyyyMMdd or Date object or ISO string
    const formatDateOnly = (input) => {
      if (
        typeof input === "string" &&
        input.endsWith("Z") &&
        input.includes("T")
      ) {
        return input;
      }

      if (/^\d{8}$/.test(input)) {
        const year = parseInt(input.substring(0, 4), 10);
        const month = parseInt(input.substring(4, 6), 10) - 1;
        const day = parseInt(input.substring(6, 8), 10);
        return new Date(Date.UTC(year, month, day, 0, 0, 0)).toISOString();
      }

      const date = new Date(input);
      return date.toISOString();
    };

    try {
      if (!selectedConversation?.conversationId) return;
      if (loadingMedia) return;

      if (direction === "prev" && !hasMorePrev) return;
      if (direction === "next" && !hasMoreNext) return;

      const prevScrollHeight = scrollContainer?.scrollHeight || 0;
      const prevScrollTop = scrollContainer?.scrollTop || 0;

      const body = {
        conversationId: selectedConversation?.conversationId,
        date: formatDateOnly(pivotDate),
        direction,
      };

      const res = await apiFactory.resourceApi.getResourcesHistory(body);

      if (!res || res?.length === 0) {
        if (direction === "prev") setHasMorePrev(false);
        if (direction === "next") setHasMoreNext(false);
        if (direction === "")
          setFiles([
            {
              ...media,
              date: media?.createdAt?.slice(0, 10).replace(/-/g, ""),
            },
          ]);
        return;
      }

      setFiles((prev) =>
        direction === "prev"
          ? [...res, ...prev]
          : direction === "next"
            ? [...prev, ...res]
            : res || []
      );

      if (direction === "prev" && scrollContainer) {
        requestAnimationFrame(() => {
          const newScrollHeight = scrollContainer.scrollHeight;
          const diff = newScrollHeight - prevScrollHeight;
          scrollContainer.scrollTop = prevScrollTop + diff;
        });
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setFiles([]);
    setSelected(null);
    setHasMorePrev(true);
    setHasMoreNext(true);
    setKeydownMenuOn(true);
  };

  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible]);

  return {
    visible,
    handleOpenViewer,
    handleClose,
    files,
    selected,
    setSelected,
    loadingMedia,
    hasMorePrev,
    hasMoreNext,
    isFirstOpen,
    setIsFirstOpen,
  };
};
