import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export const useCartContext = () => {
  return useContext(CartContext);
};

/**
 * Item in cart structure:
 * {
 *      id: string,
 *      name: string,
 *      price: number,
 *      quantity: number,
 * }
 */

export const CartProvider = ({ children }) => {
  const [orderList, setOrderList] = useState([]);
  const values = useMemo(
    () => ({
      orderList,
      setOrderList,
    }),
    [orderList],
  );

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
};
