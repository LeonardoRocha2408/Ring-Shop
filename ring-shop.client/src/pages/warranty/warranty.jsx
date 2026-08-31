import AnimatedText from "../../hooks/animateText";
import "./warranty.css";

export default function Warranty() {
    const paragraphs = [
        "Na Amor em Par, cada joia é criada para eternizar momentos especiais com a máxima qualidade e precisão. Garantimos a autenticidade e a procedência dos materiais utilizados em todas as nossas peças.",
        "O que a nossa garantia cobre:",
        "Autenticidade do Material: Garantia permanente da qualidade e legitimidade do metal (Prata 925 / Ouro).",
        "Defeitos de Fabricação: Cobertura de 90 dias a partir da data de recebimento para qualquer defeito técnico ou estrutural de produção.",
        "Cravação de Pedras: Cobertura contra quedas de pedras decorrentes de falhas na estrutura de cravação dentro do prazo legal.",
        "O que a garantia não cobre:",
        "Quedas de pedras, quebras ou amassados causados por impactos, quedas ou mau uso.",
        "Desgaste natural da peça, riscos ou perda de brilho por contato com produtos químicos, perfumes ou abrasivos.",
        "Ajustes, reformas ou manutenções realizadas por terceiros fora da nossa oficina.",
        "Para acionar a sua garantia ou tirar dúvidas sobre o cuidado ideal com a sua joia, entre em contato com a nossa equipe de atendimento informando o número do seu pedido.",
    ];

    return (
        <div className="warranty">
            <h2>Termo de garantia</h2>

            {paragraphs.map((paragraph, index) => (
                <p key={index} className="warranty-text">
                    <AnimatedText
                        text={paragraph}
                        splitBy="word"
                        delay={index * 0.15}
                    />
                </p>
            ))}
        </div>
    );
}