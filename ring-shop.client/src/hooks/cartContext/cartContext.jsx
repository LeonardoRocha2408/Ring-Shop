/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useState } from "react";


export const CartContext = createContext({
    cart: [],
    addToCart: () => { },
    removeFromCart: () => { },
    refreshCart: () => { }
});
export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;

    const addToCart = async (product) => {
        try {
            const response = await fetch(`${API_URL}/add-cart`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            })

            if (!response.ok) {
                console.log(response.status)
            }
        }
        catch (error) {
            alert(error);
        }
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (product) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== product.id));
  };

    const refreshCart = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/get-cart`, {
                method: "GET",
                credentials: "include",
            });
            const cartData = await response.json();
            setCart(cartData);
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    }, []);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}