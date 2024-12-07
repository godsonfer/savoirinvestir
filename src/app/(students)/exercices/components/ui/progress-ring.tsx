'use client'

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
  showValue?: boolean
  color?: string
}

export function ProgressRing({
  progress,
  size = 60,
  strokeWidth = 4,
  className,
  showValue = true,
  color = "primary"
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  const colorVariants = {
    primary: "text-primary stroke-primary",
    blue: "text-blue-500 stroke-blue-500",
    green: "text-green-500 stroke-green-500",
    yellow: "text-yellow-500 stroke-yellow-500",
    red: "text-red-500 stroke-red-500"
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Cercle de fond */}
        <circle
          className="stroke-gray-200 dark:stroke-gray-700 fill-none transition-colors duration-300"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Cercle de progression */}
        <motion.circle
          className={cn("fill-none transition-colors duration-300", colorVariants[color as keyof typeof colorVariants])}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference
          }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            className={cn(
              "text-sm font-semibold",
              colorVariants[color as keyof typeof colorVariants]
            )}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            {Math.round(progress)}%
          </motion.span>
        </div>
      )}
    </div>
  )
} 
