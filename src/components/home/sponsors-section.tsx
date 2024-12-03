"use client"
import { motion } from "framer-motion";
import { useState } from "react";

const sponsors = [
    { name: "Trading View", link: "#" },
    { name: "TD365", link: "#" },
    { name: "Binance", link: "#" },
    { name: "MetaTrader", link: "#" },
    { name: "Admiral Markets", link: "#" },
    { name: "OctaFx", link: "#" },
    { name: "XTB", link: "#" },
];

export const SponsorsSection = () => {
    const [isHovered, setIsHovered] = useState(false);

    const animation = {
        animate: isHovered 
            ? { x: 0 } 
            : { 
                x: [0, -1920],
                transition: {
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear"
                }
            }
    };

    return (
        <section className="py-16 bg-gradient-to-b from-gray-50/30 to-gray-50/80 
        dark:from-gray-900/30 dark:to-gray-900/80 overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.h2 
                    className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    NOS PARTENAIRES DE CONFIANCE
                </motion.h2>
                
                <div className="relative max-w-5xl mx-auto">
                    <div className="absolute left-0 top-0 bottom-0 w-32 
                    bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 
                    bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent z-10" />
                    
                    <div className="flex overflow-hidden py-4"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <motion.div
                            className="flex gap-16 items-center"
                            {...animation}
                        >
                            {[...sponsors, ...sponsors].map((sponsor, index) => (
                                <motion.div 
                                    key={`${sponsor.name}-${index}`}
                                    className="flex-shrink-0"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <a 
                                        href={sponsor.link}
                                        className="relative block px-6 py-3 rounded-xl
                                        font-medium text-gray-600 dark:text-gray-300
                                        hover:text-primary-main dark:hover:text-primary-main
                                        transition-colors duration-300"
                                    >
                                        <span className="relative z-10">{sponsor.name}</span>
                                        <motion.div
                                            className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-xl"
                                            initial={{ opacity: 0 }}
                                            whileHover={{ opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </a>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}; 
