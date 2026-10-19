import {Button} from "antd";
import {useEffect, useState} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {useInfoUser} from "../../store/UserStore";
import {verifiedAccessToken} from "../../utils/Utils";
import {Footer} from "../footer/Footer";
import {Header} from "../header/Header";

/* eslint-disable react-hooks/exhaustive-deps */
export const PublicLayout = ({children}) => {
  return (
      <div className="flex h-screen flex-col overflow-hidden">
        <Header/>
        <main className="min-h-0 flex-1 overflow-y-auto bg-[#f2f6f8]">
          <Outlet/>
        </main>
        <Footer/>
      </div>
  );
};
