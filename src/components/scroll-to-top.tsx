"use client"
import { ArrowUp } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = useCallback(() => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        setIsVisible(scrollY > 300);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        toggleVisibility();

        window.addEventListener("scroll", toggleVisibility, { passive: true });
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, [toggleVisibility]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    onClick={scrollToTop}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="fixed bottom-8 right-8 p-3 rounded-full 
                    bg-gradient-to-r from-[#0097A7] to-[#D6620F] text-white 
                    shadow-lg hover:shadow-xl transition-shadow duration-300
                    z-[9999] group focus:outline-none focus:ring-2 focus:ring-offset-2 
                    focus:ring-[#0097A7] md:bottom-12 md:right-12"
                    aria-label="Retourner en haut de la page"
                    title="Retourner en haut de la page"
                >
                    <motion.div
                        animate={{ 
                            y: [0, -4, 0],
                        }}
                        transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 0.5
                        }}
                    >
                        <ArrowUp className="w-6 h-6 group-hover:stroke-2" />
                    </motion.div>
                </motion.button>
            )}
        </AnimatePresence>
    );
}; 
