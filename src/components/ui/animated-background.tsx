"use client"
import { motion } from "framer-motion";

export const AnimatedBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden -z-10">
            {/* Gradient de base */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-gray-100" />

            {/* Motif de points */}
            <motion.div 
                className="absolute inset-0  opacity-5"
                animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, 0] 
                }}
                transition={{ 
                    duration: 20, 
                    repeat: Infinity,
                    ease: "linear" 
                }}
            />

            {/* Cercles flottants */}
            <motion.div
                className="absolute top-20 left-20 w-64 h-64 rounded-full bg-teal-200/10"
                animate={{
                    y: [0, 50, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-blue-200/10"
                animate={{
                    y: [0, -30, 0],
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </div>
    );
}; 
