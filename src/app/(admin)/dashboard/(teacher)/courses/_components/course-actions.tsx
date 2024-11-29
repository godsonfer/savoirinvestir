"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileSpreadsheet, Filter, SortAsc, SortDesc } from "lucide-react"
import { Course } from "@/types"
import { saveAs } from "file-saver"
import * as XLSX from "xlsx"

interface CourseActionsProps {
  courses: Course[]
  onSort: (key: keyof Course, direction: "asc" | "desc") => void
}

export const CourseActions = ({ courses, onSort }: CourseActionsProps) => {
  const exportToExcel = () => {
    const data = courses.map(course => ({
      'Titre': course.title,
      'Prix': course.price ?? 0,
      'Statut': course.isPublished ? 'Publié' : 'Brouillon',
      'Étudiants': course.enrollments?.length ?? 0,
      'Chapitres': course.chapters?.length ?? 0,
      'Date de création': new Date(course._creationTime).toLocaleDateString('fr-FR'),
      'Catégorie': course.category?.title ?? 'Sans catégorie',
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Cours")
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(dataBlob, `cours_${new Date().toISOString()}.xlsx`)
  }

  const exportToCSV = () => {
    const data = courses.map(course => ({
      'Titre': course.title,
      'Prix': course.price ?? 0,
      'Statut': course.isPublished ? 'Publié' : 'Brouillon',
      'Étudiants': course.enrollments?.length ?? 0,
      'Chapitres': course.chapters?.length ?? 0,
      'Date de création': new Date(course._creationTime).toLocaleDateString('fr-FR'),
      'Catégorie': course.category?.title ?? 'Sans catégorie',
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const csv = XLSX.utils.sheet_to_csv(ws)
    const dataBlob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    saveAs(dataBlob, `cours_${new Date().toISOString()}.csv`)
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Trier
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem onClick={() => onSort('_creationTime', 'desc')}>
            <SortDesc className="h-4 w-4 mr-2" />
            Plus récent
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort('_creationTime', 'asc')}>
            <SortAsc className="h-4 w-4 mr-2" />
            Plus ancien
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort('price', 'desc')}>
            <SortDesc className="h-4 w-4 mr-2" />
            Prix décroissant
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSort('price', 'asc')}>
            <SortAsc className="h-4 w-4 mr-2" />
            Prix croissant
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem onClick={exportToExcel}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel (.xlsx)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportToCSV}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            CSV (.csv)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 
