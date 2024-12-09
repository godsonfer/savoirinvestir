"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImagePlus, Pencil,  Trash, X } from "lucide-react";
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
import Image from "next/image";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useUpdateCourseCover } from "@/features/categories/api/use-update-course-cover";

interface ImageUrlFormProps {
  initialData: {
    imageUrl?: string[];
  };
  courseId: Id<"courses">;
}

const formSchema = z.object({
  url: z.string().url({
    message: "Veuillez entrer une URL valide",
  }),
});

export const ImageUrlForm = ({ initialData, courseId }: ImageUrlFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.imageUrl || []);
  const { mutate, isPending } = useUpdateCourseCover();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const updatedImages = [...images, values.url];
    mutate(
      { courseId, cover: values.url },
      {
        onSuccess() {
          setImages(updatedImages);
          form.reset();
          toast.success("Image ajoutée avec succès");
        },
        onError() {
          toast.error("Une erreur est survenue lors de l'ajout de l'image");
        },
      }
    );
  };

  const removeImage = (imageToRemove: string) => {
    const updatedImages = images.filter((image) => image !== imageToRemove);
    mutate(
      { courseId, cover: updatedImages[0] || "" },
      {
        onSuccess() {
          setImages(updatedImages);
          toast.success("Image supprimée avec succès");
        },
        onError() {
          toast.error("Une erreur est survenue lors de la suppression de l'image");
        },
      }
    );
  };

  return (
    <div className="mt-2 border bg-slate-100 rounded-md p-2">
      <div className="font-medium flex items-center justify-between">
        Images de la formation
        <Button onClick={toggleEdit} variant="transparent">
          {isEditing ? <X /> : <Pencil className="h-4 w-4" />}
        </Button>
      </div>
      {!isEditing && (
        <div className="grid grid-cols-3 gap-4 mt-2">
          {images.length === 0 && (
            <p className="text-sm text-slate-500 italic col-span-3">
              Aucune image
            </p>
          )}
          {images.map((url) => (
            <div key={url} className="relative aspect-video group">
              <Image
                alt="Course image"
                src={url}
                fill
                className="object-cover rounded-md"
              />
              <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black/40 transition flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(url)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {isEditing && (
        <>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {images.map((url) => (
              <div key={url} className="relative aspect-video group">
                <Image
                  alt="Course image"
                  src={url}
                  fill
                  className="object-cover rounded-md"
                />
                <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black/40 transition flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(url)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Entrez l'URL de l'image"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-end justify-end gap-x-2">
                <Button variant="orange" disabled={isPending} type="submit">
                  <ImagePlus className="h-4 w-4 mr-2" />
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
