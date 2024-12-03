"use client";

import { Pencil, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

import { Button } from "@/components/ui/button";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { useUpdateCourseDescription } from "@/features/courses/api/use-update-course-description";
import { toast } from "sonner";

const ReactQuill = dynamic(() => import("react-quill"), { 
  ssr: false,
  loading: () => <p>Chargement de l&apos;éditeur...</p>
});

interface DescriptionFormProps {
  initialData: {
    description?: string;
  };
  courseId: Id<'courses'>;
};

const modules = {
  toolbar: {
    container: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike'],
      [{'color': []}, {'background': []}],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'clean']
    ],
  },
  clipboard: {
    matchVisual: false,
  }
};

export const DescriptionForm = ({
  initialData,
  courseId
}: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialData?.description || "");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { mutate, isPending } = useUpdateCourseDescription();

  const onSubmit = async () => {
    mutate({ description: content, courseId }, {
      onSuccess() {
        setIsEditing(false);
        toast.success('Modification terminée avec succès!');
      },
      onError() {
        toast.error('Une erreur est survenue lors de la modification !');
      },
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="mt-1 bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Description de la formation</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <X className="h-4 w-4 mr-2" />
          ) : (
            <Pencil className="h-4 w-4 mr-2" />
          )}
          {isEditing ? "Annuler" : "Modifier"}
        </Button>
      </div>

      {!isEditing && (
        <div 
          className="bg-white rounded-md p-4 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content || "Aucune description" }}
        />
      )}

      {isEditing && (
        <div className="bg-white rounded-md">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            placeholder="Saisissez la description de votre formation..."
            className="bg-white"
          />
          <div className="flex justify-end gap-2 p-4 border-t">
            <Button 
              disabled={isPending} 
              variant="orange" 
              onClick={onSubmit}
            >
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
