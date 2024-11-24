/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { SaveIcon } from "lucide-react";

export const CreateChannelModal = () => {
    const router = useRouter()

    const workspaceId = useWorkspaceId()

    const [open, setOpen] = useCreateChannelModal();
    const { mutate, isPending } = useCreateChannel()

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectType, setSelectType] = useState<"audio" | "live" | "default" | "poll" | "post" | "board" | "course">('default');
    const [selectVisibility, setSelectVisibility] = useState<'public' | 'private'>('public');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').toLocaleLowerCase()
        setName(value);
    };
    const handleClose = () => {
        setName("")
        setDescription("")
        setSelectVisibility('public')
        setSelectType('default')
        setOpen(isPending)
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        mutate({
            name,
            description,
            workspaceId: workspaceId,
            visibility: selectVisibility,
            type: selectType,
        }, {
            onSuccess(id) {
                toast.success('Salon ajouté avec succès !')
                router.push(`/workspace/${workspaceId}/channel/${id}`)
                handleClose()
            }
        })
    }
    return (
        // TODO:: assuer que  le modal s'ouvre si on est admin et qu'on est l'espace public sinon rediriger ves les cours
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Ajouter un salon
                    </DialogTitle>
                    <DialogDescription> Création d&apos;un salon. Donnez en une description et un titre !</DialogDescription>
                </DialogHeader>
                <form className="space-y-4 w-full" onSubmit={handleSubmit}>
                    <div className="text-sm text-[#8e9297]">Titre</div>
                    <Input
                        disabled={isPending}
                        value={name}
                        min={3} max={20}
                        onChange={(e) => { handleChange(e) }}
                        placeholder="Titre du salon"
                        className="w-full"
                    />
                    <div className="text-sm text-[#8e9297]">Description</div>
                    <Textarea
                        disabled={isPending}
                        autoFocus
                        maxLength={200}
                        value={description}
                        onChange={(e) => { setDescription(e.target.value) }}
                        placeholder="Description du salon" className="" />
                    <div className="text-sm text-[#8e9297]">Type de salon</div>
                    <Select defaultValue="default" value={selectType} onValueChange={(value: "audio" | "live" | "default" | "poll" | "post" | "board") => setSelectType(value)} >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selectionner le type de canal" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Type de salon</SelectLabel>
                                <SelectItem value="default">Défaut</SelectItem>
                                <SelectItem value="live">Live</SelectItem>
                                <SelectItem value="audio">audio</SelectItem>
                                <SelectItem value="poll">poll</SelectItem>
                                <SelectItem value="post">post</SelectItem>
                                <SelectItem value="course">course</SelectItem>
                                <SelectItem value="board">board</SelectItem>
                            </SelectGroup>
                        </SelectContent>

                    </Select>
                    <div className="text-sm text-[#8e9297]">Visibilité</div>
                    <Select defaultValue="public" value={selectVisibility} onValueChange={(value: 'public' | 'private') => setSelectVisibility(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selectionner le type de canal" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Visibilité</SelectLabel>
                                <SelectItem value="public" >
                                    Public</SelectItem>
                                <SelectItem value="private">Privée</SelectItem>

                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isPending}>
                            <SaveIcon className="size-4 mr-2 " />
                            Enregister
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog >
    )
};
