import { Trash2, Minus, Plus } from "lucide-react";
import "./cartProduct.css";

export default function CartProduct({ product }) {
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

                    <button className="cart-product-remove">
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
                        <button>
                            <Minus size={14} />
                        </button>

                        <span>{product.quantity}</span>

                        <button>
                            <Plus size={14} />
                        </button>
                    </div>

                    <strong className="cart-product-price">
                        R${product.price.toFixed(2).replace(".", ",")}
                    </strong>

                </div>

            </div>

        </div>
    );
}