/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, File, Loader2, Pencil, PlusCircle, Save, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
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
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { toast } from "sonner";
import { Id } from "../../../../../../../convex/_generated/dataModel";
import { useCreateAttachment } from "@/features/attachments/api/use-create-attachment";
import { useRemoveAttachment } from "@/features/attachments/api/use-update-remove-attachements";
import { useConfirm } from "@/hooks/use-confirm";

interface AttachmentFormProps {
  initialData: {
    attachments: { name?: string; url: string; id: Id<"attachments"> }[]
  }
  courseId: Id<"courses">;
};

const formSchema = z.object({
  url: z.string().min(1, {
    message: "Veuillez choisir un fichier.",
  }),
});



export const AttachmentForm = ({
  initialData,
  courseId
}: AttachmentFormProps) => {

  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [name, setName] = useState<string | undefined>('document');
  const [openPopover, setOpenPopover] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  const options = ['audio', "video", "image", "document", "link",]
  const [ConfirmDialog, confirm] = useConfirm('Etes-vous sûre ?', "La suppression de ce fichier est irréversible");
  const togglePopover = () => setOpenPopover((current) => !current);
  // api
  const { mutate, isPending } = useCreateAttachment()
  const { mutate: mutateDelete } = useRemoveAttachment()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutate({ url: values.url, courseId, name }, {
      onSuccess() {
        setIsEditing(isPending)
        toast.success('Ajout terminé avec success!')
      },
      onError() {
        toast.error('Une erreur est survenue lors de l&apos;ajout!')
      },
    })
  };

  const onDelete = async (id: Id<"attachments">) => {
    const confirmed = await confirm()
    if (!confirmed) return;
    mutateDelete({ attachmentId: id, courseId }, {
      onSuccess() {
        setIsEditing(isPending)
        toast.success('Suppression terminé avec success!')
      },
      onError() {
        toast.error('Une erreur est survenue lors de la suppression!')
      },
    })
  }
  return (
    <div className="mt-2 border bg-slate-100 rounded-md p-2">
      <ConfirmDialog />
      <div className="font-medium flex items-center justify-between">
        Ressources de la formation
        <Button onClick={toggleEdit} variant="transparent">
          {isEditing && (
            <X />
          )}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments?.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              Aucune ressources n&apos;est disponible  d&apos;abord
            </p>
          )}
          {initialData.attachments?.length > 0 && (
            <div className="space-y-2">
              {initialData?.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-1 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">
                    {attachment.name}
                  </p>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <Button variant={"transparent"}
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4 text-rose-600" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <Popover open={openPopover}>
            <PopoverTrigger asChild>
              <div className="flex ">
                <Button onClick={togglePopover} className="w-full text-sm text-gray-700"
                  variant="outline"
                  role="combobox"
                >
                  {name || "Nom du fichier"}
                </Button>
                <ChevronsUpDown className="opacity-50" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[500px] p-0">
              <Command onSelect={() => setOpenPopover(false)}>
                <CommandInput
                  placeholder="Nom du fichier"
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>Nom du fichier </CommandEmpty>
                  <CommandGroup >
                    {options.map((option) => (
                      <CommandItem onClick={() => setOpenPopover(false)}
                        value={option}
                        key={option}
                        onSelect={() => {
                          setName(option)
                        }}
                      >
                        {option}

                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Ajouter tous les fichiers et ressources de votre formation.
          </div>
        </div>
      )}
    </div>
  )
}
