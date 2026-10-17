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
      <div className="flex min-h-screen flex-col">
        <Header/>
        <main className="flex-1 bg-white">
          <Outlet/>
        </main>
        <Footer/>
      </div>
  );
};
