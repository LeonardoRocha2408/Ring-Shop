import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ShowProductsLayout from "./productsLayout/showProductsLayout";
import "./productsCarousel.css";

export default function ProductsCarousel({ images }) {
    const carousel = useRef(null);

    const [width, setWidth] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardWidth, setCardWidth] = useState(0);

    useEffect(() => {
        if (!carousel.current) return;

        const firstCard = carousel.current.querySelector(".product");
        const carouselInner =
            carousel.current.querySelector(".carousel-inner");

        if (firstCard && carouselInner) {
            const gap =
                parseFloat(
                    window.getComputedStyle(carouselInner).gap
                ) || 0;

            setCardWidth(firstCard.offsetWidth + gap);
        }

        const updateWidth = () => {
            if (!carousel.current) return;

            setWidth(
                Math.max(
                    0,
                    carousel.current.scrollWidth -
                    carousel.current.offsetWidth
                )
            );
        };

        updateWidth();

        window.addEventListener("resize", updateWidth);

        return () => {
            window.removeEventListener("resize", updateWidth);
        };
    }, [images]);

    function nextCard() {
        if (cardWidth <= 0) return;

        const nextPosition = (currentIndex + 1) * cardWidth;

        // Se a próxima posição já passou do limite,
        // leva diretamente para o final.
        if (nextPosition >= width) {
            setCurrentIndex(
                Math.ceil(width / cardWidth)
            );
            return;
        }

        setCurrentIndex(prev => prev + 1);
    }

    function previousCard() {
        if (currentIndex <= 0) return;

        setCurrentIndex(prev => prev - 1);
    }

    const position = Math.min(
        currentIndex * cardWidth,
        width
    );

    const isAtStart = position <= 0;
    const isAtEnd = position >= width;

    return (
        <div className="screen">

            <button
                className="carousel-button previous"
                onClick={previousCard}
                disabled={isAtStart}
                aria-label="Produto anterior"
            >
                <ChevronLeft
                    size={24}
                    strokeWidth={2}
                />
            </button>

            <motion.div
                ref={carousel}
                className="carousel"
                whileTap={{ cursor: "grabbing" }}
            >
                <motion.div
                    className="carousel-inner"
                    drag="x"
                    dragConstraints={{
                        right: 0,
                        left: -width
                    }}
                    animate={{
                        x: -position
                    }}
                    transition={{
                        type: "tween",
                        duration: 0.4
                    }}
                >
                    {images.map((image, index) => (
                        <motion.div
                            className="product"
                            key={index}
                        >
                            <ShowProductsLayout product={image} />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            <button
                className="carousel-button next"
                onClick={nextCard}
                disabled={isAtEnd}
                aria-label="Próximo produto"
            >
                <ChevronRight
                    size={24}
                    strokeWidth={2}
                />
            </button>

        </div>
    );
}