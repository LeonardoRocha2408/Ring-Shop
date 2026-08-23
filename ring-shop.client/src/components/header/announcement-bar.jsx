import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import "./announcement-bar.css";

export function AnnouncementBar({ className }) {
    const messages = [
        "WELCOME OUR STORE",
        "O SIMBOLO DE UM AMOR ETERNO",
        "NSDNSIDNAONDA",
        "NDNSADAODNADOFSWFSFFFS",
        "FRETE GRÁTIS EM COMPRAS ACIMA DE R$200",
        "DESCONTO NO PIX DE 5%"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMoving, setIsMoving] = useState(false);
    const [itemWidth, setItemWidth] = useState(0);

    const wrapperRef = useRef(null);

    const VISIBLE_ITEMS = 4;
    const maxIndex = messages.length - VISIBLE_ITEMS;

    useEffect(() => {
        if (wrapperRef.current) {
            setItemWidth(wrapperRef.current.offsetWidth / VISIBLE_ITEMS);
        }

        const timer = setInterval(() => {
            handleNext()
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    function handleNext() {
        if (isMoving) return;
        setIsMoving(true);
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }

    function handlePrev() {
        if (isMoving) return;
        setIsMoving(true);
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }

    return (
        <div className={className}>
            <button onClick={handlePrev}> ‹ </button>

            <div className="announcement-track-wrapper" ref={wrapperRef}>
                <motion.div
                    className="announcement-track"
                    style={{ width: `${(messages.length / VISIBLE_ITEMS) * 100}%` }}
                    drag="x"
                    dragConstraints={{
                        left: -(maxIndex * itemWidth),
                        right: 0,
                    }}
                    dragElastic={0.1}
                    dragMomentum={false}
                    animate={{ x: -(currentIndex * itemWidth) }}
                    transition={{ type: "tween", stiffness: 400, damping: 40 }}
                    onAnimationComplete={() => setIsMoving(false)}
                    onDragEnd={(event, info) => {
                        const dragThreshold = itemWidth * 0.2;

                        if (info.offset.x < -dragThreshold) {
                            setCurrentIndex((prev) =>
                                prev >= maxIndex ? maxIndex : prev + 1
                            );
                        } else if (info.offset.x > dragThreshold) {
                            setCurrentIndex((prev) => (prev <= 0 ? 0 : prev - 1));
                        }
                    }}
                >
                    {messages.map((msg, i) => (
                        <div key={i} className="announcement-item">
                            <span>{msg}</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            <button onClick={handleNext}> › </button>
        </div>
    );
}