"use client"
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useState } from "react";
import { Search, BookOpen, Clock, Star } from "lucide-react";

export const CourseSection = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const courses = [
        {
            title: "Les Fondamentaux de l'Investissement",
            description: "Maîtrisez les bases essentielles pour débuter en investissement",
            duration: "8 heures",
            level: "Débutant",
            rating: 4.8,
            students: 1200,
            image: "/images/courses/fundamentals.jpg"
        },
        {
            title: "Trading Avancé",
            description: "Stratégies de trading sophistiquées pour les investisseurs expérimentés",
            duration: "12 heures",
            level: "Avancé",
            rating: 4.9,
            students: 850,
            image: "/images/courses/trading.jpg"
        },
        {
            title: "Investissement Immobilier",
            description: "Guide complet pour investir dans l'immobilier avec succès",
            duration: "10 heures",
            level: "Intermédiaire",
            rating: 4.7,
            students: 950,
            image: "/images/courses/real-estate.jpg"
        }
    ];

    const filteredCourses = courses.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.level.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsSearching(true);
        setSearchQuery(e.target.value);
        setTimeout(() => setIsSearching(false), 500);
    };

    return (
        <section className="py-20 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="space-y-12"
                >
                    {/* En-tête de section */}
                    <div className="text-center space-y-4">
                        <motion.h2 
                            variants={fadeInUp}
                            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50"
                        >
                            Nos Formations d&apos;Excellence
                        </motion.h2>
                        <motion.p 
                            variants={fadeInUp}
                            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                        >
                            Découvrez nos formations soigneusement conçues pour vous accompagner vers la réussite financière.
                        </motion.p>
                    </div>

                    {/* Barre de recherche améliorée */}
                    <motion.div 
                        variants={fadeInUp}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0097A7] to-[#D6620F] rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300" />
                            <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center px-4 border-r border-gray-200 dark:border-gray-700">
                                    <Search className={`w-5 h-5 ${isSearching ? 'text-[#0097A7]' : 'text-gray-500 dark:text-gray-400'}`} />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder="Rechercher par titre, description ou niveau..."
                                    className="flex-1 px-4 py-3 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 
                                    dark:placeholder-gray-400 outline-none w-full"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="px-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Message si aucun résultat */}
                        {searchQuery && filteredCourses.length === 0 && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mt-4 text-gray-600 dark:text-gray-400"
                            >
                                Aucun cours ne correspond à votre recherche
                            </motion.p>
                        )}

                        {/* Suggestions de recherche populaires */}
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            {["Débutant", "Trading", "Immobilier", "Crypto", "Bourse"].map((tag, index) => (
                                <motion.button
                                    key={tag}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => setSearchQuery(tag)}
                                    className="px-4 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                                    rounded-full border border-gray-200 dark:border-gray-700 hover:border-[#0097A7] 
                                    dark:hover:border-[#4DD0E1] transition-colors duration-300"
                                >
                                    {tag}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Liste des cours */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map((course, index) => (
                            <motion.div
                                key={course.title}
                                variants={fadeInUp}
                                custom={index}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden
                                border border-gray-200 dark:border-gray-700 group hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                    <img 
                                        src={course.image} 
                                        alt={course.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute bottom-4 left-4 z-20">
                                        <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-sm font-medium
                                        rounded-full text-[#0097A7] dark:text-[#4DD0E1]">
                                            {course.level}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="p-6 space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                                        {course.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {course.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                                            <Clock className="w-4 h-4" />
                                            <span>{course.duration}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-yellow-400" />
                                            <span className="text-gray-700 dark:text-gray-300">{course.rating}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                                                <BookOpen className="w-4 h-4" />
                                                <span>{course.students} étudiants</span>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-4 py-2 bg-gradient-to-r from-[#0097A7] to-[#D6620F] text-white
                                                rounded-lg font-medium text-sm hover:opacity-90 transition-opacity duration-300"
                                            >
                                                En savoir plus
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}; 
