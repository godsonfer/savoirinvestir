import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Loader2 } from 'lucide-react'
import { VideoProgress } from './VideoProgress'
import { YouTubePlayer, loadYouTubeAPI, createYouTubePlayer, getYouTubeId, PlayerState } from '@/lib/youtube'

interface VideoPlayerProps {
    src: string
    title: string
    onLoad?: () => void
}

export const VideoPlayer = ({ src, title, onLoad }: VideoPlayerProps) => {
    const [player, setPlayer] = useState<YouTubePlayer | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isControlsVisible, setIsControlsVisible] = useState(true)
    const [isBuffering, setIsBuffering] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const controlsTimeoutRef = useRef<NodeJS.Timeout>()
    const videoId = getYouTubeId(src)
    const playerId = 'youtube-player'

    useEffect(() => {
        const initPlayer = async () => {
            if (!videoId) return
            try {
                await loadYouTubeAPI()
                const ytPlayer = await createYouTubePlayer(playerId, videoId)
                setPlayer(ytPlayer)
                setDuration(ytPlayer.getDuration())
                
                ytPlayer.addEventListener('onStateChange', (event: any) => {
                    setIsPlaying(event.data === PlayerState.PLAYING)
                    setIsBuffering(event.data === PlayerState.BUFFERING)
                    if (event.data === PlayerState.PLAYING) {
                        setIsLoading(false)
                        onLoad?.()
                    }
                })
            } catch (error) {
                console.error('Error initializing YouTube player:', error)
            }
        }

        initPlayer()
    }, [videoId, onLoad])

    useEffect(() => {
        if (!player) return
        const interval = setInterval(() => {
            setCurrentTime(player.getCurrentTime())
        }, 1000)
        return () => clearInterval(interval)
    }, [player])

    useEffect(() => {
        const hideControls = () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current)
            }
            controlsTimeoutRef.current = setTimeout(() => {
                if (isPlaying) {
                    setIsControlsVisible(false)
                }
            }, 3000)
        }

        hideControls()
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current)
            }
        }
    }, [isPlaying, isControlsVisible])

    const handleMouseMove = () => {
        setIsControlsVisible(true)
    }

    const togglePlay = () => {
        if (!player) return
        if (isPlaying) {
            player.pauseVideo()
        } else {
            player.playVideo()
        }
        setIsPlaying(!isPlaying)
    }

    const toggleMute = () => {
        if (!player) return
        if (isMuted) {
            player.unMute()
        } else {
            player.mute()
        }
        setIsMuted(!isMuted)
    }

    const handleSeek = (time: number) => {
        if (!player) return
        player.seekTo(time, true)
    }

    const toggleFullscreen = () => {
        if (!containerRef.current) return

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    return (
        <div 
            ref={containerRef}
            className="relative aspect-video bg-black group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
        >
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
            <AnimatePresence>
                {(isLoading || isBuffering) && (
                    <motion.div 
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
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
                )}
            </AnimatePresence>

            {/* Player */}
            <div id={playerId} className="w-full h-full" />

            {/* Play/Pause overlay */}
            <div 
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                onClick={togglePlay}
            >
                {!isPlaying && isControlsVisible && !isLoading && (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
                    >
                        <Play className="w-8 h-8 text-white" />
                    </motion.div>
                )}
            </div>

            {/* Controls overlay */}
            <AnimatePresence>
                {isControlsVisible && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0"
                    >
                        <div className="absolute inset-x-0 bottom-0 p-4">
                            <div className="space-y-2">
                                <VideoProgress 
                                    duration={duration} 
                                    currentTime={currentTime}
                                    onSeek={handleSeek}
                                />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={togglePlay}
                                            className="text-white hover:text-[#0097A7] transition-colors"
                                        >
                                            {isPlaying ? (
                                                <Pause className="w-6 h-6" />
                                            ) : (
                                                <Play className="w-6 h-6" />
                                            )}
                                        </button>
                                        <button 
                                            onClick={toggleMute}
                                            className="text-white hover:text-[#0097A7] transition-colors"
                                        >
                                            {isMuted ? (
                                                <VolumeX className="w-6 h-6" />
                                            ) : (
                                                <Volume2 className="w-6 h-6" />
                                            )}
                                        </button>
                                        <div className="text-white/80 text-sm">
                                            {formatTime(currentTime)} / {formatTime(duration)}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={toggleFullscreen}
                                            className="text-white hover:text-[#0097A7] transition-colors"
                                        >
                                            {isFullscreen ? (
                                                <Minimize2 className="w-6 h-6" />
                                            ) : (
                                                <Maximize2 className="w-6 h-6" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
} 
