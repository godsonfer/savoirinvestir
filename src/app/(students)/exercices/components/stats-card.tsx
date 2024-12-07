'use client'

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, CheckCircle, Trophy, Target } from "lucide-react"

interface StatsCardProps {
  title: string
  value: number
  total?: number
  type: "total" | "completed" | "available" | "earned"
}

export function StatsCard({ title, value, total, type }: StatsCardProps) {
  const icons = {
    total: BookOpen,
    completed: CheckCircle,
    available: Target,
    earned: Trophy
  }

  const colors = {
    total: "text-blue-500",
    completed: "text-green-500",
    available: "text-purple-500",
    earned: "text-yellow-500"
  }

  const bgColors = {
    total: "bg-blue-500/10 dark:bg-blue-500/20",
    completed: "bg-green-500/10 dark:bg-green-500/20",
    available: "bg-purple-500/10 dark:bg-purple-500/20",
    earned: "bg-yellow-500/10 dark:bg-yellow-500/20"
  }

  const Icon = icons[type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${bgColors[type]}`}>
              <Icon className={`h-6 w-6 ${colors[type]}`} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {title}
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {value}
                </h3>
                {total && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    / {total}
                  </span>
                )}
              </div>
              {total && (
                <Progress 
                  value={value / total * 100} 
                  className={`h-1 ${colors[type]}`} 
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 
