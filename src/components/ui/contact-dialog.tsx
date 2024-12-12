"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mail, Phone } from "lucide-react";
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
        newHomeContact({ 
            fullName: formData.name, 
            email: formData.email, 
            message: formData.message 
        }, {
            onSuccess: () => {
                toast.success("Merci pour votre message !");
                onClose();
            },
            onError: () => {
                toast.error("Une erreur est survenue lors de l'envoi de votre message.");
            }
        });
    };

    return (
        <AnimatePresence mode="sync">
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-[5%] left-[5%] right-[5%] bottom-[5%] md:top-1/2 md:left-1/2 
                        md:-translate-x-1/2 md:-translate-y-1/2 z-50 md:h-auto md:max-h-[90vh]
                        w-[90%] md:w-full md:max-w-lg bg-white dark:bg-background-secondary 
                        rounded-2xl shadow-2xl overflow-y-auto md:overflow-hidden"
                    >
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white 
                            dark:bg-background-secondary z-10">
                                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r 
                                from-[#0097A7] to-[#D6620F] bg-clip-text text-transparent">
                                    Contactez-nous
                                </h2>
                                <motion.button
                                    whileHover={{ rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                                    dark:hover:text-gray-200 transition-colors rounded-full
                                    hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>

                            <div className="space-y-6 overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <motion.a
                                        href="mailto:contact@investmasterymind.com"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="flex items-center gap-3 p-4 rounded-xl
                                        bg-gradient-to-br from-[#0097A7]/10 to-transparent
                                        hover:from-[#0097A7]/20 transition-all duration-300
                                        group cursor-pointer"
                                    >
                                        <Mail className="w-5 h-5 text-[#0097A7] group-hover:scale-110 transition-transform" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</div>
                                            <div className="text-gray-900 dark:text-gray-100">contact@investmasterymind.com</div>
                                        </div>
                                    </motion.a>

                                    <motion.a
                                        href="tel:+22901960046"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex items-center gap-3 p-4 rounded-xl
                                        bg-gradient-to-br from-[#D6620F]/10 to-transparent
                                        hover:from-[#D6620F]/20 transition-all duration-300
                                        group cursor-pointer"
                                    >
                                        <Phone className="w-5 h-5 text-[#D6620F] group-hover:scale-110 transition-transform" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Téléphone</div>
                                            <div className="text-gray-900 dark:text-gray-100">+229 01 96 00 46 37</div>
                                        </div>
                                    </motion.a>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Nom complet
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                                                bg-white dark:bg-background-tertiary text-gray-900 dark:text-gray-100
                                                focus:ring-2 focus:ring-[#0097A7] focus:border-transparent outline-none
                                                transition-all duration-200"
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                                                bg-white dark:bg-background-tertiary text-gray-900 dark:text-gray-100
                                                focus:ring-2 focus:ring-[#0097A7] focus:border-transparent outline-none
                                                transition-all duration-200"
                                            />
                                        </motion.div>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Sujet
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                                            bg-white dark:bg-background-tertiary text-gray-900 dark:text-gray-100
                                            focus:ring-2 focus:ring-[#0097A7] focus:border-transparent outline-none
                                            transition-all duration-200"
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            required
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                                            bg-white dark:bg-background-tertiary text-gray-900 dark:text-gray-100
                                            focus:ring-2 focus:ring-[#0097A7] focus:border-transparent outline-none
                                            transition-all duration-200 resize-none"
                                        />
                                    </motion.div>
                                </form>
                            </div>

                            <div className="mt-6 md:mt-8 sticky bottom-0 bg-white dark:bg-background-secondary 
                            pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2.5 md:px-6 md:py-3 rounded-xl 
                                        border border-gray-200 dark:border-gray-700
                                        text-gray-700 dark:text-gray-300 
                                        hover:bg-gray-50 dark:hover:bg-background-tertiary
                                        transition-all duration-200 text-sm md:text-base"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2.5 md:px-6 md:py-3 rounded-xl 
                                        bg-gradient-to-r from-[#0097A7] to-[#D6620F]
                                        text-white font-medium hover:opacity-90 transition-all duration-200
                                        text-sm md:text-base flex items-center justify-center gap-2 group"
                                    >
                                        <span>Envoyer</span>
                                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}; 
