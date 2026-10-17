import {createContext, useContext, useEffect, useMemo, useState} from "react";
import apiFactory from "../api";
import Cookies from "js-cookie";
import {isTokenExpired} from "../utils/Utils";

const LayoutContext = createContext(null);

export const useLayoutContext = () => {
  return useContext(LayoutContext);
};

/**
 * Item in Layout structure:
 * {
 *      id: string,
 *      name: string,
 *      price: number,
 *      quantity: number,
 * }
 */

export const LayoutProvider = ({children}) => {
  const [me, setMe] = useState(null);

  const updateMe = (user) => {
    setMe(user);
  }

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
        Cookies.remove("access_token");
        return false;
      }
    }
  };

  const process = async () => {
    await verifiedAccessToken(updateMe)
  };

  const logout = async () => {
    await apiFactory.userApi.logout();
    Cookies.remove("access_token");
    setMe(null)
  };

  useEffect(() => {
    process();
  }, []);

  const values = useMemo(
      () => ({me, setMe, logout, verifiedAccessToken, updateMe}),
      [me],
  );

  return <LayoutContext.Provider value={values}>{children}</LayoutContext.Provider>;
};
