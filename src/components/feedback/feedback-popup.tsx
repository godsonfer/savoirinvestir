"use client"

import { Button } from "@/components/ui/button";
import { X, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Variants } from "framer-motion";
import { useNewWebsiteRating } from "@/features/home/new-website-rating";
import { toast } from "sonner";

interface FeedbackPopupProps {
    onClose: () => void;
    show: boolean;
}

// const overlayVariants: Variants = {
//     hidden: { opacity: 0 },
//     visible: { 
//         opacity: 1,
//         transition: {
//             duration: 0.4,
//             ease: [0.4, 0, 0.2, 1]
//         }
//     },
//     exit: { 
//         opacity: 0,
//         transition: {
//             duration: 0.3,
//             ease: [0.4, 0, 1, 1]
//         }
//     }
// };

const contentVariants: Variants = {
    hidden: { 
        opacity: 0,
        scale: 0.95,
        y: 10
    },
    visible: { 
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            damping: 30,
            stiffness: 400,
            duration: 0.4
        }
    },
    exit: { 
        opacity: 0,
        scale: 0.95,
        y: 10,
        transition: {
            duration: 0.3
        }
    }
};

const starVariants: Variants = {
    initial: { scale: 1 },
    hover: { 
        scale: 1.15,
        rotate: [0, -15, 15, 0],
        transition: {
            rotate: {
                duration: 0.5,
                ease: "easeInOut"
            }
        }
    },
    tap: { scale: 0.8 },
    selected: {
        scale: [1, 1.2, 1],
        transition: {
            duration: 0.5,
            ease: "easeInOut"
        }
    }
};

export const FeedbackPopup = ({ onClose, show }: FeedbackPopupProps) => {
    const { mutate: newWebsiteRating } = useNewWebsiteRating();
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");

    const handleSubmit = () => {
        newWebsiteRating({ rating, comment: feedback }, {
            onSuccess: () => {
                toast.success("Merci pour votre avis !");
                onClose();
            }, 
            onError: () => {
                toast.error("Une erreur est survenue lors de l'envoi de votre avis.");
                onClose();
            }
        });
    };

    return (
        <AnimatePresence mode="wait">
            {show && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="fixed bottom-4 right-4 z-50 flex items-center justify-center p-4 backdrop-blur-md"
                    onClick={(e: React.MouseEvent) => {
                        if (e.target === e.currentTarget) onClose();
                    }}
                >
                    <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-md w-full 
                        shadow-2xl dark:shadow-black/40 relative overflow-hidden
                        border border-gray-100 dark:border-zinc-800"
                    >
                        <div className="relative">
                            <div className="flex justify-between items-start mb-4">
                                <motion.h3 
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                    className="text-2xl font-bold text-gray-900 dark:text-white"
                                >
                                    Votre avis compte !
                                </motion.h3>
                                <motion.button
                                    whileHover={{ rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 
                                    dark:hover:text-gray-200 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>
                            <motion.p 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-gray-700 dark:text-gray-300 mb-6"
                            >
                                Comment évaluez-vous votre expérience avec Nous  ?
                            </motion.p>
                            <div className="flex justify-center gap-3 mb-8 bg-gray-50 dark:bg-zinc-800/50 
                            p-4 rounded-2xl">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <motion.button
                                        key={star}
                                        variants={starVariants}
                                        initial="initial"
                                        whileHover="hover"
                                        whileTap="tap"
                                        animate={star <= rating ? "selected" : "initial"}
                                        onClick={() => setRating(star)}
                                        className={`p-1 rounded-full transition-colors duration-300 ${
                                            star <= rating
                                                ? 'text-yellow-400 hover:text-yellow-500'
                                                : 'text-gray-300 dark:text-gray-600 hover:text-gray-400'
                                        }`}
                                    >
                                        <Star className="w-8 h-8 fill-current" />
                                    </motion.button>
                                ))}
                            </div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Partagez votre expérience avec nous (optionnel)"
                                    className="w-full p-4 rounded-2xl border border-gray-200 dark:border-zinc-700
                                    bg-gray-50 dark:bg-zinc-800/50 text-gray-700 dark:text-gray-300 
                                    placeholder-gray-500 dark:placeholder-gray-400
                                    mb-6 resize-none h-36 focus:ring-2 focus:ring-[#0097A7] focus:border-transparent
                                    dark:focus:ring-[#0097A7]/50 outline-none transition-all"
                                />
                                <div className="flex gap-4">
                                    <Button
                                        onClick={onClose}
                                        variant="outline"
                                        className="flex-1 border-gray-200 dark:border-border-light
                                        hover:bg-gray-50 dark:hover:bg-background-tertiary
                                        text-gray-700 dark:text-gray-300"
                                    >
                                        Plus tard
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        className="flex-1 bg-gradient-to-r from-[#0097A7] to-[#D6620F]
                                        text-white hover:opacity-95 transition-all duration-300 shadow-lg 
                                        shadow-primary-main/20 rounded-xl py-6 text-lg font-medium
                                        relative overflow-hidden group"
                                        disabled={rating === 0}
                                    >
                                        <span className="relative z-10">Envoyer</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#D6620F] to-[#0097A7] 
                                        opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out" />
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}; 
