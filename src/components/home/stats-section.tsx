"use client"
import { motion, useScroll, useTransform } from "framer-motion";
import { TrendingUp, Users, Clock, Award } from 'lucide-react';

const stats = [
    {
        icon: <TrendingUp className="w-6 h-6" />,
        value: "83%",
        label: "Taux de Réussite",
        bgColor: "from-[#0097A7]/10 to-[#4DD0E1]/10",
        iconColor: "#0097A7"
    },
    {
        icon: <Users className="w-6 h-6" />,
        value: "2500+",
        label: "Membres Actifs",
        bgColor: "from-[#D6620F]/10 to-[#FF8534]/10",
        iconColor: "#D6620F"
    },
    {
        icon: <Clock className="w-6 h-6" />,
        value: "1200+",
        label: "Heures de Formation",
        bgColor: "from-[#0097A7]/10 to-[#4DD0E1]/10",
        iconColor: "#0097A7"
    },
    {
        icon: <Award className="w-6 h-6" />,
        value: "100%",
        label: "Cours Gratuits",
        bgColor: "from-[#D6620F]/10 to-[#FF8534]/10",
        iconColor: "#D6620F"
    }
];

export const StatsSection = () => {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0097A7]/10 via-transparent to-[#D6620F]/10 
                dark:from-[#0097A7]/20 dark:via-transparent dark:to-[#D6620F]/20 backdrop-blur-sm" />
            <motion.div 
                style={{ y }}
                className="container mx-auto px-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="relative group"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ 
                                duration: 0.8, 
                                delay: index * 0.15,
                                type: "spring",
                                stiffness: 100
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-white/80 dark:bg-background-secondary/90 rounded-2xl 
                                shadow-lg dark:shadow-2xl backdrop-blur-sm
                                transform group-hover:scale-[1.03] group-hover:-translate-y-1 
                                transition-all duration-500 ease-out" />
                            <div className="relative p-8 text-center">
                                <motion.div 
                                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${stat.bgColor}
                                        flex items-center justify-center transform
                                        group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}
                                    whileHover={{ rotate: 12, scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div style={{ color: stat.iconColor }}>
                                        {stat.icon}
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="text-4xl font-bold bg-gradient-to-r from-[#0097A7] to-[#D6620F] 
                                        bg-clip-text text-transparent"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ 
                                        duration: 0.8, 
                                        delay: index * 0.2,
                                        type: "spring",
                                        bounce: 0.4
                                    }}
                                >
                                    {stat.value}
                                </motion.div>
                                <p className="text-gray-600 dark:text-gray-300 mt-3 font-medium">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                className="absolute top-0 left-0 w-96 h-96 bg-[#0097A7]/10 dark:bg-[#0097A7]/20 
                    rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" 
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                className="absolute bottom-0 right-0 w-96 h-96 bg-[#D6620F]/10 dark:bg-[#D6620F]/20 
                    rounded-full blur-3xl translate-x-1/2 translate-y-1/2" 
            />
        </section>
    );
}; 
