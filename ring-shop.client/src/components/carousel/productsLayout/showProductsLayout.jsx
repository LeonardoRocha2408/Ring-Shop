import "./showProductsLayout.css";

export default function ShowProductsLayout({ product }) {
    const installmentPrice = product.price / 2;

    return (
        <div className="product-info">
            <img src={product.desktop} />
            <img src={product.pictureURL} alt={product.description} className="product-image" />
            <p className="product-description">{product.name}</p>
            <span>R$ {product.price.toFixed(2).replace(".", ",")}</span>
            <span>Até 2 vezes de R$ {installmentPrice.toFixed(2).replace(".", ",")} sem juros</span>
            <button>COMPRAR</button>
        </div>
    );
}