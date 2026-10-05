/* eslint-disable no-empty */
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";
import "./mercado-pagoCheckout.css";

const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
const API_URL = import.meta.env.VITE_API_URL;
initMercadoPago(publicKey, { locale: "pt-BR" });

export default function Payment({ paymentForm, onClose, product, customerRequeriments }) {
    async function handleBuy() {
        try {
            const response = await fetch(`${API_URL}/`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Id: product.id,
                    CustomerRequeriments: customerRequeriments
                })
            })
            if (response.ok) {
                return;
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className="payment-card">
            <button
                className="mercado-pago-close"
                onClick={onClose}
            >
                ✕
            </button>

            {paymentForm === "credito" && (
                <CardPayment
                    initialization={{
                        amount: 100
                    }}
                    onSubmit={async (formData) => {
                        console.log(formData);
                    }}
                    customization={{
                        visual: {
                            hidePaymentButton: true,
                            hideFormTitle: true
                        }
                    }}
                />
            )}
            {paymentForm === "debito" && (
                <CardPayment
                    initialization={{
                        amount: 100
                    }}
                    onSubmit={async (formData) => {
                        console.log(formData);
                    }}
                    customization={{
                        visual: {
                            hidePaymentButton: true,
                            hideFormTitle: true
                        }
                    }}
                />
            )}

            <button
                className="mercado-pago-buy"
                onClick={() => handleBuy()}
            >
            COMPRAR
            </button>
        </div>
    );
}