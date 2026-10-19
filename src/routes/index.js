/* eslint-disable react/react-in-jsx-scope */
import {createBrowserRouter, Navigate} from "react-router-dom";
import AuthLayout from "../components/layouts/AuthLayout";
import {PublicLayout} from "../components/layouts/PublicLayout";
import {CartProvider} from "../context/CartContext";
import {ItemProvider} from "../context/ItemContext";
import {AdminBidList} from "../pages/bid/AdminBidList";
import {AdminItemDetail} from "../pages/item/AdminItemDetail";
import {AdminItemList} from "../pages/item/AdminItemList";
import Login from "../pages/login";
import {MailManagement} from "../pages/mail/MailManagement";
import {NationList} from "../pages/sim/NationList";
import {Product} from "../pages/product/Product";
import {OrderList} from "../pages/cart/OrderList";
import {SimList} from "../pages/sim/SimList";
import {SupplierDetail} from "../pages/sim/SupplierDetail";
import {UserManagement} from "../pages/user/UserManagement";
import {useLayoutContext} from "../context/LayoutContext";
import {role} from "../config/Constant";

const AdminUsersRoute = () => {
  const {me, isMeLoading} = useLayoutContext();

  if (isMeLoading) return null;
  if (![role.ADMIN, role.SUPER_ADMIN].includes(me?.role)) {
    return <Navigate to="/nation-list" replace />;
  }

  return <UserManagement />;
};

const router = createBrowserRouter([
  {
    path: "login",
    element: <Login/>,
  },
  // {
  //   path: "register",
  //   element: <Registration />,
  // },
  {
    path: "*",
    element: <Navigate to="/nation-list"/>,
  },
  {
    // path: "/",
    element: (
        <PublicLayout/>
    ),
    children: [
      {
        path: "/nation-list",
        element: <NationList/>,
      },
      {
        path: "/product/:country",
        element: <Product/>,
      },
      {
        path: "/sim/search/:condition",
        element: <SimList/>,
      },
      {
        path: "/sim/supplier/:supplierId",
        element: <SupplierDetail/>,
      },
      {
        path: "/cart",
        element: <OrderList/>,
      },
      {
        path: "/users",
        element: <AdminUsersRoute />,
      },
    ],
  }
]);
export default router;
