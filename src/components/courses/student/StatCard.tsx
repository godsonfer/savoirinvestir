import { motion } from 'framer-motion'

interface StatCardProps {
    icon: React.ReactNode
    value: string | number
    label: string
}

export const StatCard = ({ icon, value, label }: StatCardProps) => (
    <motion.div 
        whileHover={{ scale: 1.05, y: -5 }}
        className="bg-white/10 backdrop-blur-md rounded-xl p-4 transform transition-all duration-300 hover:bg-white/15 border border-white/10 hover:border-white/20"
    >
        <div className="flex items-center gap-3">
            <div className="text-white/90">{icon}</div>
            <div>
                <div className="font-bold text-xl text-white">{value}</div>
                <div className="text-sm text-white/70">{label}</div>
            </div>
        </div>
    </motion.div>
) 
