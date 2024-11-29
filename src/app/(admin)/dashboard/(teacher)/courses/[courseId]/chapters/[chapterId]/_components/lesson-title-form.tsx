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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Id } from "../../../../../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useUpdateLessonTitle } from "@/features/lessons/api/use-udpate-lesson-title";

interface ChapterTitleFormProps {
  initialData: {
    title?: string;
  };
  courseId: Id<"courses">;
  chapterId: Id<"chapters">;
  lessonId: Id<"lessons">;
};

const formSchema = z.object({
  title: z.string().min(4, { message: "Le titre doit contenir au moins 4 charatères." }),
});

export const LessonTitleForm = ({
  initialData,
  courseId,
  chapterId,
  lessonId
}: ChapterTitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate, isPending } = useUpdateLessonTitle()
  const toggleEdit = () => setIsEditing((current) => !current);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutate({ chapterId, courseId, lessonId, title: values.title, }, {
      onSuccess() {
        toast.success("Titre mise à jour");
        setIsEditing(isPending);
      },
      onError() {
        toast.error("Une erreur s'est produite lors de la mise à jour du titre");
      },
    })
  }

  return (
    <div className=" border bg-slate-100 rounded-sm p-1 ">
      <div className="font-medium flex  ">
        <span className=" ">
          Titre de la leçon
        </span>
        <div className="flex flex-1 justify-end items-end">
          <Button onClick={toggleEdit} variant="transparent">
            {isEditing ? (
              <X></X>
            ) : (
              <>
                <Pencil className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

      </div>
      {!isEditing && (
        <p className="text-sm mt-2 font-bold">
          {initialData.title}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
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
            <div className="flex justify-end items-end  flex-1 gap-x-2">
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
