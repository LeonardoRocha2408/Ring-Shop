import "./showProductsLayout.css";

export default function ShowProductsLayout({ product }) {
    const installmentPrice = product.price / 2;

    return (
        <div className="product-info">
            <img src={product.desktop} />
            <p className="product-description">{product.description}</p>
            <span>R$ {product.price},00</span>
            <span>Até 2 vezes de R$ {installmentPrice},00 sem juros</span>
            <button>COMPRAR</button>
        </div>
    );
}