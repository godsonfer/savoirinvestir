"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/format"
import { BookOpen, BookOpenCheck, DollarSign, Users, Layers, Video } from "lucide-react"

interface CourseStatsProps {
  totalCourses: number
  publishedCourses: number
  totalRevenue: number
  totalStudents: number
  totalChapters: number
  totalLessons: number
}

export const CourseStats = ({
  totalCourses,
  publishedCourses,
  totalRevenue,
  totalStudents,
  totalChapters,
  totalLessons,
}: CourseStatsProps) => {
  const items = [
    {
      title: "Nombre total de formations",
      icon: BookOpen,
      value: totalCourses,
      color: "text-[#0097A7]",
      bgColor: "bg-[#0097A7]/10",
      subtitle: "Formations créées"
    },
    {
      title: "Formations publiées",
      icon: BookOpenCheck,
      value: publishedCourses,
      color: "text-emerald-700",
      bgColor: "bg-emerald-100",
      subtitle: "Formations en ligne"
    },
    {
      title: "Revenu total",
      icon: DollarSign,
      value: formatPrice(totalRevenue),
      color: "text-violet-700",
      bgColor: "bg-violet-100",
      subtitle: "Revenus générés"
    },
    {
      title: "Étudiants inscrits",
      icon: Users,
      value: totalStudents,
      color: "text-orange-700",
      bgColor: "bg-orange-100",
      subtitle: "Apprenants actifs"
    },
    {
      title: "Chapitres créés",
      icon: Layers,
      value: totalChapters,
      color: "text-pink-700",
      bgColor: "bg-pink-100",
      subtitle: "Sections de cours"
    },
    {
      title: "Leçons disponibles",
      icon: Video,
      value: totalLessons,
      color: "text-cyan-700",
      bgColor: "bg-cyan-100",
      subtitle: "Contenus pédagogiques"
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <Card 
          key={item.title} 
          className="card-hover-effect"
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div>
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">{item.subtitle}</p>
            </div>
            <div className={`p-2 rounded-full ${item.bgColor} transform transition-transform hover:scale-110`}>
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold stats-animation">{item.value}</div>
            <div className={`text-xs ${item.color} font-semibold mt-1`}>
              {typeof item.value === 'number' && (item.value > 0 ? "+" + item.value : "Aucun")} {item.title.toLowerCase()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 
