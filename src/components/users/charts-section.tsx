import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

const statsData = [
  { name: 'En ligne', value: 42, color: '#22c55e' },
  { name: 'Étudiants', value: 150, color: '#3b82f6' },
  { name: 'Abonnés', value: 89, color: '#f59e0b' },
  { name: 'Enseignants', value: 12, color: '#8b5cf6' },
]

const visitsData = [
  { name: 'Lun', visits: 145 },
  { name: 'Mar', visits: 232 },
  { name: 'Mer', visits: 186 },
  { name: 'Jeu', visits: 256 },
  { name: 'Ven', visits: 190 },
  { name: 'Sam', visits: 134 },
  { name: 'Dim', visits: 123 },
]

export function ChartsSection() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <motion.div {...fadeInUp} className="h-[400px]">
        <Card className="h-full hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
          <CardHeader>
            <CardTitle>Distribution des Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statsData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...fadeInUp} className="h-[400px]">
        <Card className="h-full hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
          <CardHeader>
            <CardTitle>Visites Hebdomadaires</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitsData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visits" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 
