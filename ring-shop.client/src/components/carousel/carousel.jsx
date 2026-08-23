import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "./carousel.css";

export default function Carousel({images}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(null);
    const [isMoving, setIsMoving] = useState(false);

    const handleNext = () => {
        if (isMoving) return;
        setIsMoving(true);
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }
    const handlePrevious = () => {
        if (isMoving) return;
        setIsMoving(true);
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }

    const dragThreshold = 100;
    function handleDragEnd(event, info) {
        if (info.offset.x < -dragThreshold) {
            handleNext();
        } else if (info.offset.x > dragThreshold) {
            handlePrevious();
        }
    }

    useEffect(() => {
        if (!images || images.length <= 1) return;

        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    const variants = {

        enter: (dir) => ({
            x: dir > 0 ? "100%" : "-100%", 
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (dir) => ({
            x: dir < 0 ? "100%" : "-100%", 
            opacity: 0,
        }),
    };

    return (
        <div className="carousel-container">
            <button onClick={handlePrevious} className="carousel-btn" id="prev"> <ChevronLeft size={24} /> </button>
            <AnimatePresence initial={false} custon={direction} className="carousel-wrapper">
                <motion.picture
                    key={currentIndex}
                    src={images[currentIndex]}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: {stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    onAnimationComplete={(() => { setIsMoving(false) })}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.7}
                    onDragEnd={handleDragEnd}
                    whileTap={{ cursor: "grabbing" }}
                    className="carousel-image"
                    alt={`Slide ${currentIndex + 1}`}
                >
                    <source media="(max-width: 575.98px)" srcSet={images[currentIndex].mobile} />
                    <img src={images[currentIndex].desktop} alt={`Slide ${currentIndex + 1}`} />
                </motion.picture>
            </AnimatePresence>
            <button onClick={handleNext} className="carousel-btn next" id="next"> <ChevronRight size={24} /> </button>

            <div className="carousel-dots">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === currentIndex ? "active" : ""}`}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                        aria-label={`Ir para o slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>

    );
}