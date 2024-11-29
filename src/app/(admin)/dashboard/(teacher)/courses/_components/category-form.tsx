/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown, Pencil, Save, X } from "lucide-react";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { toast } from "sonner";
import { useUpdateCourseCategory } from "@/features/courses/api/use-update-course-category";
import { Id } from "../../../../../../../convex/_generated/dataModel";
interface CategoryFormProps {
  initialData: {
    categoryId?: Id<'categories'>
  };
  courseId: Id<'courses'>;
  options: { title: string; _id: Id<"categories"> }[];
};

const formSchema = z.object({
  categoryId: z.string().min(1, {
    message: "Veuillez choisir une catégorie.",
  }),
});

export const CategoryForm = ({
  initialData,
  courseId,
  options,
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false)
  // api 
  const { mutate, isPending } = useUpdateCourseCategory()
  const toggleEdit = () => setIsEditing((current) => !current);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || ""
    },
  });


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutate({ categoryId: values.categoryId as Id<"categories">, courseId: courseId }, {
      onSuccess() {
        setIsEditing(isPending)
        toast.success('Modification terminée avec success!')
      },
      onError() {
        toast.error('Une erreur est survenue lors de la modification !')
      },
    })
  }

  const selectedOption = options.find((option) => option._id === initialData.categoryId);

  return (
    <div className="mt-2 border bg-slate-100 rounded-md p-2">
      <div className="font-medium flex items-center justify-between">
        Catégorie de la formation
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
          !initialData.categoryId && "text-slate-500 italic"
        )}>
          {selectedOption?.title || "Ajouter"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col italic font-sans text-sml">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? options.find(
                              (option) => option._id === field.value
                            )?.title
                            : "Selectionner une catégorie"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[500px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Rechercher une catégorie..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>Acune catégorie disponible </CommandEmpty>
                          <CommandGroup>
                            {options.map((option) => (
                              <CommandItem
                                value={option.title}
                                key={option._id}
                                onSelect={() => {
                                  form.setValue("categoryId", option._id)
                                }}
                              >
                                {option.title}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    option.title === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 items-end justify-end">
              <Button type="submit" variant={"orange"} disabled={isPending}>   <Save />  Enregistrer</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
