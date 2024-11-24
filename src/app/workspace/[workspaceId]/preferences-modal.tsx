import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogClose,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { TrashIcon } from "lucide-react"
// TODO : add more prefencies likes colors, notifications , etc

import { useRemoveWorkspace } from "@/features/workspaces/api/user-remove-workspace"
import { useUpdateWorkspace } from "@/features/workspaces/api/user-update-workspace"
import { useWorkspaceId } from "@/hooks/use-workspace-id"

import { useRouter } from "next/navigation"
import React, { useState } from 'react'
import { toast } from "sonner"
import { useConfirm } from "@/hooks/use-confirm"
interface PreferencesModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    initialValue: string
}
export const PreferencesModal = ({ open, setOpen, initialValue }: PreferencesModalProps) => {
    const router = useRouter()
    // states
    const [value, setValue] = useState(initialValue)
    const [editOpen, setEditOpen] = useState(false)
    // hooks
    const worskapceId = useWorkspaceId()
    const [ConfirmDialog, confirm] = useConfirm("Etes-vous sur ?", "La suppression est irréversible")
    // mutations
    const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace()
    const { mutate: removeWorkspace, isPending: isRemovingWorkspace } = useRemoveWorkspace()

    // methods
    const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        updateWorkspace({ id: worskapceId, name: value }, {
            onSuccess: () => {
                toast.success("Espace de travail modifié")
                setEditOpen(false)
            },
            onError: () => {
                toast.error("Une erreur est survenue")
            }
        })
    }
    const handleRemove = async () => {
        const ok = await confirm()
        if (!ok) return;

        removeWorkspace({ id: worskapceId }, {
            onSuccess: () => {
                toast.success("Espace de travail supprimé")
                router.replace('/')
            },
            onError: () => {
                toast.error("Une erreur est survenue")
            }
        })
    }
    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle>
                            {value}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="px-4 pb-4 flex flex-col gap-y-2">
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm font-semibold">
                                            Nom de l&apos;espace
                                        </p>
                                        <p className="text-sm text-[#12674a] hover:underline font-semibold">
                                            Edit
                                        </p>
                                    </div>
                                    <p className="text-sm">
                                        {value}
                                    </p>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Renommé cet espace
                                    </DialogTitle>
                                </DialogHeader>
                                <form className="space-y-4" onSubmit={handleEdit}>
                                    <DialogDescription>Editer votre espace de travail</DialogDescription>
                                    <Input
                                        disabled={isUpdatingWorkspace}
                                        required autoFocus value={value}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                                        minLength={3} maxLength={80} placeholder="Nom du salon e.g 'Cours, 'Mentorship', 'Analyse'"
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant={"outline"} disabled={isRemovingWorkspace} >
                                                Annuler
                                            </Button>
                                        </DialogClose>
                                        <Button disabled={isUpdatingWorkspace} type="submit" >
                                            Sauvegarder
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <button disabled={false}
                            onClick={handleRemove}
                            className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg  border cursor-pointer hover:bg-gray-50 text-rose-600" >
                            <TrashIcon className="size-4" />
                            <p className="text-sm font-semibold"> Supprimer l&apos;espace </p>
                        </button>
                    </div>

                </DialogContent>
            </Dialog>
        </>
    )
}
