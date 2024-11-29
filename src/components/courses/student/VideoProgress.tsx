import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface VideoProgressProps {
    duration: number
    currentTime: number
}

export const VideoProgress = ({ duration, currentTime }: VideoProgressProps) => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        setProgress((currentTime / duration) * 100)
    }, [currentTime, duration])

    return (
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
                className="h-full bg-gradient-to-r from-[#0097A7] to-[#D6620F]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
            />
        </div>
    )
} 
