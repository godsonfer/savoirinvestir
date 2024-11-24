"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Save, X } from "lucide-react";
import { useState } from "react";


import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,

} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Id } from "../../../../../../../../../convex/_generated/dataModel";
import { useUpdateLessonAccess } from "@/features/lessons/api/use-udpate-lesson-access";

interface ChapterAccessFormProps {
  initialData: {
    isFree?: boolean;
  }
  courseId: Id<"courses">;
  chapterId: Id<"chapters">;
  lessonId: Id<"lessons">;
};

const formSchema = z.object({
  isFree: z.boolean().default(false),
});

export const LessonAccessForm = ({
  initialData,
  courseId,
  chapterId,
  lessonId,
}: ChapterAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate, isPending } = useUpdateLessonAccess()
  const toggleEdit = () => setIsEditing((current) => !current);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: !!initialData.isFree
    },
  });


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutate({
      chapterId,
      courseId,
      lessonId,
      access: values.isFree
    }, {
      onSuccess() {
        toast.success("Visibilité mise à jour");
        setIsEditing(isPending);
      },
      onError() {
        toast.error("Une erreur s'est produite lors de la mise à jour du visibilité");
      },
    })
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-1">
      <div className="font-medium flex items-center justify-between">
        Visibilité de la leçon
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
        <p className={cn(
          "text-sm mt-2",
          !initialData.isFree && "text-slate-500 italic"
        )}>
          {initialData.isFree ? (
            <>Cette leçon est gratuite</>
          ) : (
            <>Cette leçon est payante</>
          )}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      Cochez cette cage si vous voulez rendre payant cette leçon
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex  gap-x-2 items-end justify-end">
              <Button variant={"orange"}
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
