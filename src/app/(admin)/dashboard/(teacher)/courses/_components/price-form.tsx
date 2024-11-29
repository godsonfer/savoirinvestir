"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, SaveIcon, X } from "lucide-react";
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
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { useUpdateCoursePrice } from "@/features/courses/api/use-update-course-price";
import { Id } from "../../../../../../../convex/_generated/dataModel";

interface PriceFormProps {
  initialData: {
    price?: number
  };
  courseId: Id<"courses">;
};

const formSchema = z.object({
  price: z.coerce.number(),
});

export const PriceForm = ({
  initialData,
  courseId
}: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;
  // api
  const { mutate, isPending } = useUpdateCoursePrice()
  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    mutate({ courseId, price: values.price }, {
      onSuccess() {
        toast.success("Course updated");
        toggleEdit();
      },
      onError() {
        toast.error("Quelque chose s'est mal passé lors de la mise à jour du prix de la formation");
      }
    })
  }

  return (
    <div className="mt-2 border bg-slate-100 rounded-md p-2">
      <div className="font-medium flex items-center justify-between">
        Prix de la formation
        <Button onClick={toggleEdit} variant="transparent">
          {isEditing ? (
            <X></X>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn(
          "text-sm mt-2",
          !initialData.price && "text-slate-500 italic"
        )}>
          {initialData.price
            ? formatPrice(initialData.price)
            : "No price"
          }
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 mt-2"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={isSubmitting}
                      placeholder="Entrer le prix de la formation"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end justify-end gap-x-2">
              <Button
                variant="orange"
                disabled={isPending || !isValid}
                type="submit"
              >
                <SaveIcon className="h-5 w-5" />
                Enregistrer
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
