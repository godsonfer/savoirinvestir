"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { toast } from "sonner";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { useConfirm } from "@/hooks/use-confirm";
import { usePublishCourse } from "@/features/courses/api/use-publish-course";

interface ActionsProps {
  disabled: boolean;
  courseId: Id<"courses">;
  isPublished: boolean;
};

export const Actions = ({
  disabled,
  isPublished,
  courseId
}: ActionsProps) => {

  const [PublishDialog, publish] = useConfirm('Etes-vous sûre ?', "Si vous publiez cette course, elle sera disponible pour tous les utilisateurs.");

  // api 
  const { mutate, isPending } = usePublishCourse()

  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {

    const ok = await publish();
    if (!ok) return
    setIsLoading(true);

    mutate({ courseId: courseId }, {
      onSuccess: () => {
        setIsLoading(isPending);
        confetti.onOpen();
        toast.success("Formation publiée avec succès");
      },
      onError: () => {
        setIsLoading(isPending);
        toast.error("Une erreur est survenue lors de la publication de la formation, ");
      },

    })

  }

  return (
    <div className="flex items-center gap-2 ml-2">
      <PublishDialog />
      <div>
        <Button
          onClick={onClick}
          disabled={disabled || isLoading}
          variant="orange"
          className="shadow-xl "
        >
          {isPublished ? "Mettre en Brouillon" : "Publier"}
        </Button>
      </div>


    </div>
  )
}
