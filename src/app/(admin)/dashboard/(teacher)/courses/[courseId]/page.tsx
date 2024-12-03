"use client"
import { IconBadge } from '@/components/icon-badge'
import { NotFoundAlert } from '@/components/not-found-alert'
import { SpinLoader } from '@/components/spin-loader'
import { ScrollButton } from '@/components/scroll-button'

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
import { useGetCourse } from '@/features/courses/api/use-get-course'
import { useCourseId } from '@/hooks/use-course-id'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useGetAttachements } from '@/features/attachments/api/use-get-attachment'
import { PublishForm } from '../_components/publish-form'
import { LevelForm } from '../_components/level-form'
import { SkillsForm } from '../_components/skills-form'

const CoursePage = () => {
    // Ajoutez la ref pour le haut de la page
    const topRef = React.useRef<HTMLDivElement>(null);
    const generalInfoRef = React.useRef<HTMLDivElement>(null);
    const chaptersRef = React.useRef<HTMLDivElement>(null);
    const pricingRef = React.useRef<HTMLDivElement>(null);
    const resourcesRef = React.useRef<HTMLDivElement>(null);

    const sections = [
        { id: "top", ref: topRef, label: "Haut de page" },
        { id: "general-info", ref: generalInfoRef, label: "Informations générales" },
        { id: "chapters", ref: chaptersRef, label: "Chapitres" },
        { id: "pricing", ref: pricingRef, label: "Tarification" },
        { id: "resources", ref: resourcesRef, label: "Ressources" },
    ];

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
        <div className='p-2 max-w-7xl mx-auto relative overflow-auto'>
            <div ref={topRef}>
                {!course.course.isPublished && (
                    <div className='flex items-center justify-between bg-amber-50 rounded-lg p-4 mb-6'>
                        <Banner
                            label="Tant que cette formation n'est pas publiée, elle ne sera pas visible"
                        />
                        <PublishForm
                            initialData={{ isPublished: course?.course.isPublished ?? false }}
                            courseId={courseId}
                            canPublish={canPublise}
                        />
                       
                    </div>
                )}
                
                <div className='flex justify-between items-center border-b border-gray-200 pb-4 mb-8'>
                    <div className="flex flex-col gap-y-2">
                        <h1 className='text-3xl font-semibold text-gray-900'>Paramètres du cours</h1>
                        <div className="flex items-center gap-x-2">
                            <div className="h-4 w-4 rounded-full bg-primary"></div>
                            <span className='text-sm text-muted-foreground'>
                                {completedFields}/{totalFields} paramètres terminés
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <div className="space-y-6">
                        <div 
                            ref={generalInfoRef}
                            id="general-info"
                            data-section
                            className="bg-white rounded-lg shadow-sm p-6"
                        >
                            <div className="flex items-center gap-x-2 mb-6">
                                <IconBadge variant={"default"} size={"sm"} icon={LucideLayoutDashboard} />   
                                <h2 className="text-xl font-medium">Informations générales</h2>
                            </div>
                            <div className="space-y-6">
                                <TitleForm initialData={{ title: course.course.title }} courseId={courseId} />
                                <DescriptionForm initialData={{ description: course.course.description }} courseId={courseId} />
                                <ImageForm initialData={{ cover: course.course.cover }} courseId={courseId} />
                                <CategoryForm initialData={{ categoryId: course.course.categoryId }} courseId={courseId} options={categories ?? []} />
                                <LevelForm initialData={{ level: course.course.level }} courseId={courseId} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div 
                            ref={chaptersRef}
                            id="chapters"
                            data-section
                            className="bg-white rounded-lg shadow-sm p-6"
                        >
                            <div className="flex items-center gap-x-2 mb-6">
                                <IconBadge icon={ListChecks} size="sm" />
                                <h2 className="text-xl font-medium">
                                    Chapitres du cours
                                </h2>
                            </div>
                            <ChaptersForm 
                                variant="chapter" 
                                courseId={courseId}
                                chapters={course?.chapters?.map((chapter) => ({
                                    id: chapter._id,
                                    title: chapter.title,
                                    isFree: chapter.isFree ?? false,
                                    position: chapter.position ?? 0,
                                    isPublished: chapter.isPublished ?? false
                                })) ?? []}
                            />
                        </div>

                        <div 
                            ref={pricingRef}
                            id="pricing"
                            data-section
                            className="bg-white rounded-lg shadow-sm p-6"
                        >
                            <div className="flex items-center gap-x-2 mb-6">
                                <IconBadge icon={CircleDollarSign} size={"sm"} />
                                <h2 className="text-xl font-medium">
                                    Tarification
                                </h2>
                                
                            </div>
                          
                            <PriceForm
                                initialData={{ price: course.course.price }}
                                courseId={courseId}
                            />

                        </div>
                        <div 
                          
                            id="skills"
                            data-section
                            className="bg-white rounded-lg shadow-sm p-6"
                        >
                            <div className="flex items-center gap-x-2 mb-6">
                                <IconBadge icon={ListChecks} size={"sm"} />
                                <h2 className="text-xl font-medium">
                                    Compétences
                                </h2>
                                
                            </div>
                            <SkillsForm
                                    initialData={{ skills: course.course.skills }}
                                    courseId={courseId}
                                />
                          

                        </div>
                        <div 
                            ref={resourcesRef}
                            id="resources"
                            data-section
                            className="bg-white rounded-lg shadow-sm p-6"
                        >
                            <div className="flex items-center gap-x-2 mb-6">
                                <IconBadge icon={File} size={"sm"} />
                                <h2 className="text-xl font-medium">
                                    Ressources & Fichiers
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

                <ScrollButton sections={sections} />
            </div>
        </div>
    )
}

export default CoursePage
