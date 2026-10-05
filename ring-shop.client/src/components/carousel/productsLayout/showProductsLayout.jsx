import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import useCartAuth from "../../../hooks/cartContext/cartAuth";
import "./showProductsLayout.css";

export default function ShowProductsLayout({ product }) {
    const { addToCart } = useCartAuth();
    const installmentPrice = product.price / 2;

    return (
        <div className="product-info">
            <img src={product.desktop} />
            <img src={product.pictureURL} alt={product.description} className="product-image" />
            <p className="product-description">{product.name}</p>
            <span>R$ {product.price.toFixed(2).replace(".", ",")}</span>
            <span>Até 2 vezes de R$ {installmentPrice.toFixed(2).replace(".", ",")} sem juros</span>
            <Link to={`/products/${product.id}`} className="buy-button">COMPRAR</Link>
            <button
                className="add-cart-button"
                onClick={() => addToCart(product)}
                aria-label="Adicionar ao carrinho"
            >
                <ShoppingBag size={19} strokeWidth={1.8} />
            </button>
        </div>
    );
}