/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useCourseId } from '@/hooks/use-course-id'
import { useChapterId } from '@/hooks/use-chapter-id'
import { useGetChapter } from '@/features/chapters/api/use-get-chapter'
import { useGetChapters } from '@/features/chapters/api/use-get-chapters'
import { useGetLessons } from '@/features/lessons/api/use-get-lessons'
import { usePublishChapter } from '@/features/chapters/api/use-publish-chapter'
import { usePanel } from '@/hooks/use-panel'
import { useConfirm } from "@/hooks/use-confirm";

import React from 'react'

import { ChaptersForm } from '../../../_components/chapters-form'
import { ChapterTitleEditorForm } from '../../../_components/chapter-title'
import { Id } from '../../../../../../../../convex/_generated/dataModel'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { SpinLoader } from '@/components/spin-loader'
import { Banner } from '@/components/banner'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/alert'

import { EyeIcon, } from 'lucide-react'
import { LessonEdito } from './_components/lesson-editor'
import { toast } from 'sonner'



export default function ChapterPage() {
  const { lessonId, onCLose } = usePanel()
  // api
  const courseId = useCourseId()
  const chapterId = useChapterId()
  const { data: chapters, isLoading: chaptersLoading } = useGetChapters({ courseId: courseId })
  const { data: chapter, isLoading: chapterLoading } = useGetChapter({ courseId: courseId, chapterId: chapterId })
  const { data: lessons } = useGetLessons({ chapterId, courseId })
  const { mutate, isPending } = usePublishChapter()
  const showPanel = !!lessonId

  const [PublishDialog, publish] = useConfirm('Etes-vous sûre ?', "Si vous publiez ce chapitre, il sera disponible pour tous les utilisateurs.");

  const publishChapter = async () => {
    const ok = await publish()
    if (!ok) return
    mutate({ courseId, chapterId }, {
      onSuccess: () => {
        toast.success("Chapitre publier")
      },
      onError: () => {
        toast.dismiss('Erreur de')
      }
    })
  }
  return (
    <div className="h-full p-1">
      <PublishDialog />
      <div className="p-1 ">
        <Banner
          variant="warning"
          label="Ce chapitre et sont contenu est actullement caché et est en cours de création."
        />
        <div className="flex border rounded-sm mt-2 bg-slate-500/10">
          <span className='text-italic font-sans'>
            <span className='"text-muted-foreground font-semi p-2'> Edition du chapitre : </span>
            <span className='text-sl font-bold'> {chapter?.title}</span>
          </span>
          <div className=' flex flex-1  justify-end items-end w-full '>
            {!chapter?.isPublished && <Button className='mr-2' variant={"orange"} onClick={publishChapter}> <EyeIcon /> Publier </Button>}
            <ChapterTitleEditorForm initialData={chapter?.title ? { title: chapter.title } : { title: '' }} chapterId={chapterId} />
          </div>
        </div>

      </div>
      <div className="flex h-[calc(100vh-40px)] ">
        <div className=" rounded-md flex h-[calc(100vh-45px)] w-[calc(100vw-85px)] bg-gradient-to-b from-white to-teal-50">
          <ResizablePanelGroup direction="horizontal" autoSaveId='immlab-lessons-layout'>
            <ResizablePanel defaultSize={20} minSize={20} className=" shadow-2xl  ">
              {
                chaptersLoading ? (<SpinLoader />) :
                  // liste des chapitres
                  <ChaptersForm variant="chapter" courseId={courseId}
                    chapters={chapters?.map((chapter) => ({
                      id: chapter._id,
                      title: chapter.title,
                      isFree: chapter.isFree ?? false,
                      position: chapter.position ?? 0,
                      isPublished: chapter.isPublished ?? false
                    })) ?? []}
                  />
              }

            </ResizablePanel>
            < ResizableHandle withHandle />
            <ResizablePanel minSize={25} defaultSize={20} >
              {
                !showPanel && chaptersLoading ? (<SpinLoader />) : (
                  <div>
                    {
                      chapterLoading ? (<SpinLoader />) :
                        <ChaptersForm variant="lesson"
                          courseId={courseId}
                          chapterId={chapterId}
                          chapters={lessons?.map((chapter) => ({
                            id: chapter._id,
                            title: chapter.title,
                            isFree: chapter.isFree ?? false,
                            position: chapter.position ?? 0,
                            isPublished: chapter.isPublished ?? false
                          })) ?? []}
                        />
                    }
                  </div>
                )
              }
            </ResizablePanel>
            {
              // editeur de leçon
              showPanel && (
                <>
                  < ResizableHandle withHandle />
                  <ResizablePanel minSize={30} defaultSize={30}>
                    {
                      !lessonId && (<Alert label='Aucune leçon trouvé' />)
                    }
                    {
                      lessonId && <LessonEdito lessonId={lessonId as Id<"lessons">} chapterId={chapterId} courseId={courseId} />
                    }
                  </ResizablePanel>
                </>
              )
            }
          </ResizablePanelGroup>
        </div>

      </div>
    </div>

  )
}

