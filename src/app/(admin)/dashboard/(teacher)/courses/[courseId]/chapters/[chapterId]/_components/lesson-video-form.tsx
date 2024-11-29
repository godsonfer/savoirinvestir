"use client";

import * as z from "zod";
import MuxPlayer from "@mux/mux-player-react";
import { Pencil, PlusCircle, Video, X } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { toast } from "sonner";
import { Id } from "../../../../../../../../../../convex/_generated/dataModel";
import { useUpdateLessonVideo } from "@/features/lessons/api/use-udpate-lesson-video";

interface ChapterVideoFormProps {
  initialData: {
    videoUrl?: string;
    muxData?: {
      playbackId?: string,
      assetId?: string
    }
  };
  courseId: Id<"courses">;
  chapterId: Id<"chapters">;
  lessonId: Id<"lessons">
};

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const LessonVideoForm = ({
  initialData,
  courseId,
  lessonId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  const { mutate, isPending } = useUpdateLessonVideo()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const muxtData = await axios.post("/api/muxt", {
        videoUrl: values.videoUrl
      })
      if (muxtData) {
        mutate({
          chapterId,
          courseId,
          lessonId,
          assetId: muxtData.data.asset.id,
          playback: muxtData.data.asset.playback_ids[0].id,
          duration: muxtData.data.asset.duration ?? 0,
          videoUrl: values.videoUrl,
        }, {
          onSuccess() {
            toast.success("Vidéo uploader avec succès");
            setIsEditing(isPending);
          },
          onError() {
            toast.error("Une erreur s'est produite lors de la mise à jour de la vidéo");
          },
        })
      }
    } catch {
      toast.error("Une erreur de creation des données sur MUXT",);
    }
  }
  return (
    <div className="mt-2 border bg-slate-100 rounded-md p-1">
      <div className="font-medium flex items-center justify-between">
        Video de la leçon
        <Button onClick={toggleEdit} variant="transparent">
          {isEditing && (
            <X></X>
          )}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 " />
              Ajouter
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Editer la video
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="flex justify-center items-center mt-2 rounded-md">
            <MuxPlayer className="h-full w-full "
              playbackId={initialData?.muxData?.playbackId || ""}
            />
          </div>
        )
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Uploader la vidéo
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Si la durée est inférieure à 1 minute, vous pouvez la changer dans les paramètres de la vidéo.
        </div>
      )}
    </div>
  )
}
