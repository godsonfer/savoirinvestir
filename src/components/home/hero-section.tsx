"use client"
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useState, useEffect } from "react";
// import Image from 'next/image'

interface Candle {
    open: number;
    close: number;
    high: number;
    low: number;
    volume: number;
}

const TradingChart = () => {
    // Génération des données de bougies
    const generateCandles = (time: number) => Array.from({ length: 12 }, (_, i) => {
        const basePrice = 50 + 
            Math.sin((i + time) / 40) * 20 + 
            Math.cos((i + time) / 60) * 10;
        
        const volatility = 5 + Math.sin((i + time) / 30) * 2;
        const open = basePrice + (Math.random() - 0.5) * volatility * 0.3;
        const close = basePrice + (Math.random() - 0.5) * volatility * 0.3;
        const high = Math.max(open, close) + Math.random() * volatility * 0.2;
        const low = Math.min(open, close) - Math.random() * volatility * 0.2;
        const volume = Math.abs(Math.sin((i + time) / 20) * 50) + 20;

        return { open, close, high, low, volume };
    });

    const [time, setTime] = useState(0);
    const [candles, setCandles] = useState(generateCandles(0));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prev => prev + 0.005);
            setCandles(generateCandles(time));
        }, 300);

        return () => clearInterval(interval);
    }, [time]);

    // Calcul des moyennes mobiles
    const calculateEMA = (data: Candle[], period: number) => {
        return data.map((_, i, arr) => ({
            value: arr.slice(Math.max(0, i - period + 1), i + 1)
                .reduce((acc, curr) => acc + curr.close, 0) / Math.min(period, i + 1)
        }));
    };

    const ema20 = calculateEMA(candles, 20);
    const ema50 = calculateEMA(candles, 50);

    // Calcul du RSI
    const rsi = candles.map((candle, i, arr) => {
        if (i === 0) return 50;
        const gains = candle.close > arr[i - 1].close ? candle.close - arr[i - 1].close : 0;
        const losses = candle.close < arr[i - 1].close ? arr[i - 1].close - candle.close : 0;
        return 100 - (100 / (1 + (gains / (losses || 1))));
    });

    const allPrices = candles.flatMap(c => [c.high, c.low]);
    const minPrice = Math.min(...allPrices) - 5;
    const maxPrice = Math.max(...allPrices) + 5;
    const priceRange = maxPrice - minPrice;

    const normalizePrice = (price: number) => {
        return ((price - minPrice) / priceRange) * 100;
    };

    return (
        <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl overflow-hidden">
            {/* Grille de fond */}
            <div className="absolute inset-0">
                {[...Array(10)].map((_, i) => (
                    <div key={`grid-y-${i}`} 
                        className="absolute w-full h-[1px] bg-gray-200/20 dark:bg-gray-700/20"
                        style={{ top: `${i * 10}%` }} 
                    />
                ))}
                {[...Array(10)].map((_, i) => (
                    <div key={`grid-x-${i}`}
                        className="absolute h-full w-[1px] bg-gray-200/20 dark:bg-gray-700/20"
                        style={{ left: `${i * 10}%` }}
                    />
                ))}
            </div>

            {/* Graphique principal */}
            <div className="absolute inset-0 p-6">
                {/* Volume en arrière-plan */}
                <div className="absolute bottom-0 left-0 right-0 h-[20%]">
                    {candles.map((candle, i) => (
                        <motion.div
                            key={`volume-${i}`}
                            className={`absolute bottom-0 w-[10px] ${
                                candle.close >= candle.open 
                                    ? 'bg-[#0097A7]/20 dark:bg-[#0097A7]/30'
                                    : 'bg-[#D6620F]/20 dark:bg-[#D6620F]/30'
                            }`}
                            style={{
                                height: `${candle.volume}%`,
                                left: `${(i / (candles.length - 1)) * 70 + 15}%`,
                                transform: 'translateX(-50%)'
                            }}
                            animate={{ 
                                height: `${candle.volume}%`,
                                opacity: [0.2, 0.4, 0.2],
                            }}
                            transition={{ 
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>

                {/* Bougies et lignes */}
                <svg className="w-full h-[80%]" preserveAspectRatio="none">
                    {/* EMA 50 d'abord (en arrière-plan) */}
                    <motion.path
                        d={`M ${ema50.map((point, i) => 
                            `${(i / (ema50.length - 1)) * 95 + 10} ${100 - normalizePrice(point.value)}`
                        ).join(' L ')}`}
                        fill="none"
                        stroke="#D6620F"
                        strokeWidth="1.5"
                        strokeDasharray="3,3"
                        animate={{ 
                            d: `M ${ema50.map((point, i) => 
                                `${(i / (ema50.length - 1)) * 70 + 15} ${100 - normalizePrice(point.value)}`
                            ).join(' L ')}` 
                        }}
                        transition={{ duration: 0.2, ease: "linear" }}
                    />

                    {/* Bougies */}
                    {candles.map((candle, i) => {
                        const x = (i / (candles.length - 1)) * 95 + 10;
                        const candleWidth = 3;
                        const wickWidth = 1.5;
                        const isGreen = candle.close >= candle.open;
                        const color = isGreen ? '#0097A7' : '#D6620F';
                        const bodyTop = 100 - normalizePrice(Math.max(candle.open, candle.close));
                        const bodyBottom = 100 - normalizePrice(Math.min(candle.open, candle.close));
                        const bodyHeight = Math.max(0.5, Math.abs(normalizePrice(candle.close) - normalizePrice(candle.open)));
                        
                        return (
                            <g key={`candle-${i}`}>
                                {/* Mèche supérieure */}
                                <motion.line
                                    x1={`${x}%`}
                                    y1={`${100 - normalizePrice(candle.high)}%`}
                                    x2={`${x}%`}
                                    y2={`${bodyTop}%`}
                                    stroke={color}
                                    strokeWidth={wickWidth}
                                    strokeLinecap="round"
                                />
                                {/* Mèche inférieure */}
                                <motion.line
                                    x1={`${x}%`}
                                    y1={`${bodyBottom}%`}
                                    x2={`${x}%`}
                                    y2={`${100 - normalizePrice(candle.low)}%`}
                                    stroke={color}
                                    strokeWidth={wickWidth}
                                    strokeLinecap="round"
                                />
                                {/* Corps de la bougie */}
                                <motion.rect
                                    x={`${x - candleWidth/2}%`}
                                    y={`${bodyTop}%`}
                                    width={`${candleWidth}%`}
                                    height={`${bodyHeight}%`}
                                    fill={isGreen ? color : 'none'}
                                    stroke={color}
                                    strokeWidth={1.5}
                                    rx="1"
                                    className={isGreen ? '' : 'dark:fill-gray-900/50 fill-white/50'}
                                />
                            </g>
                        );
                    })}

                    {/* EMA 20 au premier plan */}
                    <motion.path
                        d={`M ${ema20.map((point, i) => 
                            `${(i / (ema20.length - 1)) * 95 + 10} ${100 - normalizePrice(point.value)}`
                        ).join(' L ')}`}
                        fill="none"
                        stroke="#0097A7"
                        strokeWidth="1.5"
                        strokeDasharray="3,3"
                        animate={{ 
                            d: `M ${ema20.map((point, i) => 
                                `${(i / (ema20.length - 1)) * 95 + 10} ${100 - normalizePrice(point.value)}`
                            ).join(' L ')}` 
                        }}
                        transition={{ duration: 0.2, ease: "linear" }}
                    />
                </svg>

                {/* Indicateurs et légende */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        <motion.div
                            className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-[#0097A7] border border-[#0097A7]/20"
                            animate={{ 
                                opacity: [0.7, 1, 0.7],
                                scale: [1, 1.02, 1]
                            }}
                            transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            EMA 20
                        </motion.div>
                        <motion.div
                            className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-[#D6620F] border border-[#D6620F]/20"
                            animate={{ 
                                opacity: [0.7, 1, 0.7],
                                scale: [1, 1.02, 1]
                            }}
                            transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5
                            }}
                        >
                            EMA 50
                        </motion.div>
                    </div>
                    <motion.div
                        className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                        animate={{ 
                            opacity: [0.7, 1, 0.7],
                            scale: [1, 1.02, 1]
                        }}
                        transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                    >
                        RSI: {rsi[rsi.length - 1].toFixed(1)}
                    </motion.div>
                </div>

                {/* Effet de brillance */}
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/20 dark:from-white/0 dark:to-white/10"
                    animate={{ 
                        opacity: [0.3, 0.5, 0.3],
                        background: [
                            "linear-gradient(to top right, rgba(255,255,255,0.05), rgba(255,255,255,0.2))",
                            "linear-gradient(to top right, rgba(255,255,255,0.1), rgba(255,255,255,0.3))",
                            "linear-gradient(to top right, rgba(255,255,255,0.05), rgba(255,255,255,0.2))"
                        ]
                    }}
                    transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>
        </div>
    );
};

export const HeroSection = () => {
    return (
        <section className="relative min-h-[85vh] flex items-center overflow-hidden py-12">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Colonne de texte */}
                    <motion.div 
                        className="lg:col-span-7 space-y-8"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                    >
                        <motion.span 
                            variants={fadeInUp}
                            className="inline-block px-6 py-2 bg-[#0097A7]/10 dark:bg-[#0097A7]/20 
                            text-[#0097A7] dark:text-[#4DD0E1] rounded-full text-sm font-semibold tracking-wide
                            transform hover:scale-105 transition-all duration-300
                            border border-[#0097A7]/20 dark:border-[#0097A7]/30
                            shadow-sm hover:shadow-md"
                        >
                            SAVOIR INVESTIR
                        </motion.span>

                        <motion.div variants={fadeInUp} className="space-y-6">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                                <span className="text-gray-900 dark:text-gray-50">
                                    Maîtrisez l&apos;Art de{" "}
                                </span>
                                <span className="text-[#0097A7] dark:text-[#4DD0E1] relative inline-block">
                                    l&apos;Investissement
                                    <span className="absolute bottom-0 left-0 w-full h-2 bg-[#0097A7]/20 
                                    dark:bg-[#4DD0E1]/20" />
                                </span>
                                <span className="block mt-2 bg-gradient-to-r from-[#0097A7] to-[#D6620F] 
                                bg-clip-text text-transparent">
                                    avec Excellence
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">
                                Développez votre expertise en investissement avec nos formations 
                                complètes, analyses approfondies et une communauté d&apos;investisseurs 
                                chevronnés.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-6">
                            <AnimatedButton 
                                variant="primary" 
                                className="bg-[#0097A7] hover:bg-[#0097A7]/90 text-white 
                                shadow-lg shadow-[#0097A7]/20 relative overflow-hidden group
                                px-8 py-4 text-lg font-semibold"
                            >
                                <span className="relative z-10">Découvrir nos Formations</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#D6620F] to-[#0097A7] 
                                opacity-0 group-hover:opacity-100 transition-all duration-500" />
                            </AnimatedButton>
                            <AnimatedButton 
                                variant="secondary" 
                                className="border-2 border-[#0097A7] text-[#0097A7] dark:text-[#4DD0E1]
                                hover:bg-[#0097A7]/5 dark:hover:bg-[#0097A7]/10
                                px-8 py-4 text-lg font-semibold"
                            >
                                Programme Gratuit
                            </AnimatedButton>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="flex items-center gap-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                            {[
                                { number: "15K+", label: "Investisseurs Formés" },
                                { number: "300+", label: "Heures de Formation" },
                                { number: "85%", label: "Taux de Réussite" },
                            ].map((stat, index) => (
                                <motion.div 
                                    key={index} 
                                    className="text-center"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <motion.div 
                                        className="text-2xl font-bold text-[#0097A7] dark:text-[#4DD0E1]"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                    >
                                        {stat.number}
                                    </motion.div>
                                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                    {/* Graphique de trading */}
                    <motion.div
                        className="lg:col-span-5 relative hidden lg:block"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="absolute -right-20 -top-20 -bottom-20 w-[120%] md:hidden sm:hidden lg:block">
                            <TradingChart />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}; 
