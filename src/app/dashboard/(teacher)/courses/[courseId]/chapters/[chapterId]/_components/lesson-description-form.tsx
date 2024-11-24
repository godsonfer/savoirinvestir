/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Save, X } from "lucide-react";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Preview } from "@/components/preview";
import { toast } from "sonner";
import { Id } from "../../../../../../../../../convex/_generated/dataModel";
import { LessonEdition } from "@/components/lesson-editor";
import { useUpdateLessonDescription } from "@/features/lessons/api/use-udpate-lesson-description";

interface ChapterDescriptionFormProps {
  initialData: {
    description?: string;
  };
  lessonId: Id<"lessons">;
  courseId: Id<"courses">;
  chapterId: Id<"chapters">;
};

const formSchema = z.object({
  description: z.string().min(1),
});

export const LessonDescriptionForm = ({
  initialData,
  courseId,
  lessonId,
  chapterId
}: ChapterDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate, isPending } = useUpdateLessonDescription()
  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || ""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutate({ chapterId: chapterId, courseId, lessonId, description: values.description }, {
      onSuccess: () => {
        toast.success("Description de la leçon mise à jour");
        setIsEditing(false);
      },
      onError: () => {
        toast.error("Une erreur est survenue");
        setIsEditing(false);
      }
    })
  }

  return (
    <div className="mt-1 border bg-slate-100 rounded-md p-0">
      <div className="font-medium flex items-center justify-between p-1" >
        Chapter description
        <Button onClick={toggleEdit} variant="transparent">
          {isEditing ? (
            <X></X>
          ) : (
            <>
              <Pencil className="h-4 w-4 " />
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div className={cn(
          "text-sm mt-2",
          !initialData.description && "text-slate-500 italic"
        )}>
          {!initialData.description && "Aucune description"}
          {initialData.description && (
            <Preview
              value={initialData.description}
            />
          )}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-2"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <LessonEdition
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-x-2 flex-1 justify-end items-end">
              <Button variant={'orange'}
                disabled={isPending}
                type="submit"
              >
                <Save /> Sauver
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
