'use client'

import { useTheme } from "next-themes"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { motion } from "framer-motion"

const progressData = [
  { date: "Lun", exercises: 2, points: 20 },
  { date: "Mar", exercises: 3, points: 35 },
  { date: "Mer", exercises: 1, points: 15 },
  { date: "Jeu", exercises: 4, points: 45 },
  { date: "Ven", exercises: 2, points: 25 },
  { date: "Sam", exercises: 5, points: 60 },
  { date: "Dim", exercises: 3, points: 40 },
]

export function DetailedStats() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const textColor = isDark ? "#e2e8f0" : "#1e293b"
  const gridColor = isDark ? "rgba(226, 232, 240, 0.1)" : "rgba(30, 41, 59, 0.1)"
  const tooltipStyle = {
    backgroundColor: isDark ? "#1e293b" : "#ffffff",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="relative h-[300px] w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent rounded-xl" />
        <div className="absolute inset-0 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData}>
              <defs>
                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExercises" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                stroke={textColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke={textColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={tooltipStyle}
                labelStyle={{ color: textColor }}
                cursor={{ stroke: gridColor }}
              />
              <Line 
                type="monotone" 
                dataKey="points" 
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#3b82f6", stroke: isDark ? "#1e293b" : "#ffffff", strokeWidth: 3 }}
                fillOpacity={1}
                fill="url(#colorPoints)"
              />
              <Line 
                type="monotone" 
                dataKey="exercises" 
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#10b981", stroke: isDark ? "#1e293b" : "#ffffff", strokeWidth: 3 }}
                fillOpacity={1}
                fill="url(#colorExercises)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">Points</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">Exercices</span>
        </div>
      </div>
    </motion.div>
  )
} 
