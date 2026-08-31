import { motion } from "framer-motion";

/**
 * Anima um texto revelando letra por letra ou palavra por palavra.
 * Use "\n" dentro do texto para indicar uma quebra de linha —
 * ela não quebra a sequência da animação, só insere um <br />.
 *
 * Uso:
 *   <AnimatedText text="Uma promessa para toda a vida" />
 *   <AnimatedText text={"Linha um\nLinha dois"} splitBy="word" />
 */
export default function AnimatedText({
    text,
    className = "",
    delay = 0,
    splitBy = "letter", // "letter" ou "word"
    stagger,
}) {
    const lines = text.split("\n");

    const tokens = [];
    lines.forEach((line, lineIndex) => {
        const pieces = splitBy === "word" ? line.split(" ") : Array.from(line);

        pieces.forEach((piece) => {
            tokens.push({ type: splitBy, value: piece });
        });

        if (lineIndex < lines.length - 1) {
            tokens.push({ type: "break" });
        }
    });

    const defaultStagger = splitBy === "word" ? 0.06 : 0.03;

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: stagger ?? defaultStagger,
                delayChildren: delay,
            },
        },
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", damping: 12, stiffness: 100 },
        },
        hidden: {
            opacity: 0,
            y: 20,
        },
    };

    // Monta uma lista "achatada" de elementos: para cada palavra, o
    // wrapper animado E o espaço seguinte entram como itens IRMÃOS
    // no mesmo array — não um dentro do outro.
    const elements = [];
    tokens.forEach((token, index) => {
        if (token.type === "break") {
            elements.push(<br key={`br-${index}`} />);
            return;
        }

        if (token.type === "word") {
            elements.push(
                <motion.span
                    key={`word-${index}`}
                    variants={child}
                    style={{ display: "inline-block" }}
                >
                    {token.value}
                </motion.span>
            );

            // Espaço como texto solto, irmão do span acima —
            // nunca é cortado pelo navegador, e cria um ponto
            // real de quebra de linha entre as palavras.
            const nextToken = tokens[index + 1];
            if (nextToken && nextToken.type !== "break") {
                elements.push(" ");
            }
            return;
        }

        // Modo letra
        const display = token.value === " " ? "\u00A0" : token.value;
        elements.push(
            <motion.span
                key={`letter-${index}`}
                variants={child}
                style={{ display: "inline-block" }}
            >
                {display}
            </motion.span>
        );
    });

    return (
        <motion.span
            className={className}
            variants={container}
            initial="hidden"
            animate="visible"
            style={{ display: "inline" }}
        >
            {elements}
        </motion.span>
    );
}