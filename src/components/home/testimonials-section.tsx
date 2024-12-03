"use client"
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

const testimonials = [
    {
        name: "Sophie Martin",
        role: "Investisseur Particulier",
        content: "INVEST MASTERY MIND a complètement transformé ma vision de l'investissement. La qualité des formations et le support de la communauté sont exceptionnels.",
        rating: 5
    },
    {
        name: "Thomas Dubois",
        role: "Trader Indépendant",
        content: "Une approche pédagogique unique et des stratégies qui ont fait leurs preuves. Je recommande vivement à tous ceux qui veulent progresser sérieusement.",
        rating: 5
    },
    {
        name: "Marie Laurent",
        role: "Entrepreneur",
        content: "Les formations sont claires, structurées et vraiment pratiques. J'ai pu mettre en application immédiatement les concepts appris.",
        rating: 5
    },
    {
        name: "Lucas Bernard",
        role: "Analyste Financier",
        content: "La profondeur des analyses et la pertinence des conseils m'ont permis d'améliorer significativement mes performances.",
        rating: 5
    },
    {
        name: "Emma Petit",
        role: "Débutante en Trading",
        content: "Parfait pour les débutants ! J'ai appris étape par étape et je me sens maintenant confiante dans mes décisions d'investissement.",
        rating: 4
    },
    {
        name: "Alexandre Durand",
        role: "Gestionnaire de Patrimoine",
        content: "Une formation complète qui aborde tous les aspects essentiels de l'investissement moderne.",
        rating: 5
    },
    {
        name: "Julie Moreau",
        role: "Investisseur Immobilier",
        content: "Les stratégies enseignées m'ont permis de diversifier efficacement mon portefeuille.",
        rating: 5
    },
    {
        name: "Nicolas Leroy",
        role: "Day Trader",
        content: "Excellentes techniques de gestion du risque. Mon trading est devenu beaucoup plus consistant.",
        rating: 4
    },
    {
        name: "Camille Roux",
        role: "Étudiante en Finance",
        content: "Un complément parfait à ma formation académique. La pratique et la théorie sont bien équilibrées.",
        rating: 5
    },
    {
        name: "Paul Mercier",
        role: "Investisseur Crypto",
        content: "La section sur les cryptomonnaies est particulièrement bien documentée et à jour.",
        rating: 5
    },
    {
        name: "Léa Simon",
        role: "Consultante Financière",
        content: "Une ressource inestimable pour tout professionnel de la finance qui veut se perfectionner.",
        rating: 5
    },
    {
        name: "Antoine Girard",
        role: "Trader Options",
        content: "Les modules sur les produits dérivés sont exceptionnels. Très technique et précis.",
        rating: 5
    },
    {
        name: "Sarah Cohen",
        role: "Business Angel",
        content: "La formation m'a donné les outils nécessaires pour mieux évaluer les opportunités d'investissement.",
        rating: 4
    },
    {
        name: "Marc Dupont",
        role: "Retraité Actif",
        content: "Parfait pour gérer activement mon portefeuille de retraite. Les stratégies sont prudentes et efficaces.",
        rating: 5
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.6 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    },
    hover: {
        y: -10,
        scale: 1.02,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10
        }
    }
};

const buttonVariants = {
    hover: {
        scale: 1.05,
        transition: {
            type: "spring",
            stiffness: 400,
        }
    },
    tap: {
        scale: 0.95
    }
};

const AUTO_SCROLL_INTERVAL = 5000; // 5 secondes

export const TestimonialsSection = () => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const scroll = (direction: 'left' | 'right') => {
        if (!carouselRef.current) return;
        
        const newIndex = direction === 'left' 
            ? Math.max(0, activeIndex - 1)
            : Math.min(testimonials.length - 1, activeIndex + 1);
            
        setActiveIndex(newIndex);
        const scrollAmount = direction === 'left' 
            ? -carouselRef.current.offsetWidth 
            : carouselRef.current.offsetWidth;
            
        carouselRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            if (activeIndex < testimonials.length - 1) {
                scroll('right');
            } else {
                // Retour au début
                setActiveIndex(0);
                if (carouselRef.current) {
                    carouselRef.current.scrollTo({
                        left: 0,
                        behavior: 'smooth'
                    });
                }
            }
        }, AUTO_SCROLL_INTERVAL);

        return () => clearInterval(interval);
    }, );

    return (
        <section className="py-24 relative overflow-hidden">
            <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-[#0097A7]/10 via-transparent to-[#D6620F]/10"
                animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear"
                }}
                style={{
                    backgroundSize: '400% 400%'
                }}
            />
            
            <motion.div 
                className="container mx-auto px-4 relative"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <div className="text-center mb-20">
                    <motion.h2 
                        className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#0097A7] to-[#D6620F] bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Ce que disent nos membres
                    </motion.h2>
                    <motion.p 
                        className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Découvrez les témoignages de nos membres qui ont transformé leur approche de l&apos;investissement
                    </motion.p>
                </div>

                <div className="flex justify-between items-center mb-6 px-4">
                    <div className="flex gap-2">
                        {testimonials.map((_, idx) => (
                            <motion.div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    idx === activeIndex 
                                        ? 'w-8 bg-[#0097A7]' 
                                        : 'w-2 bg-gray-300'
                                }`}
                                initial={false}
                                animate={{
                                    scale: idx === activeIndex ? 1.1 : 1
                                }}
                            />
                        ))}
                    </div>
                    <div className="flex gap-4">
                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => scroll('left')}
                            className="p-4 rounded-full bg-gradient-to-br from-[#0097A7] to-[#D6620F] 
                                     text-white shadow-lg backdrop-blur-sm
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     transition-all duration-300 ease-in-out
                                     hover:shadow-[#0097A7]/20 hover:shadow-xl"
                            aria-label="Précédent"
                            disabled={activeIndex === 0}
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </motion.button>
                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => scroll('right')}
                            className="p-4 rounded-full bg-gradient-to-br from-[#0097A7] to-[#D6620F] 
                                     text-white shadow-lg backdrop-blur-sm
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     transition-all duration-300 ease-in-out
                                     hover:shadow-[#0097A7]/20 hover:shadow-xl"
                            aria-label="Suivant"
                            disabled={activeIndex === testimonials.length - 1}
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </motion.button>
                    </div>
                </div>

                <div 
                    ref={carouselRef}
                    className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-8 pb-4"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            whileHover="hover"
                            viewport={{ once: true }}
                            className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 
                                     shadow-lg border border-gray-100/20 dark:border-gray-700/20
                                     flex-shrink-0 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] snap-center
                                     transform transition-shadow duration-300 hover:shadow-2xl"
                        >
                            <motion.div
                                className="absolute top-6 right-6"
                                initial={{ opacity: 0, rotate: -45 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Quote className="w-8 h-8 text-[#0097A7]/20 dark:text-[#0097A7]/40" />
                            </motion.div>
                            
                            <div className="flex items-center mb-6">
                                <div className="relative">
                                    <User className="w-16 h-16 text-[#0097A7]/20 dark:text-[#0097A7]/40" />
                                    <motion.div 
                                        className="absolute inset-0 rounded-full bg-[#0097A7]/20"
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.5, 0.2, 0.5]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                </div>
                                <div className="ml-4">
                                    <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-100">
                                        {testimonial.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                                </div>
                            </div>
                            
                            <div className="flex mb-4 space-x-1">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                    </motion.div>
                                ))}
                            </div>
                            
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                &ldquo;{testimonial.content}&rdquo;
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}; 
