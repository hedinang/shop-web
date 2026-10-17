/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import Router from "./routes";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ConfigProvider, theme } from "antd";
import "./styles/style.scss";
import "./styles/table.scss";
import { CartProvider } from "./context/CartContext";
import { LayoutProvider } from "./context/LayoutContext";
import { SendingProvider } from "./context/global/SendingProvider";

function App() {
  return (
    <ConfigProvider theme={theme}>
      <LayoutProvider>
        <SendingProvider>
          <CartProvider>
            <RouterProvider router={Router} />
            <ToastContainer autoClose={1500} />
          </CartProvider>
        </SendingProvider>
      </LayoutProvider>
    </ConfigProvider>
  );
}

export default App;
