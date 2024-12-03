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
import { Input } from "@/components/ui/input";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useUpdateCourseDuration } from "@/features/courses/api/use-update-course-duration";

interface DurationFormProps {
  initialData: {
    duration?: number;
  };
  courseId: Id<"courses">;
}

const formSchema = z.object({
  duration: z.number().min(1, {
    message: "La durée doit être supérieure à 0 minutes",
  }),
});

export const DurationForm = ({ initialData, courseId }: DurationFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate, isPending } = useUpdateCourseDuration();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      duration: initialData?.duration || 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutate(
      { courseId, duration: values.duration },
      {
        onSuccess() {
          toast.success("Durée mise à jour avec succès");
          toggleEdit();
        },
        onError() {
          toast.error("Une erreur est survenue lors de la mise à jour de la durée");
        },
      }
    );
  };

  return (
    <div className="mt-2 border bg-slate-100 rounded-md p-2">
      <div className="font-medium flex items-center justify-between">
        Durée de la formation
        <Button onClick={toggleEdit} variant="transparent">
          {isEditing ? <X /> : <Pencil className="h-4 w-4" />}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.duration && "text-slate-500 italic"
          )}
        >
          {initialData.duration ? `${initialData.duration} minutes` : "Non définie"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-2">
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isPending}
                      placeholder="Durée en minutes"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end justify-end gap-x-2">
              <Button variant="orange" disabled={isPending} type="submit">
                <Save className="h-5 w-5" />
                Enregistrer
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}; 
