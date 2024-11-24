import { useCreateWorkspaceAtom } from "../store/use-create-workspace-modal";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useCreateWorkspace } from "../api/use-create-workspace";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";


export const CreateWorkspaceModal = () => {
    // routes
    const router = useRouter()
    // states
    const [open, setOpen] = useCreateWorkspaceAtom()
    const [name, setName] = useState('')

    // mutations
    const { mutate, isPending } = useCreateWorkspace()


    const handleClose = () => {
        setOpen(false)
        setName('')
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        mutate({ name }, {
            onSuccess(id) {
                toast.success('Espace salon créé avec succès !')
                router.push(`/workspace/${id}`)
                handleClose()
            }
        })
    }

    return (<Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Ajouter un salon</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                    Créez un nouveau salon pour collaborer avec des étudiants par niveau, des tâches, ou des discussions.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    value={name}
                    required
                    autoFocus
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    disabled={isPending}
                    minLength={3}
                    placeholder="Nom du salon e.g 'Cours, 'Mentorship', 'Analyse'"
                />
                <div className="flex justify-end"  >
                    <Button type="submit" disabled={isPending}>
                        Créer
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>);
}

