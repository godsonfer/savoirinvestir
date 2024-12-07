import { useEffect, useRef } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import MuxPlayer, { MuxPlayerProps as MuxPlayerRefProps } from "@mux/mux-player-react";

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
        <div className="relative aspect-video bg-black/90">
              <MuxPlayer
                title={title}
                playbackId={playbackId}
            />

            {/* Logo watermark */}
            <div className="absolute top-6 right-6 z-20 opacity-40 pointer-events-none hover:opacity-60 transition-opacity">
                <Image 
                    src="/logo.svg" 
                    alt="Logo" 
                    width={90} 
                    height={45} 
                    className="filter brightness-0 invert drop-shadow-lg"
                />
            </div>

            {/* Loading overlay */}
            <motion.div 
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none backdrop-blur-sm"
            >
                <div className="flex flex-col items-center gap-6">
                    <Image 
                        src="/logo.svg" 
                        alt="Logo" 
                        width={140} 
                        height={70}
                        className="animate-pulse filter brightness-0 invert drop-shadow-lg"
                    />
                    <Loader2 className="w-8 h-8 text-[#0097A7] animate-spin drop-shadow-lg" />
                </div>
            </motion.div>
        </div>
    )
} 
