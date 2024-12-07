"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { formatPrice } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { Id } from "../../../../../../../convex/_generated/dataModel"
import Image from "next/image"
import { BookOpen, FolderKanban, Video, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

export type CourseColumn = {
  id: Id<"courses">
  title: string
  price: number
  isPublished: boolean
  createdAt: number
  cover?: string
  totalChapters: number
  publishedChapters: number
  totalLessons: number
  publishedLessons: number
  totalExercises: number
  publishedExercises: number
  totalStudents: number
  category?: string
}

export const columns: ColumnDef<CourseColumn>[] = [
  {
    accessorKey: "title",
    header: "Formation",
    cell: ({ row }) => {
      const Cell = () => {
        const router = useRouter()
        const cover = row.original.cover
        const category = row.original.category
        const publishedChapters = row.original.publishedChapters
        const totalChapters = row.original.totalChapters
        const publishedLessons = row.original.publishedLessons
        const totalLessons = row.original.totalLessons
        const publishedExercises = row.original.publishedExercises
        const totalExercises = row.original.totalExercises

        const chaptersProgress = Math.round((publishedChapters / totalChapters) * 100) || 0
        const lessonsProgress = Math.round((publishedLessons / totalLessons) * 100) || 0
        const exercisesProgress = Math.round((publishedExercises / totalExercises) * 100) || 0

        return (
          <div 
            onClick={() => router.push(`/dashboard/courses/${row.original.id}`)}
            className="flex items-center gap-3 group hover:bg-slate-50/50 p-2 rounded-lg transition-all duration-300 cursor-pointer"
          >
            <div className="relative w-40 h-20 rounded-md overflow-hidden bg-slate-100 group-hover:shadow-lg transition-all duration-300">
              {cover && (
                <Image
                  src={cover}
                  alt={row.original.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-base font-medium group-hover:text-[#0097A7] transition-colors duration-300">
                {row.original.title}
              </p>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4 text-[#0097A7]" />
                    <span>{totalChapters} chapitres</span>
                    <span className={chaptersProgress === 100 ? "text-emerald-500" : "text-amber-500"}>
                      ({chaptersProgress}% publié)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Video className="w-4 h-4 text-[#D6620F]" />
                    <span>{totalLessons} leçons</span>
                    <span className={lessonsProgress === 100 ? "text-emerald-500" : "text-amber-500"}>
                      ({lessonsProgress}% publié)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4 text-violet-600" />
                    <span>{totalExercises} exercices</span>
                    <span className={exercisesProgress === 100 ? "text-emerald-500" : "text-amber-500"}>
                      ({exercisesProgress}% publié)
                    </span>
                  </div>
                </div>
              </div>
              {category && (
                <div className="flex items-center gap-1 mt-1">
                  <Badge 
                    variant="outline" 
                    className="bg-[#0097A7]/10 hover:bg-[#0097A7]/20 border-[#0097A7]/20 text-[#0097A7]"
                  >
                    <FolderKanban className="w-3 h-3 mr-1" />
                    {category}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )
      }
      return <Cell />
    }
  },
  {
    accessorKey: "price",
    header: "Prix",
    cell: ({ row }) => {
      const Cell = () => {
        const router = useRouter()
        return (
          <div 
            onClick={() => router.push(`/dashboard/courses/${row.original.id}`)}
            className="flex flex-col hover:bg-slate-50/50 p-2 rounded-lg transition-all duration-300 cursor-pointer"
          >
            <span className="font-medium text-[#0097A7]">{formatPrice(row.original.price)}</span>
            <span className="text-sm text-muted-foreground hover:text-[#D6620F] transition-colors duration-300">
              {row.original.totalLessons} leçons
            </span>
          </div>
        )
      }
      return <Cell />
    },
  },
  {
    accessorKey: "isPublished",
    header: "Statut",
    cell: ({ row }) => {
      const Cell = () => {
        const router = useRouter()
        return (
          <div 
            onClick={() => router.push(`/dashboard/courses/${row.original.id}`)}
            className="flex flex-col gap-1 hover:bg-slate-50/50 p-2 rounded-lg transition-all duration-300 cursor-pointer"
          >
            <Badge 
              variant={row.original.isPublished ? "default" : "destructive"}
              className={`
                ${row.original.isPublished ? 'bg-[#0097A7] hover:bg-[#0097A7]/90' : ''}
                transition-all duration-300 hover:scale-105
              `}
            >
              {row.original.isPublished ? "Publié" : "Brouillon"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(row.original.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
        )
      }
      return <Cell />
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <CellAction data={row.original} />
      </div>
    ),
  },
] 
