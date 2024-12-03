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
import { Input } from "@/components/ui/input";
import { useUpdateCourseSkills } from "@/features/courses/api/use-update-course-skills";
import { Badge } from "@/components/ui/badge";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";

interface SkillsFormProps {
  initialData: {
    skills?: string[];
  };
  courseId: Id<"courses">;
}

const formSchema = z.object({
  skill: z.string().min(2, {
    message: "La compétence doit contenir au moins 2 caractères",
  }),
});

export const SkillsForm = ({ initialData, courseId }: SkillsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const { mutate, isPending } = useUpdateCourseSkills();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skill: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const updatedSkills = [...skills, values.skill];
    mutate(
      { courseId, skills: updatedSkills },
      {
        onSuccess() {
          setSkills(updatedSkills);
          form.reset();
          toast.success("Compétence ajoutée avec succès");
        },
        onError() {
          toast.error("Une erreur est survenue lors de l'ajout de la compétence");
        },
      }
    );
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    mutate(
      { courseId, skills: updatedSkills },
      {
        onSuccess() {
          setSkills(updatedSkills);
          toast.success("Compétence supprimée avec succès");
        },
        onError() {
          toast.error("Une erreur est survenue lors de la suppression de la compétence");
        },
      }
    );
  };

  return (
    <div className="mt-2 border bg-slate-100 rounded-md p-2">
      <div className="font-medium flex items-center justify-between">
        Compétences requises/acquises
        <Button onClick={toggleEdit} variant="transparent">
          {isEditing ? <X /> : <Pencil className="h-4 w-4" />}
        </Button>
      </div>
      {!isEditing && (
        <div className="flex flex-wrap gap-2 mt-2">
          {skills.length === 0 && (
            <p className="text-sm text-slate-500 italic">
              Aucune compétence définie
            </p>
          )}
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      )}
      {isEditing && (
        <>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="cursor-pointer hover:bg-red-100"
                onClick={() => removeSkill(skill)}
              >
                {skill}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-2">
              <FormField
                control={form.control}
                name="skill"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Ajouter une compétence"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-end justify-end gap-x-2">
                <Button variant="orange" disabled={isPending} type="submit">
                  <Save className="h-5 w-5" />
                  Ajouter
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}; 
