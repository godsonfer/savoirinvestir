"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

interface CourseUsersProps {
  totalStudents: number
  activeStudents: number
  completionRate: number
  averageProgress: number
}

export const CourseUsers = ({
  totalStudents,
  activeStudents,
  completionRate,
  averageProgress
}: CourseUsersProps) => {
  const stats = [
    {
      label: "Étudiants inscrits",
      value: totalStudents,
      color: "text-[#0097A7]"
    },
    {
      label: "Étudiants actifs",
      value: activeStudents,
      color: "text-[#D6620F]"
    },
    {
      label: "Taux de complétion",
      value: `${completionRate}%`,
      color: "text-emerald-600"
    },
    {
      label: "Progression moyenne",
      value: `${averageProgress}%`,
      color: "text-violet-600"
    }
  ]

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-[#0097A7]" />
          Statistiques des étudiants
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className={`text-xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 
