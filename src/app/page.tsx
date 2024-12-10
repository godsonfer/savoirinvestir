"use client"
import React from "react";
import { useTheme } from 'next-themes'
import { Menu, BookOpen, BarChart2, Sun, Moon, X, Facebook, Youtube, Mail, User2, Loader, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { HeroSection } from "@/components/home/hero-section";
import { SponsorsSection } from "@/components/home/sponsors-section";
import dynamic from 'next/dynamic';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useCurrentUser } from "@/features/auth/api/user-current-user";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from 'react';

const FeaturesSection = dynamic(() => import("@/components/home/features-section").then(mod => mod.FeaturesSection), {
    ssr: true
});

const CoursesSection = dynamic(() => import("@/components/home/courses-section").then(mod => mod.CoursesSection), {
    ssr: true
});

const StatsSection = dynamic(() => import("@/components/home/stats-section").then(mod => mod.StatsSection), {
    ssr: true
});

const TestimonialsSection = dynamic(() => import("@/components/home/testimonials-section").then(mod => mod.TestimonialsSection), {
    ssr: true
});

const FAQSection = dynamic(() => import("@/components/home/faq-section").then(mod => mod.FAQSection), {
    ssr: true
});

const Footer = dynamic(() => import("@/components/home/footer").then(mod => mod.Footer), {
    ssr: true
});

const PromoPopup = dynamic(() => import("@/components/promo/promo-popup").then(mod => mod.PromoPopup), {
    ssr: false
});

const FeedbackPopup = dynamic(() => import("@/components/feedback/feedback-popup").then(mod => mod.FeedbackPopup), {
    ssr: false
});

const ContactDialog = dynamic(() => import("@/components/ui/contact-dialog").then(mod => mod.ContactDialog), {
    ssr: false
});

const Bubble = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
    <motion.div
        className={`absolute rounded-full mix-blend-multiply filter blur-xl opacity-70 
        animate-float ${className}`}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
        }}
        transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay,
        }}
    />
);

const FloatingParticle = ({ className }: { className?: string }) => (
    <motion.div
        className={`absolute w-1 h-1 rounded-full ${className}`}
        animate={{
            y: [0, -100],
            x: [0, Math.random() * 50 - 25],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
        }}
        transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeOut",
            delay: Math.random() * 5,
        }}
    />
);

const menuVariants = {
    closed: {
        opacity: 0,
        height: 0,
        transition: {
            duration: 0.2,
            ease: "easeInOut"
        }
    },
    open: {
        opacity: 1,
        height: "auto",
        transition: {
            duration: 0.2,
            ease: "easeInOut"
        }
    }
};

const itemVariants = {
    closed: { x: 0, opacity: 0 },
    open: (i: number) => ({
        x: 0,
        opacity: 1,
        transition: {
            delay: i * 0.05,
            duration: 0.2
        }
    })
};

// Modifions d'abord le type NavigationItem
type NavigationItem = {
    label: string;
    id: string;
    href: string;
    icon: React.ReactNode;
}

// Composant de chargement pour les sections
const SectionLoader = () => (
    <div className="w-full h-96 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-2xl" />
);

export default function Home() {
    const { data: session, isLoading } = useCurrentUser();
    const { setTheme, theme } = useTheme()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showPromo, setShowPromo] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        // Afficher le popup de feedback après 30 secondes
        const timer = setTimeout(() => {
            setShowFeedback(true);
        }, 30000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Puis modifions la façon dont nous gérons les navigationItems
    const navigationItems = React.useMemo(() => {
        const baseItems: NavigationItem[] = [
            { 
                label: 'Formation', 
                id: 'courses', 
                href: '/courses', 
                icon: <BookOpen className="w-4 h-4" /> 
            },
            { 
                label: 'Communauté', 
                id: 'testimonials', 
                href: '/workspace', 
                icon: <BarChart2 className="w-4 h-4" /> 
            }
        ];

        if (isLoading) {
            return [
                ...baseItems,
                { 
                    label: 'Chargement...', 
                    id: 'loading', 
                    href: '#', 
                    icon: <Loader className="w-4 h-4 animate-spin" /> 
                }
            ];
        }

        if (session) {
            return [
                ...baseItems,
                { 
                    label: 'Dashboard', 
                    id: 'dashboard', 
                    href: '/bookmarks', 
                    icon: session.image ? (
                        <Avatar className="w-6 h-6">
                            <AvatarImage src={session.image} alt={session.name || ''} />
                            <AvatarFallback>{session.name?.[0]}</AvatarFallback>
                        </Avatar>
                    ) : (
                        <User2 className="w-4 h-4" />
                    )
                }
            ];
        }

        return [
            ...baseItems,
            { 
                label: 'Connexion', 
                id: 'login', 
                href: '/login', 
                icon: <User2 className="w-4 h-4" /> 
            }
        ];
    }, [session, isLoading]);

    const socialLinks = [
        { icon: <Facebook className="w-5 h-5" />, href: "https://web.facebook.com/godsonferdinand7/", label: "Facebook" },
        { icon: <Youtube className="w-5 h-5" />, href: "https://www.youtube.com/@investmasterymind", label: "Youtube" }
    ];

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            setIsMobileMenuOpen(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="relative w-full overflow-hidden">
            {/* Bulles d'arrière-plan */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Grandes bulles */}
                <Bubble 
                    className="w-[600px] h-[600px] left-[-10%] top-[10%] 
                    bg-gradient-to-br from-[#0097A7]/20 to-[#4DD0E1]/10 
                    dark:from-[#0097A7]/10 dark:to-[#4DD0E1]/5" 
                    delay={0}
                />
                <Bubble 
                    className="w-[700px] h-[700px] right-[-15%] top-[5%] 
                    bg-gradient-to-bl from-[#D6620F]/20 to-[#FF8534]/10 
                    dark:from-[#D6620F]/10 dark:to-[#FF8534]/5" 
                    delay={2}
                />
                <Bubble 
                    className="w-[500px] h-[500px] left-[20%] bottom-[-10%] 
                    bg-gradient-to-tr from-[#0097A7]/15 to-[#4DD0E1]/5 
                    dark:from-[#0097A7]/8 dark:to-[#4DD0E1]/3" 
                    delay={4}
                />
                <Bubble 
                    className="w-[550px] h-[550px] right-[10%] bottom-[-15%] 
                    bg-gradient-to-tl from-[#D6620F]/15 to-[#FF8534]/5 
                    dark:from-[#D6620F]/8 dark:to-[#FF8534]/3" 
                    delay={6}
                />

                {/* Petites particules flottantes */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <FloatingParticle 
                            key={i}
                            className={`
                                ${i % 2 === 0 ? 'bg-[#0097A7]' : 'bg-[#D6620F]'}
                                ${i % 4 === 0 ? 'left-[25%]' : i % 4 === 1 ? 'left-[50%]' : i % 4 === 2 ? 'left-[75%]' : 'left-[90%]'}
                                bottom-0 opacity-40 dark:opacity-20
                            `}
                        />
                    ))}
                </div>

                {/* Effet de flou global */}
                <div className="absolute inset-0 backdrop-blur-[120px] dark:backdrop-blur-[180px]
                    bg-gradient-to-b from-transparent via-white/30 to-white/50
                    dark:from-transparent dark:via-background-main/30 dark:to-background-main/50" />
            </div>

            {/* Header fixe */}
            <header className="fixed w-full top-0 z-50 border-b transition-all duration-200
                bg-white/70 dark:bg-background-main/70 border-gray-100 dark:border-border-light 
                backdrop-blur-md shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="h-20 flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <Image src="/logo.svg" alt="Logo" className="h-10 w-10" width={40} height={40} />
                            <div>
                                <div className="text-xl font-bold bg-[#0097A7]  
                                bg-clip-text text-transparent">
                                    INVEST MASTERY MIND
                                </div>
                                <div className="text-xs text-gray-300 dark:text-gray-400 font-medium">
                                    SAVOIR INVESTIR
                                </div>
                            </div>
                        </div>

                        {/* Navigation desktop */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            {navigationItems.map((item) => (
                                <Link href={item.href} key={item.id}>
                                    <button
                                        onClick={() => item.id === 'faq' ? scrollToSection(item.id) : null}
                                        className="flex items-center px-4 py-2 rounded-lg
                                        text-gray-600 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-main 
                                        hover:bg-primary-background/10 dark:hover:bg-primary-background/20
                                        transition-all duration-300 active:scale-95"
                                    >
                                        {item.icon && <span className="mr-2">{item.icon}</span>}
                                        {item.label}
                                    </button>
                                </Link>
                            ))}

                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
                             {/* Bouton Contact */}
                             <button
                                onClick={() => setIsContactOpen(true)}
                                className="flex items-center px-4 py-2 rounded-lg
                                text-gray-600 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-main 
                                hover:bg-primary-background/10 dark:hover:bg-primary-background/20
                                transition-all duration-300 active:scale-95"
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                Contact
                            </button>
                            {/* Réseaux sociaux */}
                            <div className="flex items-center space-x-1">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 
                                        hover:text-primary-main dark:hover:text-primary-main 
                                        hover:bg-primary-background/10 dark:hover:bg-primary-background/20
                                        transition-all duration-300"
                                        title={social.label}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>

                            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
                        </nav>
                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="transparent"
                                size="icon"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="hover:bg-primary-background/10 dark:hover:bg-primary-background/20"
                            >
                                {theme === 'dark' ? (
                                    <Sun className="h-5 w-5 text-primary-main" />
                                ) : (
                                    <Moon className="h-5 w-5 text-primary-main" />
                                )}
                            </Button>
                            
                            {/* Menu mobile */}
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="lg:hidden hover:bg-[#0097A7]/5 dark:hover:bg-[#0097A7]/20"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <AnimatePresence mode="wait">
                                    {isMobileMenuOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Menu mobile déroulant */}
                <AnimatePresence mode="sync">
                    {isMobileMenuOpen && (
                        <motion.div
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="lg:hidden bg-white/90 dark:bg-background-main/90 border-t 
                            border-gray-100 dark:border-border-light backdrop-blur-sm"
                        >
                            <div className="container mx-auto px-4 py-2">
                                <div className="flex flex-col space-y-1">
                                    {navigationItems.map((item, i) => (
                                        <Link href={item.href} key={item.id}>
                                            <motion.button
                                                custom={i}
                                                variants={itemVariants}
                                                initial="closed"
                                                animate="open"
                                                onClick={() => {
                                                    scrollToSection(item.id);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="flex items-center px-4 py-2 rounded-lg 
                                                text-gray-600 dark:text-gray-300 
                                                hover:text-[#0097A7] dark:hover:text-[#0097A7] 
                                                hover:bg-[#0097A7]/5 dark:hover:bg-[#0097A7]/20 
                                                transition-colors"
                                            >
                                                {item.icon && (
                                                    <span className="mr-3">
                                                        {item.icon}
                                                    </span>
                                                )}
                                                {item.label}
                                            </motion.button>
                                        </Link>
                                    ))}

                                    {/* Séparateur */}
                                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />

                                    {/* Contact */}
                                    <button
                                        onClick={() => {
                                            setIsContactOpen(true);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex items-center px-4 py-3 rounded-lg
                                        text-gray-600 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-main 
                                        hover:bg-primary-background/10 dark:hover:bg-primary-background/20
                                        transition-all duration-300 active:scale-95"
                                    >
                                        <Mail className="w-4 h-4 mr-3" />
                                        Contact
                                    </button>

                                    {/* Séparateur */}
                                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />

                                    {/* Réseaux sociaux */}
                                    <div className="px-4 py-2">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                            Suivez-nous
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {socialLinks.map((social) => (
                                                <a
                                                    key={social.label}
                                                    href={social.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-3 rounded-lg text-gray-600 dark:text-gray-300 
                                                    hover:text-primary-main dark:hover:text-primary-main 
                                                    hover:bg-primary-background/10 dark:hover:bg-primary-background/20
                                                    transition-all duration-300 flex-1 flex items-center justify-center"
                                                >
                                                    {social.icon}
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Séparateur */}
                                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />

                                    {/* Mode sombre/clair */}
                                    <button
                                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                        className="flex items-center px-4 py-3 rounded-lg
                                        text-gray-600 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-main 
                                        hover:bg-primary-background/10 dark:hover:bg-primary-background/20"
                                    >
                                        {theme === 'dark' ? (
                                            <>
                                                <Sun className="w-5 h-5 mr-3" />
                                                <span>Mode clair</span>
                                            </>
                                        ) : (
                                            <>
                                                <Moon className="w-5 h-5 mr-3" />
                                                <span>Mode sombre</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Popups */}
            <AnimatePresence>
                {showPromo && <PromoPopup show={showPromo} onClose={() => setShowPromo(false)} />}
            </AnimatePresence>
            <AnimatePresence>
                {showFeedback && <FeedbackPopup show={showFeedback} onClose={() => setShowFeedback(false)} />}
            </AnimatePresence>

            {/* Contenu principal */}
            <main className="w-full pt-20 relative">
                <section id="hero">
                    <HeroSection />
                </section>

                <SponsorsSection />

                <Suspense fallback={<SectionLoader />}>
                    <section id="stats">
                        <StatsSection />
                    </section>
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                    <section id="features">
                        <FeaturesSection />
                    </section>
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                    <section id="courses">
                        <CoursesSection />
                    </section>
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                    <section id="testimonials">
                        <TestimonialsSection />
                    </section>
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                    <section id="faq">
                        <FAQSection />
                    </section>
                </Suspense>

                <Suspense fallback={<SectionLoader />}>
                    <Footer />
                </Suspense>
            </main>
     

            {/* Ajouter le dialog de contact */}
            <ContactDialog isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

            {/* Bouton Scroll to Top */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 z-[9999] p-4 
                        bg-primary-main hover:bg-primary-dark text-white 
                        rounded-full shadow-lg transition-all duration-300"
                    >
                        <ArrowUp className="w-6 h-6 size-12" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}



