import { useContext } from "react";
import { CartContext } from "./cartContext"

export default function useCartAuth() {
    return useContext(CartContext);
}