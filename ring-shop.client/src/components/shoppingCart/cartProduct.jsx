import { Trash2, Minus, Plus } from "lucide-react";
import useCartAuth from "../../hooks/cartContext/cartAuth";
import "./cartProduct.css";

export default function CartProduct({ product }) {
    const { addToCart, removeFromCart } = useCartAuth();
    return (
        <div className="cart-product">

            <img
                className="cart-product-image"
                src={product.pictureURL}
                alt={product.name}
            />

            <div className="cart-product-content">

                <div className="cart-product-header">
                    <h3>{product.name}</h3>

                    <button className="cart-product-remove" onClick={() => removeFromCart(product, "all")} >
                        <Trash2 size={18} />
                    </button>
                </div>

                <div className="cart-product-observations">
                    {product.observations?.map((observation, index) => (
                        <span key={index}>
                            {observation}
                        </span>
                    ))}
                </div>

                <div className="cart-product-bottom">

                    <div className="quantity-control">
                        <button onClick={() => removeFromCart(product, "one")}>
                            <Minus size={14} />
                        </button>

                        <span>{product.amount}</span>

                        <button onClick={() => addToCart(product)}>
                            <Plus size={14} />
                        </button>
                    </div>

                    <strong className="cart-product-price">
                        R${(product.price * product.amount).toFixed(2).replace(".", ",")}
                    </strong>

                </div>

            </div>

        </div>
    );
}