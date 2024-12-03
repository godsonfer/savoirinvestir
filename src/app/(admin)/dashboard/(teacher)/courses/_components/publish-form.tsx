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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { usePublishCourse } from "@/features/courses/api/use-publish-course";

interface PublishFormProps {
  initialData: {
    isPublished?: boolean;
  };
  canPublish?: boolean;
  courseId: Id<"courses">;
}

const formSchema = z.object({
  isPublished: z.boolean().default(false),
});

export const PublishForm = ({ initialData,canPublish,  courseId }: PublishFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate, isPending } = usePublishCourse();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPublished: initialData?.isPublished || false,
    },
  });

  const onSubmit = async () => {
    mutate(
      { courseId},
      {
        onSuccess() {
         toast  .success("État de publication mis à jour avec succès");
          toggleEdit();
        },
        onError() {
          toast.error(
            "Une erreur est survenue lors de la mise à jour de l'état de publication"
          );
        },
      }
    );
  };

  return (
    <div className="mt-2 border bg-slate-100 rounded-md p-2">
      <div className="font-medium flex items-center justify-between">
        État de publication
        <Button onClick={toggleEdit} variant="transparent">
          {isEditing ? <X /> : <Pencil className="h-4 w-4" />}
        </Button>
      </div>
      {!isEditing && (
        <div className="flex items-center gap-x-2 mt-2">
          <Badge
            variant={initialData.isPublished ? "default" : "secondary"}
          >
            {initialData.isPublished ? "Publié" : "Non publié"}
          </Badge>
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox disabled={canPublish}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      Cochez cette case pour publier votre formation et la rendre visible aux étudiants
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex items-end justify-end gap-x-2">
              <Button variant="orange" disabled={isPending} type="submit">
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}; 
