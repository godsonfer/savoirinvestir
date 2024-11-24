import { FaChevronDown } from 'react-icons/fa'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { useUpdateChannel } from '@/features/channels/api/use-update-channel'
import { useRemoveChannel } from '@/features/channels/api/use-remove-channel'
import { useChannelId } from '@/hooks/use-channel-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { SaveAll, TrashIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useConfirm } from '@/hooks/use-confirm'
import { useCurrentMember } from '@/features/members/api/use-get-current-member'


interface ChannelHeaderProps {
    title: string | undefined
    description?: string | undefined
}
export const ChannelHeader = ({ title, description }: ChannelHeaderProps) => {
    const router = useRouter()

    const [editOpen, setEditOpen] = useState(false);
    const [value, setValue] = useState(title || '');
    const [desc, setDescription] = useState(description || '');
    const { mutate: channelUpdate, isPending } = useUpdateChannel()
    const { mutate: channelRemove, isPending: removePending } = useRemoveChannel()
    const [ConfirmDialog, confirm] = useConfirm('Voulez-vous vraiment supprimer ce salon?', 'Cette action est définitive')

    const workspaceId = useWorkspaceId()
    const ChannelId = useChannelId()
    const { data: member } = useCurrentMember({ workspaceId })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').toLocaleLowerCase()
        setValue(value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        channelUpdate({
            name: value,
            description: desc,
            channelId: ChannelId,
        }, {
            onSuccess() {
                console.log("done")
                toast.success(`${title} a été modifié avec succès!`)
                // router.push(`/workspace/${workspaceId}/channel/${id}`)
                setEditOpen(false)
            }
        })
    }
    const handleRemove = async () => {
        const ok = await confirm()
        if (!ok) return;

        channelRemove({ channelId: ChannelId }, {
            onSuccess: () => {
                toast.success("Salon supprimé !")
                router.replace(`/workspace/${workspaceId}`)
            },

            onError: () => {
                toast.error("Une erreur est survenue")
            }
        })
    }
    const handleEditOpen = (value: boolean) => {
        if (member?.role !== 'admin') return
        setEditOpen(value)
    }
    return (
        <>
            <ConfirmDialog />
            <Dialog >
                <DialogTrigger asChild>
                    <div className='bg-white h-[49px] flex items-center px-4 overflow-hidden'>
                        <Button variant={"ghost"} className='text-lg font-semibold px-2 overflow-hidden w-auto' size={"sm"}>
                            <span className='truncate'># {title}</span>
                            <FaChevronDown className='size-2.5 ml-2 shrink-0' />
                        </Button>
                    </div>
                </DialogTrigger>
                <DialogContent className='p-0 bg-gray-50 overflow-hidden' >
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle className="text-lg font-semibold"> {title}</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    <div className='px-4 pb-4 flex flex-col gap-y-2'>
                        <Dialog open={editOpen} onOpenChange={handleEditOpen} >
                            <DialogTrigger asChild>
                                <div className="px-5 py-4 bg-white  rounded-lg border cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-semibold">
                                            Nom du salon
                                        </p>
                                        {
                                            member?.role === "admin" && (
                                                <p className='text-sm text-[#125D98] hover:underline font-semibold'> Editer</p>
                                            )
                                        }
                                    </div>
                                    <p className='text-sm'> # {title} </p>
                                </div>
                            </DialogTrigger>
                            <DialogContent className=' bg-gray-50 overflow-hidden py-5 mt-4' >
                                <DialogHeader>
                                    <DialogTitle>Renommé # {title}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className='space-y-4'>
                                    <Label className='mt-2'>Titre</Label>
                                    <Input
                                        value={value}
                                        disabled={isPending}
                                        onChange={(e) => handleChange(e)}
                                        className="w-full"
                                    />
                                    <Label className='mt-2'>Description</Label>
                                    <Textarea
                                        disabled={isPending}
                                        value={desc}
                                        onChange={e => setDescription(e.target.value)}
                                        className='w-full h-24 '
                                    />
                                    <DialogFooter className='py-2' >
                                        <DialogClose asChild>
                                            <Button disabled={isPending} variant={"outline"}  >Annulé</Button>
                                        </DialogClose>
                                        <Button disabled={isPending} ><SaveAll className='size-5 mr-1' /> Enregistrer</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>

                        </Dialog>
                        {
                            member?.role === "admin" && (
                                <button disabled={removePending} onClick={handleRemove} className='flex  text-rose-600  gap-x-2 px-5 py-4 bg-white  rounded-lg border cursor-pointer hover:bg-gray-50'>
                                    <TrashIcon className='size-4' />
                                    <p className='text-sm  font-semibold'>Supprimer</p>
                                </button>
                            )
                        }

                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

