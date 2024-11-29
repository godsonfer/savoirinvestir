/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Calendar, Plus } from "lucide-react"
import { columns } from "./_components/columns"
import { SpinLoader } from "@/components/spin-loader"
import { CourseStats } from "./_components/course-stats"
import { CourseCharts } from "./_components/course-charts"
import { CourseCategories } from "./_components/course-categories"
import { CourseUsers } from "./_components/course-users"
import { CourseActions } from "./_components/course-actions"
import { useEffect, useState } from "react"
import { CreateModal } from "../../_components/create-modal"
import { useCreateCourseModal } from "@/features/courses/store/create-course-modal"
import { PiCertificate } from "react-icons/pi"

import { useGetCourses, getCoursesReturnType } from "@/features/courses/api/use-get-courses"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { CoursesSkeleton } from "./_components/courses-skeleton"

type CourseType = {
  _id: Id<"courses">;
  title: string;
  price?: number;
  isPublished?: boolean;
  _creationTime: number;
  cover?: string;
  chapters?: {
    lessons?: any[];
  }[];
  enrollments?: any[];
  category?: {
    title: string;
  };
}

export default function CoursesPage() {
    const [_isOpen, setIsOpen] = useCreateCourseModal()
    const [variant, setVariant] = useState<"course" | "category">('course')
    const changeVariant = (variant: "course" | "category") => {
        setIsOpen(true)
        setVariant(variant)
    }

  const { results: courses } = useGetCourses()
  const [sortedCourses, setSortedCourses] = useState(courses)

  useEffect(() => {
    setSortedCourses(courses)
  }, [courses])

  const handleSort = (key: keyof CourseType, direction: "asc" | "desc") => {
    const sorted = [...(courses ?? [])].sort((a, b) => {
      const aValue = a[key]
      const bValue = b[key]

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return 0
    })

    setSortedCourses(sorted)
  }
  
  if (!courses || courses.length === 0) {
    return <CoursesSkeleton />
  }

  const totalCourses = courses?.length ?? 0

  const publishedCourses = courses?.filter((course) => course.isPublished).length ?? 0

  const totalRevenue = courses?.reduce((acc: number, course: getCoursesReturnType) => 
    acc + (course.price ?? 0), 0) ?? 0

  const totalStudents = courses?.reduce((acc: number, course: getCoursesReturnType) => 
    acc + (course.enrollments?.length ?? 0), 0) ?? 0

  const totalChapters = courses?.reduce((acc: number, course: getCoursesReturnType) => 
    acc + (course.chapters?.length ?? 0), 0) ?? 0

  const totalLessons = courses?.reduce((acc: number, course: getCoursesReturnType) => {
    return acc + course.chapters?.reduce((chapterAcc: number, chapter: any) => {
      return chapterAcc + (chapter.lessons?.length ?? 0)
    }, 0) ?? 0
  }, 0) ?? 0


  const latestCourseCover = courses?.[0]?.cover

  const revenueData: { name: string; revenue: number }[] = [
    { 
      name: 'Jan', 
      revenue: courses?.slice(0, 3).reduce((acc: number, course) => 
        acc + (course.price ?? 0), 0) ?? 0 
    },
    { name: 'Fév', revenue: courses?.slice(1, 4).reduce((acc: number, course) => 
      acc + (course.price ?? 0), 0) ?? 0 },
    { name: 'Mar', revenue: courses?.slice(2, 5).reduce((acc: number, course) => 
      acc + (course.price ?? 0), 0) ?? 0 },
    { name: 'Avr', revenue: courses?.slice(3, 6).reduce((acc: number, course) => 
      acc + (course.price ?? 0), 0) ?? 0 },
  ]

  const enrollmentData: { name: string; students: number }[] = [
    {
      name: 'Jan',
      students: courses?.slice(0, 3).reduce((acc: number, course) => 
        acc + (course.enrollments?.length ?? 0), 0) ?? 0
    },
    { name: 'Fév', students: courses?.slice(1, 4).reduce((acc: number, course) => 
      acc + (course.enrollments?.length ?? 0), 0) ?? 0 },
    { name: 'Mar', students: courses?.slice(2, 5).reduce((acc: number, course) => 
      acc + (course.enrollments?.length ?? 0), 0) ?? 0 },
    { name: 'Avr', students: courses?.slice(3, 6).reduce((acc: number, course) => 
      acc + (course.enrollments?.length ?? 0), 0) ?? 0 },
  ]

  const categoryDistribution = courses?.reduce((acc: Record<string, number>, course: getCoursesReturnType) => {
    const category = course.category?.title ?? 'Sans catégorie'
    acc[category] = (acc[category] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const categoryData: { name: string; value: number }[] = Object.entries(categoryDistribution ?? {})
    .map(([name, value]) => ({
      name,
      value,    
    }))

  const activeStudents = courses?.reduce((acc, course) => {
    const activeInCourse = course.enrollments?.filter(enrollment => {
      return true
    }).length ?? 0
    return acc + activeInCourse
  }, 0) ?? 0

  const completionRate = Math.round((publishedCourses / totalCourses) * 100) || 0
  const averageProgress = 75

  const categoriesData = Object.entries(categoryDistribution ?? {}).map(([name, count]) => ({
    name,
    count,
  })).sort((a, b) => b.count - a.count)

  const tableData = sortedCourses?.map((course) => ({
    id: course._id,
    title: course.title,
    price: course.price ?? 0,
    isPublished: course.isPublished ?? false,
    createdAt: course._creationTime,
    cover: course.cover,
    totalChapters: course.chapters?.length ?? 0,
    totalStudents: course.enrollments?.length ?? 0,
    totalLessons: course.chapters?.reduce((acc, chapter) => 
      acc + (chapter.lessons?.length ?? 0), 0) ?? 0,
  })) ?? []

  return (
    <div className="h-[100vh] overflow-hidden">
      <CreateModal variant={variant} />

      <div className="h-full overflow-y-auto scrollbar-thin">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <Heading
              title="Tableau de bord des formations"
              description="Gérez et suivez vos formations"
            />
            <div className="flex items-center gap-2">
             {/* button d'actions de création */}
            <div className="flex justify-end items-end gap-2 p-4">
                <Button variant={"orange"}><Calendar />  Evènement</Button>
                <Button variant={"orange"}><PiCertificate />  Workshop</Button>
                <Button onClick={() => changeVariant('course')} variant={"orange"}><Plus />  Formation</Button>
                <Button onClick={() => changeVariant('category')} variant={"orange"}> <Plus /> Categorie</Button>
            </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            {/* chart bar */}
            <CourseCharts 
              revenueData={revenueData}
              enrollmentData={enrollmentData}
              categoryDistribution={categoryData}
            />
            <CourseStats 
              totalCourses={totalCourses}
              publishedCourses={publishedCourses}
              totalRevenue={totalRevenue}
              totalStudents={totalStudents}
              totalChapters={totalChapters}
              totalLessons={totalLessons}
            />
       
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CourseCategories categories={categoriesData} />
              <CourseUsers 
                totalStudents={totalStudents}
                activeStudents={activeStudents}
                completionRate={completionRate}
                averageProgress={averageProgress}
              />
            </div>
            <CourseActions 
                courses={sortedCourses}
                onSort={handleSort}
              />
            <DataTable
              searchKey="title"
              columns={columns}
              data={tableData}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 
