"use client"

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { CourseColumn } from "./columns"
import { toast } from "sonner"
import { useConfirm } from "@/hooks/use-confirm"
import { useDeleteCourse } from "@/features/courses/api/use-delete-course"

interface CellActionProps {
  data: CourseColumn
}

export function CellAction({ data }: CellActionProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { mutate } = useDeleteCourse()
  const [ConfirmDialog, confirm] = useConfirm(
    "Êtes-vous sûr ?",
    "Cette action est irréversible. La formation sera définitivement supprimée."
  )

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success("ID copié dans le presse-papier")
  }

  const onDelete = async () => {
    const ok = await confirm()
    if (!ok) return

    setLoading(true)
    mutate(
      { courseId: data.id },
      {
        onSuccess: () => {
          toast.success("Formation supprimée")
          setLoading(false)
          setOpen(false)
        },
        onError: () => {
          toast.error("Une erreur est survenue")
          setLoading(false)
        },
      }
    )
  }

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Ouvrir le menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copier l&apos;ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/dashboard/courses/${data.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem disabled={loading} onClick={onDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
} 
