import { useEffect, useState } from "react";

const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState("UNKNOWN");
  const [isReconnected, setIsReconnected] = useState(false);

  const handleOnline = () => {
    console.log("Network is online");
    if (networkStatus === "OFFLINE") {
      setIsReconnected(true);
    }

    setNetworkStatus("ONLINE");
  };

  const handleOffline = () => {
    console.log("Network is offline");

    setNetworkStatus("OFFLINE");
  };

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [networkStatus]);

  return {
    networkStatus,
    setNetworkStatus,
    isReconnected,
    setIsReconnected,
  };
};

export default useNetworkStatus;
