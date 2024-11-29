import { motion } from 'framer-motion'

interface CourseBadgesProps {
    category?: string
    level?: string
}

export const CourseBadges = ({ category, level }: CourseBadgesProps) => (
    <div className="flex flex-wrap items-center gap-3">
        <motion.span 
            whileHover={{ scale: 1.05 }}
            className="px-4 py-1.5 bg-gradient-to-r from-[#0097A7] to-[#0097A7]/80 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-[#0097A7]/20 transition-all duration-300"
        >
            {category || 'Formation'} 
        </motion.span>
        <motion.span 
            whileHover={{ scale: 1.05 }}
            className="px-4 py-1.5 bg-gradient-to-r from-[#D6620F] to-[#D6620F]/80 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-[#D6620F]/20 transition-all duration-300"
        >
            {level || 'Débutant'}
        </motion.span>
    </div>
) 
