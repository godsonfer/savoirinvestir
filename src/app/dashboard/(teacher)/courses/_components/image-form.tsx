"use client";

import * as z from "zod";
import { Pencil, PlusCircle, ImageIcon, X } from "lucide-react";
import { useState } from "react";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useUpdateCourseCover } from "@/features/courses/api/use-update-course-cover";
import { toast } from "sonner";

interface ImageFormProps {
  initialData: {
    cover?: string;
  }
  courseId: Id<"courses">;
};

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Ajoutez  une image",
  }),
});

export const ImageForm = ({
  initialData,
  courseId
}: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  const { mutate, isPending } = useUpdateCourseCover()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutate({ cover: values.imageUrl, courseId: courseId }, {
      onSuccess() {
        setIsEditing(isPending)
        toast.success('Modification terminée avec success!')
      },
      onError() {
        toast.error('Une erreur est survenue lors de la modification!')
      },
    })
  }

  return (
    <div className="mt-2  bg-slate-100 rounded-sm p-2">
      <div className="font-medium flex items-center justify-between">
        Photo de couverture de la formation
        <Button className="m-2" variant="transparent" onClick={toggleEdit} >
          {isEditing && (
            <X className="size-4" />
          )}
          {!isEditing && !initialData.cover && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une image
            </>
          )}
          {!isEditing && initialData.cover && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.cover ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2 h-[320px] w-full">
            <Image priority={true}
              alt="Upload"
              fill
              className="object-fit rounded-md"
              src={initialData.cover}
            />
          </div>
        )
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4 italic font-sans">
            16:9 aspect ratio recommendé
          </div>
        </div>
      )}
    </div>
  )
}
