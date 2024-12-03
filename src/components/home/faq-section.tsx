"use client"

import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { fadeIn, staggerContainer } from '@/lib/animations';

interface FAQ {
    question: string;
    answer: string;
    category: string;
}

export const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('all');

    const faqs: FAQ[] = [
        {
            question: "Comment débuter avec INVEST MASTERY MIND ?",
            answer: "Commencez par notre programme 'Fondamentaux de l'Investissement' qui pose les bases essentielles. Vous y découvrirez notre méthodologie unique et les principes fondamentaux pour devenir un investisseur averti.",
            category: "débutant"
        },
        {
            question: "Quel type d'accompagnement proposez-vous ?",
            answer: "Nous offrons un accompagnement complet : formations structurées, sessions de coaching personnalisées, analyses de marché régulières et accès à notre communauté d'investisseurs.",
            category: "accompagnement"
        },
        {
            question: "Quels sont les prérequis pour commencer ?",
            answer: "Aucun prérequis n'est nécessaire, seulement une réelle motivation à apprendre et à progresser. Nos programmes s'adaptent à tous les niveaux, du débutant à l'investisseur confirmé.",
            category: "débutant"
        },
        {
            question: "Comment accéder aux formations ?",
            answer: "Après inscription, vous avez un accès immédiat et illimité à notre plateforme de formation. Vous pouvez suivre les cours à votre rythme et revoir les contenus autant que nécessaire.",
            category: "technique"
        }
    ];

    const categories = [
        { id: 'all', label: 'Toutes les questions' },
        { id: 'débutant', label: 'Débutants' },
        { id: 'accompagnement', label: 'Accompagnement' },
        { id: 'technique', label: 'Technique' }
    ];

    const filteredFaqs = activeCategory === 'all' 
        ? faqs 
        : faqs.filter(faq => faq.category === activeCategory);

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50/50 dark:from-background-main dark:to-background-secondary/20 relative overflow-hidden" id="faq">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[#0097A7]/20 to-transparent rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-[#D6620F]/20 to-transparent rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
            
            <div className="absolute top-20 right-20 w-24 h-24 opacity-20">
                <div className="absolute w-2 h-2 bg-[#0097A7] rounded-full animate-ping" />
                <div className="absolute w-2 h-2 bg-[#0097A7] rounded-full" />
            </div>
            <div className="absolute bottom-40 left-20 w-24 h-24 opacity-20">
                <div className="absolute w-2 h-2 bg-[#D6620F] rounded-full animate-ping delay-300" />
                <div className="absolute w-2 h-2 bg-[#D6620F] rounded-full" />
            </div>

            <motion.div 
                className="container mx-auto px-4 relative"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.div 
                    variants={fadeIn} 
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <span className="inline-block px-4 py-1.5 bg-[#0097A7]/10 dark:bg-[#0097A7]/20 
                        rounded-full text-sm font-semibold text-[#0097A7] dark:text-[#0097A7]/80 mb-4">
                        FAQ
                    </span>
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#0097A7] via-[#0097A7]/80 to-[#D6620F] 
                        bg-clip-text text-transparent bg-size-200 animate-gradient">
                        Questions Fréquentes
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Trouvez rapidement des réponses à vos questions sur notre plateforme
                    </p>
                </motion.div>

                <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-6 py-2.5 rounded-full transition-all duration-300 text-sm font-medium
                                backdrop-blur-sm border border-transparent
                                ${activeCategory === category.id
                                    ? 'bg-gradient-to-r from-[#0097A7] to-[#0097A7]/80 text-white shadow-lg shadow-[#0097A7]/20 border-[#0097A7]/20'
                                    : 'bg-white/30 dark:bg-background-secondary/30 text-gray-600 dark:text-gray-400 hover:bg-[#0097A7]/10 dark:hover:bg-[#0097A7]/20 hover:border-[#0097A7]/30'
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </motion.div>

                <motion.div variants={fadeIn} className="max-w-3xl mx-auto space-y-4">
                    {filteredFaqs.map((faq, index) => (
                        <motion.div 
                            key={index}
                            className="rounded-2xl backdrop-blur-sm"
                            initial={false}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.button
                                className={`w-full flex items-center justify-between p-6 
                                rounded-xl transition-all duration-300 group border
                                ${openIndex === index 
                                    ? 'bg-gradient-to-r from-[#0097A7]/10 to-[#D6620F]/10 shadow-lg border-[#0097A7]/20'
                                    : 'bg-white/50 dark:bg-background-secondary/50 hover:bg-white/80 border-gray-100/20'}`}
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <span className={`font-medium text-left transition-colors
                                    ${openIndex === index ? 'text-[#0097A7]' : 'text-gray-900 dark:text-gray-100'}`}>
                                    {faq.question}
                                </span>
                                <motion.div
                                    animate={{ 
                                        rotate: openIndex === index ? 180 : 0,
                                        backgroundColor: openIndex === index ? '#0097A7' : 'transparent'
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className={`p-1 rounded-full ${openIndex === index ? 'bg-[#0097A7]' : 'group-hover:bg-[#0097A7]/10'}`}
                                >
                                    <ChevronDown className={`w-5 h-5 transition-colors ${openIndex === index ? 'text-white' : 'text-[#D6620F]'}`} />
                                </motion.div>
                            </motion.button>
                            
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 bg-white/30 dark:bg-background-secondary/30 
                                            backdrop-blur-sm border-x border-b border-gray-100/20 dark:border-border-light/20 
                                            rounded-b-xl shadow-inner">
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
} 
