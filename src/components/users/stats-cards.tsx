import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Globe, GraduationCap, UserCheck } from 'lucide-react'
import { FaChalkboard } from 'react-icons/fa'

const statsData = [
  { name: 'En ligne', value: 42, color: '#22c55e', icon: <Globe className="h-6 w-6" /> },
  { name: 'Étudiants', value: 150, color: '#3b82f6', icon: <GraduationCap className="h-6 w-6" /> },
  { name: 'Abonnés', value: 89, color: '#f59e0b', icon: <UserCheck className="h-6 w-6" /> },
  { name: 'Enseignants', value: 12, color: '#8b5cf6', icon: <FaChalkboard className="h-6 w-6" /> },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.name}
                </CardTitle>
                <div className="text-gray-400" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                className="text-3xl font-bold animate-fade-in"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
} 
