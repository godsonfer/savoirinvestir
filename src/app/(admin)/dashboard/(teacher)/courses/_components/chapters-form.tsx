/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle, Save, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";;
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import { Id } from "../../../../../../../convex/_generated/dataModel";
import { ChaptersList } from "./chapters-list";

import { useCreateLesson } from "@/features/lessons/api/use-create-lesson";
import { useCreateChapters } from "@/features/chapters/api/use-create-chapter";
import { useReorderChapterPosition } from "@/features/chapters/api/use-update-chapter-position";
import { useConfirm } from "@/hooks/use-confirm";
import { useRemoveChapter } from "@/features/chapters/api/use-remove-chapter";
import { usePanel } from "@/hooks/use-panel";
import { useRemoveLesson } from "@/features/lessons/api/use-remove-lesson";
import { useUpdateLessonPosition } from "@/features/lessons/api/use-udpate-lesson-position";

interface ChaptersFormProps {
  chapterId?: Id<"chapters">;
  variant: "chapter" | "lesson";
  courseId: Id<"courses">;
  chapters?: { id: Id<"chapters"> | Id<"lessons">; title: string; position: number, isPublished: boolean }[]
};

const formSchema = z.object({
  title: z.string().min(4, { message: "Le titre doit contenir au moins 4  caractères" }),
});

export const ChaptersForm = ({
  courseId, chapters, variant, chapterId,
}: ChaptersFormProps) => {
  // states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm("Voulez-vous vraiment supprimer ?", "La suppression de ce contenu est irréversible");

  // api 
  const { mutate: mutateChapters, isPending } = useCreateChapters()
  const { mutate: positionMutation, } = useReorderChapterPosition()
  const { mutate: LessonPositionMutation, } = useUpdateLessonPosition()
  const { mutate: deleteChapter } = useRemoveChapter()
  const { mutate: deleteLesson } = useRemoveLesson()
  const { mutate: addLesson } = useCreateLesson()
  // method
  const toggleCreating = () => {
    setIsCreating((current) => !current);
  }

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (variant === "chapter")
      mutateChapters({ title: values.title, courseId }, {
        onSuccess: () => {
          toast.success("Nouveau chapitre ajouté");
          setIsCreating(false)
        },
        onError: () => {
          toast.error("Une erreur est survenue lors de l'ajout du chapitre");
        }
      })

    if (variant === "lesson" && chapterId)
      addLesson({ title: values.title, courseId, chapterId }, {
        onSuccess: () => {
          toast.success("Nouvelle leçon ajoutée");
          setIsCreating(false)
        },
        onError: () => {
          toast.error("Une erreur est survenue lors de l'ajout de la leçon");
        }
      })
  }

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    if (variant === "chapter") {
      setIsUpdating(true);
      updateData.forEach(async (data) => {
        positionMutation({ chapterId: data.id as Id<"chapters">, courseId, position: data.position }, {
          onSuccess: () => {
            setIsUpdating(false);
            toast.success("Nouveau chapitre ajouté");
          },
          onError: () => {
            setIsUpdating(false);
            toast.error("Une erreur est survenue lors de l'ajout du chapitre");
          }
        })
      })

    }
    if (variant === "lesson" && chapterId) {
      setIsUpdating(true);
      updateData.forEach(async (data) => {
        LessonPositionMutation({ lessonId: data.id as Id<"lessons">, chapterId: chapterId, courseId, position: data.position }, {
          onSuccess: () => {
            setIsUpdating(false);
            toast.success("Nouveau chapitre ajouté");
          },
          onError: () => {
            setIsUpdating(false);
            toast.error("Une erreur est survenue lors de l'ajout du chapitre");
          }
        })
      })

    }

  }

  // overture du pannel pour édition des lecons
  const { onOpenLesson } = usePanel()

  const onEdit = (id: string) => {
    variant === "chapter" && router.push(`/dashboard/courses/${courseId}/chapters/${id}`);
    variant === "lesson" && onOpenLesson(id as Id<"lessons">);
  }

  const onDelete = async (id: string) => {
    const ok = await confirm();
    if (ok) {
      if (variant === "chapter") {
        deleteChapter({ chapterId: id as Id<"chapters">, courseId, }, {
          onSuccess: () => {
            router.push(`/dashboard/courses/${courseId}`);
            toast.success("Chapitre supprimé avec succès");
          },
          onError: () => {
            toast.error("Une erreur est survenue");
          }
        })
      }
      if (variant === "lesson" && chapterId) {
        deleteLesson({ lessonId: id as Id<"lessons">, chapterId: chapterId, courseId, }, {
          onSuccess: () => {
            toast.success("Chapitre supprimé avec succès");
          },
          onError: () => {
            toast.error("Une erreur est survenue");
          }
        })
      }
    }
  }
  return (
    <div className="relative mt-2 border bg-slate-100 rounded-md p-2">
      <ConfirmDialog />
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        {variant === "chapter" ? "Chapitres  de la formation" : 'Leçon   du chapitre'}
        <Button onClick={toggleCreating} variant="transparent">
          {isCreating ? (
            <X></X>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end justify-end">
              <Button
                disabled={isPending}
                type="submit" variant={"orange"}
              >
                <Save className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </div>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={cn(
          "text-sm mt-2",
          !chapters?.length && "text-slate-500 italic"
        )}>
          {!chapters?.length && "Aucun chapitre"}
          <ChaptersList
            onEdit={onEdit}
            onDelete={onDelete}
            onReorder={onReorder}
            items={(chapters || []).map((chapter) => ({ ...chapter, isFree: false }))}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          {variant === 'chapter' ? 'Glissez et déplacez les chapitres pour les reordonner' : 'Glissez et déplacez les leçons pour les reordonner'}
        </p>
      )}
    </div>
  )
}
