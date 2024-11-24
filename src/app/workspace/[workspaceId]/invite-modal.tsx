import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog"

import { CopyIcon, RefreshCcw } from "lucide-react"

import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useConfirm } from "@/hooks/use-confirm"
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code"

import { toast } from "sonner"

// TODO : add like code change, invite link etc  

interface InviteModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    joinCode: string
    name: string
}
export const InviteModal = ({ open, setOpen, name, joinCode }: InviteModalProps) => {
    const workspaceId = useWorkspaceId()
    const { mutate, isPending } = useNewJoinCode()
    const [ConfirmDialog, confirm] = useConfirm('Etes-vous sûre ?', "Le code d'invation  ne sera plus valable")
    const handleNewCode = async () => {
        const ok = await confirm()
        if (!ok) { return }
        mutate({ workspaceId }, {
            onSuccess: () => {
                toast.success("Nouveau code généré avec succès")
            },
            onError: () => {
                toast.error("Erreur lors de la génération du nouveau code")
            },
        })
    }
    const handleCopy = () => {
        const inviteLink = `${window.location.origin}/join/${workspaceId}`
        navigator.clipboard.writeText(inviteLink).then(() => {
            toast.success("Lien copier avec succès")
        })
    }
    const handleCopyCode = () => {
        navigator.clipboard.writeText(joinCode).then(() => {
            toast.success("Code copier avec succès")
        })
    }
    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Invitez des étudiants à <span className="text-sky-500">{name}</span>
                        </DialogTitle>
                        <DialogDescription>
                            Utilisez le code suivant pour inviter des étudiants à rejoindre votre espace de travail
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-y-4 items-center justify-center py-10">
                        <div className="flex items-center justify-center">
                            <p className="text-4xl font-bold tracking-widest  uppercase"> {joinCode}</p>
                            <Button variant={"secondary"} size={'sm'} onClick={handleCopyCode} disabled={isPending}>
                                <CopyIcon className=" ml-2 text-gray-500" />
                            </Button>
                        </div>
                        <Button variant={"secondary"} size={'sm'} onClick={handleCopy} disabled={isPending}>
                            Copier le lien de partage
                            <CopyIcon className="size-4 ml-2" />
                        </Button>
                    </div>

                    <div className="flex items-center justify-between w-full">
                        <Button disabled={isPending} onClick={handleNewCode} variant={"secondary"} className="hover:bg-slate-100">
                            Nouveau code
                            <RefreshCcw className="size-4 ml-2" />
                        </Button>
                        <DialogClose asChild>
                            <Button variant={"secondary"} onClick={() => setOpen(false)}>
                                Fermer
                            </Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>

    )
}
