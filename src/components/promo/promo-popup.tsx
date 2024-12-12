"use client"

import { Button } from "@/components/ui/button";
import { X, Clock, MessageCircle, BookOpen, Mail, Phone, Percent, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Variants } from "framer-motion";

interface PromoPopupProps {
    onClose: () => void;
    show: boolean;
}

// const popupVariants: Variants = {
//     hidden: { 
//         opacity: 0,
//         scale: 0.8,
//         x: 100
//     },
//     visible: { 
//         opacity: 1,
//         scale: 1,
//         x: 0,
//         transition: {
//             type: "spring",
//             damping: 25,
//             stiffness: 300
//         }
//     },
//     exit: { 
//         opacity: 0,
//         scale: 0.8,
//         x: 100,
//         transition: {
//             duration: 0.2
//         }
//     }
// };

const countdownVariants: Variants = {
    initial: { scale: 1 },
    pulse: {
        scale: 1.1,
        transition: {
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
        }
    }
};

const iconVariants: Variants = {
    initial: { scale: 1 },
    hover: { 
        scale: 1.2,
        rotate: 360,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 10
        }
    }
};

export const PromoPopup = ({ onClose, show }: PromoPopupProps) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const targetDate = new Date('2025-01-31T23:59:59');

        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!show) return null;

    return (
        <AnimatePresence mode="wait">
            {show && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="fixed bottom-4 right-4 z-50 max-w-md w-full bg-white dark:bg-background-secondary 
                    rounded-2xl shadow-2xl overflow-visible dark:shadow-black/30"
                >
                    {/* Bannière avec effet de superposition */}
                    <div className="relative h-32 bg-gradient-to-r from-[#0097A7] to-[#D6620F]">
                        <div className="absolute inset-0 opacity-20" />
                        
                        {/* Icône de promotion repositionnée */}
                        <motion.div
                            initial={{ y: -0, scale: 0 }}
                            animate={{ y: 0, scale: 1 }}
                            whileHover={{ 
                                scale: 1.1,
                                rotate: [0, -5, 10, -10, 0],
                                transition: {
                                    rotate: {
                                        duration: 0.5,
                                        ease: "easeInOut"
                                    }
                                }
                            }}
                            transition={{ 
                                type: "spring",
                                damping: 8,
                                stiffness: 100
                            }}
                            className="absolute left-1/2 -translate-x-1/2 -top-10 w-28 h-28 rounded-full 
                            bg-white dark:bg-background-secondary shadow-xl flex items-center 
                            justify-center  z-10 cursor-pointer"
                        >
                            <motion.div
                                animate={{ 
                                    rotate: 360,
                                    scale: [1, 1.1, 1],
                                    borderWidth: ["2px", "4px", "2px"]
                                }}
                                transition={{ 
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-[#0097A7]/20 to-[#D6620F]/20 
                                rounded-full border-2 border-[#0097A7]/30"
                            />
                            <motion.div
                                animate={{ 
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Gift className="w-14 h-14 text-[#0097A7]" />
                            </motion.div>
                        </motion.div>

                        {/* Badge Promo */}
                        <motion.div
                            initial={{ rotate: -15, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#0097A7] 
                            px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
                        >
                            <Percent className="w-4 h-4" />
                            <span className="font-semibold">-30%</span>
                        </motion.div>

                        {/* Bouton de fermeture */}
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/90 hover:text-white 
                            bg-black/20 hover:bg-black/40 rounded-full p-2 backdrop-blur-sm transition-all"
                        >
                            <X className="w-5 h-5" />
                        </motion.button>
                    </div>

                    {/* Contenu avec espacement amélioré */}
                    <div className="p-8 relative">
                        {/* En-tête avec animation améliorée */}
                        <motion.div 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="text-center mb-8"
                        >
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-[#0097A7] to-[#D6620F] 
                            bg-clip-text text-transparent mb-3">
                                Offre Exceptionnelle
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 text-lg">
                                Profitez de <span className="font-semibold text-[#0097A7]">-30%</span> sur tous nos programmes de suivie
                            </p>
                        </motion.div>

                        {/* Décompte avec animation améliorée */}
                        <div className="grid grid-cols-4 gap-3 mb-8">
                            {[
                                { value: timeLeft.days, label: 'Jours' },
                                { value: timeLeft.hours, label: 'Heures' },
                                { value: timeLeft.minutes, label: 'Minutes' },
                                { value: timeLeft.seconds, label: 'Secondes' }
                            ].map((item, index) => (
                                <motion.div 
                                    key={index}
                                    variants={countdownVariants}
                                    initial="initial"
                                    animate={item.value <= 5 ? "pulse" : "initial"}
                                    className="bg-gradient-to-br from-[#0097A7]/10 to-[#D6620F]/10 
                                    rounded-xl p-3 text-center border border-gray-100 dark:border-border-light
                                    hover:shadow-md transition-shadow"
                                >
                                    <div className="text-2xl font-bold text-[#0097A7]">
                                        {String(item.value).padStart(2, '0')}
                                    </div>
                                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        {item.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Avantages */}
                        <div className="space-y-3 mb-6">
                            {[
                                { icon: <Clock />, text: "Suivie jusqu'à rentabilité", color: "#0097A7" },
                                { icon: <MessageCircle />, text: "Support communautaire premium", color: "#D6620F" },
                                { icon: <BookOpen />, text: "Aide, Assistance, Support personnalisé", color: "#0097A7" }
                            ].map((item, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                                >
                                    <motion.div
                                        variants={iconVariants}
                                        initial="initial"
                                        whileHover="hover"
                                        className="w-5 h-5"
                                        style={{ color: item.color }}
                                    >
                                        {item.icon}
                                    </motion.div>
                                    <span>{item.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Contact */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-2 mb-6"
                        >
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Mail className="w-4 h-4" />
                                <a href="mailto:contact@investmasterymind.com" 
                                className="hover:text-[#0097A7] transition-colors">
                                    contact@investmasterymind.com
                                </a>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Phone className="w-4 h-4" />
                                <a href="tel:+33123456789" 
                                className="hover:text-[#0097A7] transition-colors">
                                    +229 01 96 00 46 37
                                </a>
                            </div>
                        </motion.div>

                        {/* Boutons d'action améliorés */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex gap-4"
                        >
                            <Button 
                                className="flex-1 rounded-full bg-gradient-to-r from-[#0097A7] to-[#D6620F]
                                text-white hover:opacity-90 transition-all shadow-lg shadow-primary-main/20
                                relative overflow-hidden group py-6 text-lg font-semibold"
                            >
                                <span className="relative z-10">Profiter de l&apos;offre</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#D6620F] to-[#0097A7] 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="border-2 border-gray-200 dark:border-border-light
                                hover:bg-gray-50 dark:hover:bg-background-tertiary
                                text-gray-700 dark:text-gray-300 rounded-full"
                            >
                                Plus tard
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}; 
