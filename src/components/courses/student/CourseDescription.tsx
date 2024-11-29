import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface CourseDescriptionProps {
    description: string
}

export const CourseDescription = ({ description }: CourseDescriptionProps) => {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className="relative">
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-lg md:text-xl text-white/90 max-w-3xl font-light leading-relaxed line-clamp-3 md:line-clamp-4"
            >
                {description}
            </motion.p>
            
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="mt-2 flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300"
                        >
                            <span className="text-sm">Voir plus</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent 
                        side="bottom" 
                        align="start"
                        className="max-w-xl bg-black/90 backdrop-blur-md border-white/10 p-4 text-white/90"
                    >
                        <p className="text-base leading-relaxed whitespace-pre-wrap">
                            {description}
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            {/* Popup pour mobile */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm md:hidden"
                        onClick={() => setIsExpanded(false)}
                    >
                        <motion.div 
                            className="bg-black/90 rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-white">Description du cours</h3>
                                <button 
                                    onClick={() => setIsExpanded(false)}
                                    className="text-white/60 hover:text-white"
                                >
                                    <ChevronUp className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-base text-white/90 leading-relaxed whitespace-pre-wrap">
                                {description}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
} 
