import { Layout, Space } from "antd";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { Outlet, useNavigate } from "react-router-dom";
import apiFactory from "../../api";
import { useSideBarStore } from "../../store/SideBarStore";
import { useInfoUser } from "../../store/UserStore";
import { verifiedAccessToken } from "../../utils/Utils";
import { Footer } from "../footer/Footer";
import { SideBar } from "../sideBar";
import "./style.scss";

const AuthLayout = ({ children }) => {
  const { updateUser } = useInfoUser();
  const { setIsMenuSideBar, isMenuSideBar } = useSideBarStore((state) => state);

  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);

  const process = async () => {
    setVerified(await verifiedAccessToken(updateUser));

    if (!(await verifiedAccessToken(updateUser))) {
      navigate("/login");
    }
  };

  const logout = async () => {
    await apiFactory.userApi.logout();
    Cookies.remove("access_token");
    navigate("/login");
  };

  useEffect(() => {
    process();
  }, []);

  return (
    <Space className="space-app" direction="vertical" size={[0, 48]}>
      {verified && (
        <Layout className="layout-app">
          <SideBar />
          <Layout.Content>
            <div className="flex flex-col min-h-[100vh] justify-between">
              <div>
                <button
                  className="left-icon"
                  onClick={() => {
                    setIsMenuSideBar(!isMenuSideBar);
                  }}
                >
                  <IoMenu size={25} />
                </button>
                <Outlet />
              </div>
              <Footer />
            </div>
          </Layout.Content>
        </Layout>
      )}
    </Space>
  );
};

export default AuthLayout;
