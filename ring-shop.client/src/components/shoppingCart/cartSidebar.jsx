import CartProduct from "./cartProduct";
import "./cartSidebar.css";

export default function ShoppingCart({ isOpen, onClose, cart }) {
    const total = cart.reduce(
        (acc, product) => acc + product.price * product.amount,
        0
    );

    return (
        <div
            className={`overlay ${isOpen ? "visible" : ""}`}
            onClick={onClose}
        >
            <aside
                className={`bag ${isOpen ? "open" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="cart-header">
                    <div>
                        <span className="cart-header-label">SEU PEDIDO</span>
                        <h2>Minha sacola</h2>
                    </div>

                    <button
                        className="cart-close"
                        onClick={onClose}
                        aria-label="Fechar carrinho"
                    >
                        ×
                    </button>
                </header>

                <div className="cart-divider" />

                <div className="cart-content">
                    {cart.length === 0 ? (
                        <div className="cart-empty">
                            <span className="cart-empty-icon">♡</span>
                            <h3>Sua sacola está vazia</h3>
                            <p>
                                Adicione seus produtos favoritos para continuar.
                            </p>
                        </div>
                    ) : (
                        cart.map((product) => (
                            <CartProduct
                                product={product}
                                key={product.id}
                            />
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <footer className="cart-footer">
                        <div className="cart-total">
                            <span>Total</span>

                            <strong>
                                R$ {total.toFixed(2).replace(".", ",")}
                            </strong>
                        </div>

                        <button className="checkout-button">
                            Finalizar pedido
                        </button>

                        <span className="cart-footer-message">
                            Frete e descontos calculados no checkout
                        </span>
                    </footer>
                )}
            </aside>
        </div>
    );
}