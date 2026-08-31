import { useEffect, useRef, useState } from 'react';
import "./useScrollReveal.css";

/**
 * @param {Object} options
 * @param {number} options.threshold
 * @param {boolean} options.once
 */
export default function useScrollReveal({ threshold = 0.15, once = false } = {}) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;

        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) {
                        observer.unobserve(element);
                    }
                }
                else if (!once) {
                    setIsVisible(false);
                }
            }, { threshold }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [threshold, once]);

    return {ref, isVisible};
}