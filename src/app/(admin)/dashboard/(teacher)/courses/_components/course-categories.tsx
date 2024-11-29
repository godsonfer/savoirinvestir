"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban } from "lucide-react"

interface CourseCategoriesProps {
  categories: {
    name: string
    count: number
  }[]
}

export const CourseCategories = ({ categories }: CourseCategoriesProps) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-[#0097A7]" />
          Catégories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => (
            <div 
              key={category.name}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-sm">{category.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{category.count} cours</span>
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 
