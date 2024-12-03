"use client"

import { Star, ArrowRight, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer } from '@/lib/animations';
import { AnimatedButton } from '@/components/ui/animated-button';
import { useGetHomeCourses } from '@/features/courses/api/use-home-courses';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';

export const CoursesSection = () => {
    const { results: courses } = useGetHomeCourses()
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        
        if (autoScrollEnabled && scrollContainerRef.current) {
            intervalId = setInterval(() => {
                const container = scrollContainerRef.current;
                if (container) {
                    if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
                        container.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        scroll('right');
                    }
                }
            }, 5000);
        }

        return () => clearInterval(intervalId);
    }, [autoScrollEnabled]);

    const handleMouseEnter = () => setAutoScrollEnabled(false);
    const handleMouseLeave = () => setAutoScrollEnabled(true);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            const newScrollPosition = scrollContainerRef.current.scrollLeft + 
                (direction === 'left' ? -scrollAmount : scrollAmount);
            
            scrollContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || course.category?.title === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <section className="relative py-32">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[#0097A7]/2 
                    bg-[radial-gradient(#0097A7_0.5px,transparent_0.5px)] 
                    [background-size:16px_16px]" 
                />
                <div className="absolute inset-0 bg-gradient-to-b 
                    from-white/80 via-white to-[#D6620F]/5" 
                />
            </div>

            <motion.div 
                className="container relative mx-auto px-4"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.1 }}
            >
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 mb-20">
                    <motion.div 
                        variants={{
                            initial: { opacity: 0, y: 20 },
                            animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
                        }}
                        className="max-w-2xl"
                    >
                        <motion.span 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-block px-4 py-1.5 bg-[#0097A7]/10 text-sm font-semibold text-[#0097A7] rounded-full mb-4"
                        >
                            <motion.span
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                Formations Premium
                            </motion.span>
                        </motion.span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#0097A7] via-[#0097A7] to-[#D6620F] bg-clip-text text-transparent">
                            Nos Formations
                        </h2>
                        <p className="text-slate-600 text-lg">
                            Des formations complètes pour maîtriser l&apos;art de l&apos;investissement 
                            et atteindre vos objectifs financiers.
                        </p>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mb-12 flex flex-col md:flex-row gap-6 items-center"
                >
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Rechercher une formation..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 
                            focus:border-[#0097A7] focus:ring-2 focus:ring-[#0097A7]/20 
                            transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        />
                    </div>

                    <div className="flex gap-3 flex-wrap justify-center">
                        {['all', 'Débutant', 'Intermédiaire', 'Avancé'].map((category) => (
                            <motion.button
                                key={category}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                                ${selectedCategory === category 
                                    ? 'bg-[#0097A7] text-white shadow-lg shadow-[#0097A7]/20' 
                                    : 'bg-white/80 text-slate-600 hover:bg-[#0097A7]/10'}`}
                            >
                                {category === 'all' ? 'Tous les niveaux' : category}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <motion.button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-[40%] -translate-y-1/2 z-10
                        bg-white/90 backdrop-blur-sm hover:bg-white p-4 rounded-r-2xl shadow-lg
                        border border-slate-200 text-slate-700 hover:text-[#0097A7]
                        transition-all duration-300 hover:scale-110 hover:shadow-xl"
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </motion.button>

                    <motion.button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-[40%] -translate-y-1/2 z-10
                        bg-white/90 backdrop-blur-sm hover:bg-white p-4 rounded-l-2xl shadow-lg
                        border border-slate-200 text-slate-700 hover:text-[#0097A7]
                        transition-all duration-300 hover:scale-110 hover:shadow-xl"
                        whileHover={{ x: -4 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </motion.button>

                    <div 
                        ref={scrollContainerRef}
                        className="overflow-x-auto pb-8 hide-scrollbar relative mx-4 scroll-smooth"
                    >
                        <div className="flex gap-4 md:gap-6 w-max px-4">
                            <AnimatePresence>
                                {filteredCourses.map((course, index) => (
                                    <motion.div 
                                        key={course._id}
                                        initial={{ opacity: 0, x: 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ 
                                            duration: 0.5, 
                                            delay: index * 0.1,
                                            type: "spring",
                                            stiffness: 100
                                        }}
                                        viewport={{ once: true }}
                                        className="flex-shrink-0 w-[calc(100vw-4rem)] md:w-[calc((100vw-12rem)/3)] max-w-[400px] group relative 
                                        bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl 
                                        transition-all duration-500 transform hover:-translate-y-2 border border-slate-100 
                                        hover:border-[#0097A7]/20"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#0097A7]/5 
                                        to-[#D6620F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        
                                        <div className="relative h-64 overflow-hidden">
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-t from-[#0097A7]/90 via-[#0097A7]/40 to-transparent"
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                            <motion.img 
                                                src={course?.cover}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.7, ease: "easeOut" }}
                                            />
                                            <motion.div 
                                                className="absolute top-4 left-4 flex gap-2"
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                { course?.category && (
                                                    <motion.span 
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="px-4 py-1.5 bg-white/95 backdrop-blur-md text-[#0097A7] text-xs 
                                                        font-semibold rounded-full shadow-lg"
                                                    >
                                                        {course?.category?.title}
                                                    </motion.span>
                                                )}
                                            </motion.div>
                                        </div>

                                        <div className="p-8 space-y-6">
                                            <motion.h3 
                                                whileHover={{ x: 5 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                                className="text-2xl font-bold text-slate-800 group-hover:text-[#0097A7] transition-colors duration-300"
                                            >
                                                {course.title}
                                            </motion.h3>
                                            
                                            <motion.p 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-slate-600 line-clamp-3 text-sm leading-relaxed"
                                            >
                                                {course.description || 
                                                    "Découvrez une formation complète et pratique pour maîtriser les fondamentaux de l'investissement. " +
                                                    "Des stratégies éprouvées et des conseils d'experts pour atteindre vos objectifs financiers."}
                                            </motion.p>
                                            
                                            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                                <motion.div 
                                                    className="flex items-center gap-3"
                                                    whileHover={{ scale: 1.02 }}
                                                >
                                                    <motion.div 
                                                        className="flex items-center bg-[#D6620F]/10 px-3 py-1.5 rounded-full"
                                                        whileHover={{ y: -2 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <Star className="w-4 h-4 text-[#D6620F] fill-current" />
                                                        <motion.span 
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="ml-1.5 font-semibold text-sm text-[#D6620F]"
                                                        >
                                                            4.5
                                                        </motion.span>
                                                    </motion.div>
                                                    <span className="text-slate-600 text-sm font-medium">
                                                        ({course.enrollments?.length || 0} étudiants)
                                                    </span>
                                                </motion.div>
                                                <motion.div 
                                                    className="text-xl font-bold flex items-center gap-3"
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    <motion.span 
                                                        initial={{ opacity: 0.5 }}
                                                        whileInView={{ opacity: 1 }}
                                                        className="text-slate-400 text-base line-through"
                                                    >
                                                        {course.price}€
                                                    </motion.span>
                                                    <motion.span 
                                                        animate={{ 
                                                            scale: [1, 1.1, 1],
                                                            opacity: [0.7, 1, 0.7]
                                                        }}
                                                        transition={{ 
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            ease: "easeInOut"
                                                        }}
                                                        className="bg-gradient-to-r from-[#0097A7] to-[#D6620F] bg-clip-text text-transparent"
                                                    >
                                                        Gratuit
                                                    </motion.span>
                                                </motion.div>
                                            </div>

                                            <motion.div 
                                                className="pt-4"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                            >
                                                <Link href={`/courses/${course._id}`}>
                                                    <AnimatedButton 
                                                        variant="primary" 
                                                        className="w-full group bg-gradient-to-r from-[#0097A7] to-[#D6620F] hover:from-[#0097A7]/90 
                                                        hover:to-[#D6620F]/90 hover:scale-102 transition-all relative overflow-hidden"
                                                    >
                                                        <motion.span
                                                            className="absolute inset-0 bg-white/20"
                                                            initial={{ x: "-100%" }}
                                                            whileHover={{ x: "100%" }}
                                                            transition={{ duration: 0.5 }}
                                                        />
                                                        Suivre la formation
                                                        <ArrowRight className="ml-2 h-4 w-4 inline-block transition-transform group-hover:translate-x-1" />
                                                    </AnimatedButton>
                                                </Link>
                                            </motion.div>
                                        </div>

                                        <motion.div 
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r 
                                            from-[#0097A7] to-[#D6620F] transform scale-x-0 group-hover:scale-x-100 
                                            transition-transform duration-500 origin-left"
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    <motion.div 
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-3 bg-white/80 
                        backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
                    >
                        {[...Array(Math.ceil(filteredCourses.length / 3))].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-3 h-3 rounded-full cursor-pointer"
                                whileHover={{ scale: 1.2 }}
                                style={{
                                    backgroundColor: i === 0 ? '#0097A7' : 'rgba(0, 151, 167, 0.2)'
                                }}
                                animate={{
                                    scale: i === 0 ? 1.2 : 1
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
} 
