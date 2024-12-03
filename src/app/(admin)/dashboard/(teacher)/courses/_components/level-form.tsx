"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown, Pencil, X } from "lucide-react";
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
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { useUpdateCourseLevel } from "@/features/courses/api/use-update-course-level";

interface LevelFormProps {
  initialData: {
    level?: string;
  };
  courseId: Id<"courses">;
}

const levels = [
  { value: "debutant", label: "Débutant" },
  { value: "intermediaire", label: "Intermédiaire" },
  { value: "avance", label: "Avancé" },
  { value: "expert", label: "Expert" },
];

const formSchema = z.object({
  level: z.string().min(1, {
    message: "Le niveau est requis",
  }),
});

export const LevelForm = ({ initialData, courseId }: LevelFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useUpdateCourseLevel();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: initialData?.level || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutate(
      { courseId, level: values.level },
      {
        onSuccess() {
          toast.success("Niveau mis à jour avec succès");
          toggleEdit();
        },
        onError() {
          toast.error("Une erreur est survenue lors de la mise à jour du niveau");
        },
      }
    );
  };

  const selectedLevel = levels.find((level) => level.value === initialData.level);

  return (
    <div className="mt-2 border bg-slate-100 rounded-md p-2">
      <div className="font-medium flex items-center justify-between">
        Niveau de la formation
        <Button onClick={toggleEdit} variant="transparent">
          {isEditing ? <X /> : <Pencil className="h-4 w-4" />}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.level && "text-slate-500 italic"
          )}
        >
          {selectedLevel?.label || "Non défini"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-2">
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <Popover open={open} onOpenChange={setOpen}>
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
                            ? levels.find((level) => level.value === field.value)
                                ?.label
                            : "Sélectionner un niveau"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Rechercher un niveau..." />
                        <CommandEmpty>Aucun niveau trouvé</CommandEmpty>
                        <CommandGroup>
                          {levels.map((level) => (
                            <CommandItem
                              key={level.value}
                              value={level.value}
                              onSelect={() => {
                                form.setValue("level", level.value);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  level.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {level.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end justify-end gap-x-2">
              <Button variant="orange" disabled={isPending} type="submit">
                Enregistrer
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}; 
