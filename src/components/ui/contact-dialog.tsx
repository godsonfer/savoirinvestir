"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mail, Phone, MapPin } from "lucide-react";
import { useNewHomeContact } from "@/features/home/add-new-contact";
import { toast } from "sonner";

interface ContactDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ContactDialog = ({ isOpen, onClose }: ContactDialogProps) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const { mutate: newHomeContact } = useNewHomeContact();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        newHomeContact({ fullName: formData.name, email: formData.email, message: formData.message }, {
            onSuccess: () => {
                toast.success("Merci pour votre message !");
                onClose();
            },
            onError: () => {
                toast.error("Une erreur est survenue lors de l'envoi de votre message.");
                onClose();
            }
        });
        onClose();
    };

    // Animation adaptative selon le device
    const dialogVariants = {
        hidden: {
            opacity: 0,
            y: window?.innerWidth < 768 ? "100%" : 20,
            scale: window?.innerWidth < 768 ? 1 : 0.95,
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                damping: window?.innerWidth < 768 ? 30 : 25,
                stiffness: window?.innerWidth < 768 ? 300 : 250,
                duration: 0.5,
            }
        },
        exit: { 
            opacity: 0,
            y: window?.innerWidth < 768 ? "100%" : 20,
            scale: window?.innerWidth < 768 ? 1 : 0.95,
            transition: { 
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay avec animation plus rapide sur mobile */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-[8px] z-50"
                    />

                    {/* Dialog avec animation adaptative */}
                    <motion.div
                        variants={dialogVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed left-0 right-0 bottom-0 z-50 
                        md:right-8 md:left-auto md:top-8 md:bottom-auto md:translate-y-0 md:translate-x-0
                        w-full md:w-[600px] h-[90vh] md:h-[85vh]
                        bg-white/90 dark:bg-gray-900/90 md:rounded-xl rounded-t-xl 
                        shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl 
                        border border-gray-100/20 dark:border-gray-700/30
                        overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex-none bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl"
                        >
                            <div className="flex justify-between items-center p-4 md:p-5 border-b 
                            border-gray-100/50 dark:border-gray-800/50">
                                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#0097A7] to-[#D6620F] 
                                bg-clip-text text-transparent tracking-tight">
                                    Contactez-nous
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 
                                    rounded-full transition-all duration-300"
                                >
                                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Contenu principal */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-4 md:p-6 space-y-6">
                                <div className="grid md:grid-cols-5 gap-6 md:gap-8">
                                    {/* Section contact */}
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="md:col-span-2 flex flex-col justify-between md:h-full gap-6"
                                    >
                                        <div className="space-y-5">
                                            <div className="flex text-sm items-center gap-3 text-gray-600 dark:text-gray-300
                                            hover:text-[#0097A7] dark:hover:text-[#0097A7] transition-colors duration-300">
                                                <Mail className="w-4 h-4 text-[#0097A7]" />
                                                <span>contact@investmasterymind.com</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                                <Phone className="w-5 h-5 text-[#0097A7]" />
                                                <span>+229 01 96 00 46 37</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                                <MapPin className="w-5 h-5 text-[#0097A7]" />
                                                <span>Bénin, Borgou, Parakou</span>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gradient-to-br from-[#0097A7]/10 to-[#D6620F]/10 
                                        rounded-md border border-gray-100/20 dark:border-gray-800/30">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Notre équipe est disponible pour répondre à toutes vos questions 
                                                du lundi au vendredi de 9h à 18h (GMT+1).
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* Formulaire */}
                                    <motion.form 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        onSubmit={handleSubmit} 
                                        className="md:col-span-3 flex flex-col gap-5"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Nom
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-md border border-gray-200/50 
                                                    dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 
                                                    text-gray-900 dark:text-gray-100 placeholder-gray-400
                                                    focus:ring-2 focus:ring-[#0097A7]/30 focus:border-transparent
                                                    transition-all duration-300 backdrop-blur-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-md border border-gray-200/50 
                                                    dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 
                                                    text-gray-900 dark:text-gray-100 placeholder-gray-400
                                                    focus:ring-2 focus:ring-[#0097A7]/30 focus:border-transparent
                                                    transition-all duration-300 backdrop-blur-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Sujet
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-md border border-gray-200/50 
                                                    dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 
                                                    text-gray-900 dark:text-gray-100 placeholder-gray-400
                                                    focus:ring-2 focus:ring-[#0097A7]/30 focus:border-transparent
                                                    transition-all duration-300 backdrop-blur-sm"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Message
                                            </label>
                                            <textarea
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full h-[150px] md:h-[180px] px-3 py-2 rounded-md 
                                                border border-gray-200/50 dark:border-gray-700/50 bg-white/50 
                                                dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 
                                                placeholder-gray-400 focus:ring-2 focus:ring-[#0097A7]/30 
                                                focus:border-transparent transition-all duration-300 
                                                backdrop-blur-sm resize-none"
                                                required
                                            />
                                        </div>
                                    </motion.form>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex-none bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl 
                            border-t border-gray-100/50 dark:border-gray-800/50 p-4 md:p-5"
                        >
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(0,151,167,0.3)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit}
                                className="w-full py-3 md:py-4 bg-gradient-to-r from-[#0097A7] to-[#D6620F] 
                                text-white font-semibold rounded-md flex items-center justify-center gap-3
                                transition-all duration-300 shadow-lg shadow-[#0097A7]/20
                                hover:shadow-xl hover:shadow-[#0097A7]/30"
                            >
                                <motion.div
                                    initial={{ x: 0 }}
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <Send className="w-5 h-5" />
                                </motion.div>
                                Envoyer le message
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}; 
