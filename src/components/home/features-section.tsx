"use client"

import { 
    LineChart, // Pour l'analyse technique
    PieChart, // Pour la diversification
    ShieldCheck, // Pour la gestion des risques
    Target, // Pour les objectifs
    GraduationCap, // Pour la formation
    Users, // Pour la communauté
} from 'lucide-react';
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
    
export const FeaturesSection = () => {
    const features = [
        {
            icon: <LineChart className="w-7 h-7" />,
            title: "Analyse Technique",
            description: "Maîtrisez les outils d'analyse technique pour identifier les meilleures opportunités",
            bgColor: "from-[#0097A7]/10 to-[#4DD0E1]/10",
            iconColor: "#0097A7"
        },
        {
            icon: <PieChart className="w-7 h-7" />,
            title: "Diversification",
            description: "Apprenez à construire un portefeuille diversifié et performant",
            bgColor: "from-[#D6620F]/10 to-[#FF8534]/10",
            iconColor: "#D6620F"
        },
        {
            icon: <ShieldCheck className="w-7 h-7" />,
            title: "Gestion des Risques",
            description: "Protégez et développez votre capital avec nos techniques éprouvées",
            bgColor: "from-[#0097A7]/10 to-[#4DD0E1]/10",
            iconColor: "#0097A7"
        },
        {
            icon: <Target className="w-7 h-7" />,
            title: "Objectifs Personnalisés",
            description: "Définissez et atteignez vos objectifs financiers avec un accompagnement sur mesure",
            bgColor: "from-[#D6620F]/10 to-[#FF8534]/10",
            iconColor: "#D6620F"
        },
        {
            icon: <GraduationCap className="w-7 h-7" />,
            title: "Formation Continue",
            description: "Accédez à des ressources pédagogiques régulièrement mises à jour",
            bgColor: "from-[#0097A7]/10 to-[#4DD0E1]/10",
            iconColor: "#0097A7"
        },
        {
            icon: <Users className="w-7 h-7" />,
            title: "Communauté d'Elite",
            description: "Rejoignez une communauté d'investisseurs ambitieux et partageant les mêmes valeurs",
            bgColor: "from-[#D6620F]/10 to-[#FF8534]/10",
            iconColor: "#D6620F"
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2 }}
        >
            <section className="py-24 bg-white dark:bg-background-main relative overflow-hidden">
                <motion.div 
                    className="container mx-auto px-4"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <motion.div 
                        className="text-center max-w-3xl mx-auto mb-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#0097A7] to-[#D6620F] bg-clip-text text-transparent">
                            L&apos;Excellence dans l&apos;Investissement
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Découvrez les piliers qui font d&apos;INVEST MASTERY MIND la référence 
                            en matière de formation à l&apos;investissement.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {features.map((feature, index) => (
                            <motion.div 
                                key={index}
                                variants={fadeIn}
                                className="relative p-8 bg-white dark:bg-background-secondary rounded-2xl 
                                border-2 border-gray-100 dark:border-border-light
                                hover:shadow-2xl dark:hover:shadow-3xl dark:hover:shadow-primary-main/10
                                transition-all duration-500 group
                                hover:border-[#0097A7]/30 dark:hover:border-[#0097A7]/40 hover:-translate-y-2"
                            >
                                <div className={`w-20 h-20 bg-gradient-to-br ${feature.bgColor} 
                                    rounded-2xl flex items-center justify-center mb-8
                                    group-hover:scale-110 group-hover:rotate-3 transition-all duration-500
                                    shadow-xl ${feature.bgColor}`}
                                >
                                    <motion.div 
                                        className="text-gradient"
                                        style={{ color: feature.iconColor }}
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {feature.icon}
                                    </motion.div>
                                </div>

                                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100
                                    group-hover:text-[#0097A7] dark:group-hover:text-[#0097A7]
                                    transition-colors duration-300"
                                >
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 
                                    group-hover:text-gray-800 dark:group-hover:text-gray-200
                                    transition-colors duration-300 leading-relaxed text-lg"
                                >
                                    {feature.description}
                                </p>

                                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent
                                    group-hover:via-white/20 dark:group-hover:via-white/5
                                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
                
                <div className="absolute top-0 right-0 -z-10 w-2/3 h-2/3 
                    bg-gradient-to-br from-[#0097A7]/10 dark:from-[#0097A7]/20 to-transparent 
                    rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 left-0 -z-10 w-2/3 h-2/3 
                    bg-gradient-to-tr from-[#D6620F]/10 dark:from-[#D6620F]/20 to-transparent 
                    rounded-full blur-[100px] animate-pulse" />
            </section>
        </motion.div>
    );
} 
