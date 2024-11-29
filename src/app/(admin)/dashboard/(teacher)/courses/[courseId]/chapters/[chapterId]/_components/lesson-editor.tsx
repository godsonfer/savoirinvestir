import { SpinLoader } from "@/components/spin-loader"
import { Button } from "@/components/ui/button"
import { LessonTitleForm } from "./lesson-title-form"
import { LessonDescriptionForm } from "./lesson-description-form"
import { LessonAccessForm } from "./lesson-access-form"
import { LessonVideoForm } from "./lesson-video-form"
import { Id } from "../../../../../../../../../../convex/_generated/dataModel"

import { useGetlesson } from "@/features/lessons/api/use-get-lesson"
import { useGetMuxtData } from "@/features/lessons/api/use-get-muxtData"
import { usePublishLesson } from "@/features/lessons/api/use-publish-lesson"
import { toast } from "sonner"
import { useConfirm } from "@/hooks/use-confirm"

interface LessonEditoProps {
    lessonId: Id<"lessons">
    courseId: Id<"courses">;
    chapterId: Id<"chapters">;
}
export const LessonEditor = ({ lessonId, courseId, chapterId }: LessonEditoProps) => {
    const { data: lesson, isLoading: lessonLoading } = useGetlesson({
        courseId,
        chapterId,
        lessonId: lessonId
    });
    const { data: muxtData, } = useGetMuxtData({ courseId, chapterId, lessonId, })
    const { mutate, isPending } = usePublishLesson()
    const requiredFields = [
        lesson?.title,
        lesson?.description,
        lesson?.videoUrl,
    ]

    const totalFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length
    const canPublise = completedFields === totalFields
    const [PublishDialog, publish] = useConfirm('Etes-vous sûre ?', "Si vous publiez cette leçon, elle sera disponible pour tous les utilisateurs.");

    const publishLesson = async () => {
        const ok = await publish()
        if (!ok) return
        mutate({ courseId, chapterId, lessonId }, {
            onSuccess() {
                toast.error("Leçon publiée", { closeButton: true, position: "top-right" })
            },
            onError() {
                toast.error("Une erreur est survenue", { closeButton: true, richColors: true, position: "top-right" })
            }
        })
    }
    return (
        <div className='p-1 '>
            <PublishDialog />
            {
                lessonLoading && (<SpinLoader />)
            }
            {
                !lessonLoading && (
                    <div >
                        <div className="">
                            <div className="space-y-0">
                                <div className="">
                                    <div className="flex flex-1 justify-between">
                                        <span className="text-sm text-muted-foreground mt-2">
                                            Champs complète {completedFields}/{totalFields}
                                        </span>
                                        <Button onClick={publishLesson} disabled={!canPublise || isPending || lesson?.isPublished} className="mb-2 ">Publier</Button>
                                    </div>
                                    <LessonTitleForm
                                        lessonId={lessonId}
                                        initialData={{ title: lesson?.title }}
                                        courseId={courseId}
                                        chapterId={chapterId}
                                    />
                                </div>
                                <div>
                                    <LessonDescriptionForm
                                        lessonId={lessonId}
                                        initialData={{ description: lesson?.description }}
                                        courseId={courseId}
                                        chapterId={chapterId}
                                    />
                                    <LessonAccessForm
                                        lessonId={lessonId}
                                        initialData={{ isFree: lesson?.isFree, }}
                                        courseId={courseId}
                                        chapterId={chapterId}
                                    />
                                </div>
                            </div>
                            <div>
                                <LessonVideoForm
                                    initialData={{
                                        videoUrl: lesson?.videoUrl,
                                        muxData: {
                                            assetId: muxtData?.assetId,
                                            playbackId: muxtData?.playback
                                        }
                                    }}
                                    chapterId={chapterId}
                                    courseId={courseId}
                                    lessonId={lessonId}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
