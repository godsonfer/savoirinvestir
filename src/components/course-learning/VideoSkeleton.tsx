import { Play } from 'lucide-react'
import { motion } from 'framer-motion'

export const VideoSkeleton = () => {
  return (
    <div className="relative w-full aspect-video bg-black/50 rounded-lg overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-black/10 to-white/5"
        animate={{
          x: ['0%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0.5, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <Play className="w-8 h-8 text-white/50" />
          </div>
          <p className="text-white/50 text-sm">
            Sélectionnez une leçon pour commencer
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="space-y-2">
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full w-1/3 bg-white/20 rounded-full"
              animate={{
                x: ['-100%', '300%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
          <div className="flex justify-between">
            <div className="w-12 h-2 bg-white/10 rounded-full" />
            <div className="w-12 h-2 bg-white/10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
} 
