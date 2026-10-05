import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import PaymentForms from "../../components/payment/paymentForms";
import "./buyProduct.css";

const RING_TYPE_NAME = "Alianças";

export default function BuyProduct() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [engraving1, setEngraving1] = useState("");
    const [engraving2, setEngraving2] = useState("");
    const [size1, setSize1] = useState("");
    const [size2, setSize2] = useState("");
    const [notes, setNotes] = useState("");

    const [showPaymentForms, setShowPaymentForms] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await fetch(`${API_URL}/products/${id}`);

                if (!response.ok) {
                    throw new Error("Produto não encontrado.");
                }

                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [id]);

    if (loading) {
        return <p className="detail-status">Carregando produto...</p>;
    }

    if (error) {
        return <p className="detail-status">{error}</p>;
    }

    if (!product) {
        return null;
    }


    const isRing = product.typeName === RING_TYPE_NAME;
    const installmentPrice = product.price / 2;

    return (
        <div className="product-detail">
            <div className="product-detail-image">
                <img
                    src={product.pictureURL}
                    alt={product.description}
                />
            </div>

            <div className="product-detail-info">
                <h1 className="product-detail-name">
                    {product.description}
                </h1>

                <div className="product-detail-price">
                    <span className="price-main">
                        R$ {product.price.toFixed(2).replace(".", ",")}
                    </span>

                    <span className="price-installment">
                        2x de R$ {installmentPrice.toFixed(2).replace(".", ",")} sem juros
                    </span>

                    <span className="price-pix">
                        ou R$ {(product.price * 0.95).toFixed(2).replace(".", ",")} no Pix (5% off)
                    </span>
                </div>

                <div className="product-detail-form">
                    {isRing && (
                        <>
                            <div className="detail-field">
                                <label htmlFor="engraving1">
                                    Gravação do aro 1
                                </label>

                                <input
                                    id="engraving1"
                                    type="text"
                                    placeholder="Ex: Para sempre"
                                    value={engraving1}
                                    onChange={(e) => setEngraving1(e.target.value)}
                                />
                            </div>

                            <div className="detail-field">
                                <label htmlFor="engraving2">
                                    Gravação do aro 2
                                </label>

                                <input
                                    id="engraving2"
                                    type="text"
                                    placeholder="Ex: Com amor"
                                    value={engraving2}
                                    onChange={(e) => setEngraving2(e.target.value)}
                                />
                            </div>

                            <div className="detail-field-row">
                                <div className="detail-field">
                                    <label htmlFor="size1">
                                        Numeração do aro 1
                                    </label>

                                    <input
                                        id="size1"
                                        type="text"
                                        placeholder="Ex: 14"
                                        value={size1}
                                        onChange={(e) => setSize1(e.target.value)}
                                    />
                                </div>

                                <div className="detail-field">
                                    <label htmlFor="size2">
                                        Numeração do aro 2
                                    </label>

                                    <input
                                        id="size2"
                                        type="text"
                                        placeholder="Ex: 16"
                                        value={size2}
                                        onChange={(e) => setSize2(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="detail-field">
                        <label htmlFor="notes">
                            Observações do pedido
                        </label>

                        <textarea
                            id="notes"
                            placeholder="Alguma instrução especial? (opcional)"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>

                <button
                    className="product-detail-buy"
                    onClick={() => setShowPaymentForms(true)}
                >
                    COMPRAR
                </button>

                <PaymentForms
                    showPaymentForms={showPaymentForms}
                    onClose={() => setShowPaymentForms(false)}
                    product={product}
                    customerRequeriments={{
                        ...(isRing && {
                            engraving1,
                            engraving2,
                            size1,
                            size2
                        }),
                        notes
}}
                />
            </div>
        </div>
    );
}