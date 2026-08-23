import { FaWhatsapp } from "react-icons/fa";
import amex from "../../../public/payment-forms/amex.svg"
import elo from "../../../public/payment-forms/elo.svg"
import hipercard from "../../../public/payment-forms/hipercard.svg"
import mastercard from "../../../public/payment-forms/mastercard.svg"
import pix from "../../../public/payment-forms/pix.svg"
import visa from "../../../public/payment-forms/visa.svg"
import { Phone, Mail, MapPin } from "lucide-react";
import "./footer.css";

export default function Footer() {
    return (
        <footer>
            <div className="payment-methods">
                <h2>Formas de pagamento</h2>
                <div className="payment-icons">
                    <img src={amex} />
                    <img src={elo} />
                    <img src={hipercard} />
                    <img src={mastercard} />
                    <img src={pix} />
                    <img src={visa} />
                </div>
            </div>
            <div className="footer-columns">
                <div className="about-us">
                    <h2>Sobre nós</h2>
                    <p>
                        Nós, da Aliança em Par, acreditamos fortemente que o amor é o maior tesouro do ser humano.
                        Buscamos atender todas as formas de amar, fortalecendo laços já indestrutíveis.
                        Seu grande amor requer um grande cuidado e nós estamos sempre prontos para realizar
                        o sonho de qualquer casal.

                        Cada joia que criamos carrega mais do que metais e pedras nobres; ela traduz histórias únicas, promessas sinceras e momentos inesquecíveis.
                        Nosso compromisso é transformar o seu sentimento em um símbolo eterno, lapidado com a dedicação e o afeto que a sua jornada a dois merece.


                    </p>
                </div>

                <div className="policies">
                    <ul>
                        <li>TERMOS DE USO</li>
                        <li>TROCAS E DEVOLUÇÕES</li>
                        <li>POLÍTICA DE PRIVACIDADE</li>
                        <li>CANCELAMENTO DE COMPRA</li>
                        <li>FALE CONOSCO</li>
                        <li>NOSSA HISTÓRIA</li>
                    </ul>
                </div>

                <div className="contact">
                    <h2>Entre em contato</h2>
                    <ul>
                        <li><FaWhatsapp size={18} /> (11) 96692-9643</li>
                        <li><Phone size={18} /> +5511966929643</li>
                        <li><Mail size={18} /> contato@aliancaempar.com</li>
                        <li><MapPin size={18} /> Seu endereço aqui</li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}