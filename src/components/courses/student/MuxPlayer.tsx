import { useEffect, useRef } from 'react'
import MuxPlayer from "@mux/mux-player-react";

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface MuxPlayerProps {
    playbackId: string
    title: string
    onLoad?: () => void
}

export const CourseMuxPlayer = ({ playbackId, title, onLoad }: MuxPlayerProps) => {
    const playerRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.addEventListener('loadeddata', () => {
                onLoad?.()
            })
        }
    }, [onLoad])

    return (
        <div className="relative aspect-video bg-black">
            {/* Logo watermark */}
            <div className="absolute top-4 right-4 z-20 opacity-50">
                <Image 
                    src="/logo.svg" 
                    alt="Logo" 
                    width={80} 
                    height={40} 
                    className="filter brightness-0 invert"
                />
            </div>

            {/* Loading overlay */}
            <motion.div 
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute inset-0 bg-black z-10 flex items-center justify-center"
            >
                <div className="flex flex-col items-center gap-4">
                    <Image 
                        src="/logo.svg" 
                        alt="Logo" 
                        width={120} 
                        height={60}
                        className="animate-pulse filter brightness-0 invert"
                    />
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
            </motion.div>

            <MuxPlayer
                playbackId={playbackId}
              
                title={title}
                
                metadata={{
                    video_title: title,
                    player_name: 'IMM Formation',
                }}
                themeProps={{
                    colors: {
                        accent: '#0097A7',
                    },
                }}
            />
        </div>
    )
} 
