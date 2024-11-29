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
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { useUpdateCourseDescription } from "@/features/courses/api/use-update-course-description";
import { toast } from "sonner";

interface DescriptionFormProps {
  initialData: {
    description?: string;
  };
  courseId: Id<'courses'>;
};

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Veuillez saisir une description pour votre formation.",
  }),
});

export const DescriptionForm = ({
  initialData,
  courseId
}: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || ""
    },
  });

  const { mutate, isPending } = useUpdateCourseDescription()
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutate({ description: values.description, courseId }, {
      onSuccess() {
        setIsEditing(isPending)
        toast.success('Modification terminée avec success!')
      },
      onError() {
        toast.error('Une erreur est survenue lors de la modification !')
      },
    })
  }

  return (
    <div className="mt-1  bg-slate-100 rounded-md p-2">
      <div className="mt-1 bg-slate-100 p-2 rounded-md text-muted-foreground tex-xl">
        <div className="flex font-medium items-center justify-between">
          {initialData.description ? (<span>{initialData.description}</span>) : 'Description de la formation'}
          <Button variant={"transparent"} onClick={() => setIsEditing(true)}>
            <Pencil className="ml-2 size-4" />
          </Button>
        </div>

      </div>
      {!isEditing && (
        <p className={cn(
          "text-sm mt-2",
          !initialData.description && "text-slate-500 italic"
        )}>
          {!initialData.description && "Aucne description de la formation"}
        </p>
      )}
      {isEditing && (
        <div className="  p-2 rounded-sm shadow-sm ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea cols={500} rows={5}
                        disabled={isPending}
                        placeholder="e.g. 'Cette formation parle de ....'"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Description de la formation
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 mt-3 flex-1 items-end justify-end">
                <Button disabled={isPending} onClick={() => setIsEditing(isPending)} variant={"outline"} > <X></X>Annuler</Button>
                <Button disabled={isPending} variant={"orange"} type="submit"> <Save /> Sauver</Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  )
}
