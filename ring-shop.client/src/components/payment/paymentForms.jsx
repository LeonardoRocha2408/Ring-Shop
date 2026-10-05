import { useState } from "react";
import { CreditCard, Landmark, Banknote } from "lucide-react";
import { SiPix } from "react-icons/si";
import Payment from "./mercado-pagoCheckout";
import "./paymentForms.css";

export default function PaymentForms({ showPaymentForms, onClose, product, customerRequeriments }) {
    const paymentForms = [
        { id: "pix", label: "Pix", icon: <SiPix size={20} color="#C9A961" /> },
        { id: "credito", label: "Cartão de crédito", icon: <CreditCard size={20} /> },
        { id: "debito", label: "Cartão de débito", icon: <CreditCard size={20} /> },
        { id: "boleto", label: "Boleto bancário", icon: <Banknote size={20} /> },
        { id: "transferencia", label: "Transferência bancária", icon: <Landmark size={20} /> },
    ];

    const [paymentForm, setPaymentForm] = useState(null);
    const closePayment = () => {
        setPaymentForm(null);
        onClose();
    };
    return (
        <div className={`overlay ${showPaymentForms ? "visible" : ""}`} onClick={closePayment}>
            <div
                className={`payment-modal ${showPaymentForms ? "open" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >

                {!paymentForm ? 
                    (
                        <>
                                <h2>Escolha a forma de pagamento</h2>
                                {paymentForms.map((form) => (
                                    <div className="payment-form-item" key={form.id} onClick={() => setPaymentForm(form.id)}>
                                        <button  >{form.icon}</button>
                                        <span>{form.label}</span>
                                    </div>
                                ))}
                        </>
                    )
                        :
                    (
                        <>
                            <Payment paymentForm={paymentForm} onClose={closePayment} product={product} customerRequeriments={customerRequeriments} />
                        </>
                    )
                }
                
            </div>
        </div>
    );
}