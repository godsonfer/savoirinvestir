"use client"
import { IconBadge } from '@/components/icon-badge'
import { NotFoundAlert } from '@/components/not-found-alert'
import { SpinLoader } from '@/components/spin-loader'

import { CircleDollarSign, File, ListChecks, LucideLayoutDashboard } from 'lucide-react'
import React from 'react'
import { TitleForm } from '../_components/title-form'
import { DescriptionForm } from '../_components/description-form'
import { ImageForm } from '../_components/image-form'
import { CategoryForm } from '../_components/category-form'
import { ChaptersForm } from '../_components/chapters-form'
import { PriceForm } from '../_components/price-form'
import { AttachmentForm } from '../_components/attachment-form'
import { Banner } from '@/components/banner'
import { Actions } from '../_components/actions'
import { useGetCourse } from '@/features/courses/api/use-get-course'
import { useCourseId } from '@/hooks/use-course-id'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useGetAttachements } from '@/features/attachments/api/use-get-attachment'

const CoursePage = () => {
    // api
    const courseId = useCourseId()
    const { data: course, isLoading: courseLoading } = useGetCourse({ courseId })
    const { data: attachments } = useGetAttachements({ courseId: courseId })
    const { data: categories, } = useGetCategories()
    // TODO: Faire un populate du cours pour avoir tous les chapitres, lecons et fichiers afin d'éviter les appels API repétés dans
    // methods
    const requiredFields = [
        course?.course.title,
        course?.course.description,
        course?.course.price,
        course?.course.cover,
        course?.chapters.length
    ]

    const totalFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length
    const canPublise = completedFields === totalFields
    if (courseLoading) {
        return <SpinLoader />
    }
    if (!course) {
        return (<NotFoundAlert message='Cours introuvable' />)
    }

    return (
        <div className='p-1'>
            {!course.course.isPublished && (
                <div className='flex'>
                    <Banner
                        label="Tant que cette formation n'est pas publiée, elle ne sera pas vision"
                    />
                    <div>
                        <Actions disabled={!canPublise} courseId={courseId} isPublished={course?.course.isPublished ?? false} />
                    </div>
                </div>
            )}
            <div className='flex justify-between items-center border-b p-2 '>
                <div className="flex flex-col gap-y-">
                    <h1 className='text-2xl font-medium'>Paramètres du cours</h1>
                    <span className='text-sm text-muted-foreground'>{completedFields}/{totalFields} paramètres terminés</span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <div className="">
                    <div className="flex items-center gap-x-2">
                        <IconBadge variant={"default"} size={"sm"} icon={LucideLayoutDashboard} />   <h2>Modifier votre formation </h2>
                    </div>
                    <TitleForm initialData={{ title: course.course.title }} courseId={courseId} />
                    <DescriptionForm initialData={{ description: course.course.description }} courseId={courseId} />
                    <ImageForm initialData={{ cover: course.course.cover }} courseId={courseId} />
                    <CategoryForm initialData={{ categoryId: course.course.categoryId }} courseId={courseId} options={categories ?? []} />
                </div>
                <div className="space-y-1">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={ListChecks} size="sm" />
                            <h2 className="">
                                Chapitres du cours
                            </h2>
                        </div>
                        <ChaptersForm variant="chapter" courseId={courseId}
                            chapters={course?.chapters?.map((chapter) => ({
                                id: chapter._id,
                                title: chapter.title,
                                isFree: chapter.isFree ?? false,
                                position: chapter.position ?? 0,
                                isPublished: chapter.isPublished ?? false
                            })) ?? []}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={CircleDollarSign} size={"sm"} />
                            <h2 className="">
                                Vendez votre formation
                            </h2>
                        </div>
                        <PriceForm
                            initialData={{ price: course.course.price }}
                            courseId={courseId}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={File} size={"sm"} />
                            <h2 className="">
                                Resources & Fichier
                            </h2>
                        </div>
                        <AttachmentForm
                            initialData={{
                                attachments: attachments?.map((attachment) => ({
                                    id: attachment._id,
                                    name: attachment.name,
                                    url: attachment.url,
                                })) ?? []
                            }}
                            courseId={courseId}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CoursePage
