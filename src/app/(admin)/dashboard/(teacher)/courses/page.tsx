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

interface CourseWithDetails {
  _id: Id<"courses">;
  _creationTime: number;
  title: string;
  description: string;
  price?: number;
  isPublished?: boolean;
  chapters?: any[];
  enrollments?: any[];
  cover?: string;
  updatedAt?: number;
  category?: {
    _id: Id<"categories">;
    title: string;
  } | null;
  rating?: {
    rates: number[];
    average: number;
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

  const handleSort = (key: keyof CourseWithDetails, direction: "asc" | "desc") => {
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
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <CreateModal variant={variant} />
          <div className="flex items-center gap-3">
            <Button
              variant="orange"
              className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
            >
              <Calendar className="w-4 h-4" />
              <span>Evènement</span>
            </Button>
            <Button
              variant="orange"
              className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
            >
              <PiCertificate className="w-4 h-4" />
              <span>Workshop</span>
            </Button>
            <Button
              onClick={() => changeVariant('course')}
              variant="orange"
              className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Formation</span>
            </Button>
            <Button
              onClick={() => changeVariant('category')}
              variant="orange"
              className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Categorie</span>
            </Button>
          </div>
        </div>
        <CoursesSkeleton />
      </div>
    )

  }

  const totalCourses = courses?.length ?? 0

  const publishedCourses = courses?.filter((course) => course.isPublished).length ?? 0

  const totalRevenue = courses?.reduce<number>((acc, course) => {
    if (course.category && course.category.title) {
      return acc + (course.price ?? 0);
    }
    return acc;
  }, 0) ?? 0

  const totalStudents = courses?.reduce<number>((acc, course) =>
    acc + (course.enrollments?.length ?? 0), 0) ?? 0

  const totalChapters = courses?.reduce<number>((acc, course) =>
    acc + (course.chapters?.length ?? 0), 0) ?? 0

  const totalLessons = courses?.reduce<number>((acc, course) => {
    return acc + (course.chapters?.reduce((chapterAcc, chapter) => {
      return chapterAcc + (chapter.lessons?.length ?? 0)
    }, 0) ?? 0)
  }, 0) ?? 0


  const latestCourseCover = courses?.[0]?.cover

  const revenueData: { name: string; revenue: number }[] = [
    {
      name: 'Jan',
      revenue: courses?.slice(0, 3).reduce((acc: number, course) =>
        acc + (course.price ?? 0), 0) ?? 0
    },
    {
      name: 'Fév', revenue: courses?.slice(1, 4).reduce((acc: number, course) =>
        acc + (course.price ?? 0), 0) ?? 0
    },
    {
      name: 'Mar', revenue: courses?.slice(2, 5).reduce((acc: number, course) =>
        acc + (course.price ?? 0), 0) ?? 0
    },
    {
      name: 'Avr', revenue: courses?.slice(3, 6).reduce((acc: number, course) =>
        acc + (course.price ?? 0), 0) ?? 0
    },
  ]

  const enrollmentData: { name: string; students: number }[] = [
    {
      name: 'Jan',
      students: courses?.slice(0, 3).reduce((acc: number, course) =>
        acc + (course.enrollments?.length ?? 0), 0) ?? 0
    },
    {
      name: 'Fév', students: courses?.slice(1, 4).reduce((acc: number, course) =>
        acc + (course.enrollments?.length ?? 0), 0) ?? 0
    },
    {
      name: 'Mar', students: courses?.slice(2, 5).reduce((acc: number, course) =>
        acc + (course.enrollments?.length ?? 0), 0) ?? 0
    },
    {
      name: 'Avr', students: courses?.slice(3, 6).reduce((acc: number, course) =>
        acc + (course.enrollments?.length ?? 0), 0) ?? 0
    },
  ]

  const categoryDistribution = courses?.reduce<Record<string, number>>((acc, course) => {
    const category = course.category?.title ?? 'Sans catégorie'
    acc[category] = (acc[category] ?? 0) + 1
    return acc
  }, {})

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

  const formattedCourses = sortedCourses?.map(course => ({
    ...course,
    rating: {
      rates: course.rating?.rates.map(r => r.rate) || [],
      average: course.rating?.rates.reduce((acc, r) => acc + r.rate, 0) / (course.rating?.rates.length || 1) || 0
    },
    category: course.category ? {
      _id: course.category._id,
      title: course.category.title
    } : undefined,
    chapters: course.chapters?.map(chapter => ({
      _id: chapter._id,
      title: chapter.title,
      isPublished: chapter.isPublished || false,
      lessons: chapter.lessons?.map(lesson => ({
        _id: lesson._id,
        title: lesson.title,
        isPublished: lesson.isPublished || false,
        type: lesson.type === "video" ? "video" : "exercise" as const
      })) || []
    })) || []
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
            {/* <CourseActions
              courses={formattedCourses}
              onSort={handleSort}
            />
            <DataTable
              searchKey="title"
              columns={columns}
              data={tableData}
            /> */}
          </div>
        </div>
      </div>
    </div>
  )
} 
