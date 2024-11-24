/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import dynamic from "next/dynamic";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { format, isToday, isYesterday } from "date-fns"

import { Thumbnail } from "./thumbnail";
import { MessageToolbar } from "./message-toolbar";
import { Reactions } from "./reactions";

import { Hint } from "./ui/hint";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { useDeleteMessage } from "@/features/messages/api/use-delete-message";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";

import { usePanel } from "@/hooks/use-panel";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ThreadBar, } from "./thread-bar";

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false })
const Editor = dynamic(() => import("@/components/editor"), { ssr: false })

interface MessageProps {
    key: string;
    id: Id<"messages">;
    memberId: Id<"members">;
    authorImages?: string;
    authorName?: string;
    isAuthor: boolean;
    reactions: Array<Omit<Doc<"reactions">, "memberId"> & {
        count: number;
        memberIds: Id<"members">[]
    }>;
    body: Doc<"messages">["body"];
    file: string | undefined | null;
    createdAt: Doc<"messages">['_creationTime'];
    updatedAt: Doc<"messages">['updatedAt'];
    isEditing: boolean;
    isCompact?: boolean;
    setEditingId?: (id: Id<"messages"> | null) => void;
    hideThreadButton?: boolean;
    threadCount?: number;
    threadImage?: string
    threadName?: string,
    threadTimestamp?: number
}

const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Aujourd'hui" : isYesterday(date) ? 'Hier' : format(date, 'dd-MM-yyyy')} à ${format(date, 'HH:mm:ss')}`;
};
export const Message = ({
    id,
    memberId,
    authorImages,
    authorName = 'Anonyme',
    isAuthor,
    reactions,
    body,
    file,
    createdAt,
    updatedAt,
    isEditing,
    isCompact,
    setEditingId,
    hideThreadButton,
    threadCount,
    threadImage,
    threadTimestamp,
    threadName
}: MessageProps) => {
    const avataFallback = authorName.charAt(0).toUpperCase()

    const { mutate: updateMessage, isPending: isUpdatingMessage } = useUpdateMessage()
    const { mutate: deleteMessage, isPending: isDeletingMessage } = useDeleteMessage()
    const { mutate: toggleReaction, isPending: isTogglingReaction } = useToggleReaction()


    const handleReaction = (value: string) => {
        toggleReaction({ messageId: id, value }, {
            onError: (error) => {
                toast.error("Une erreur est survenue lors de l'ajout de la réaction");
            },
        });
    }
    const isPending = isUpdatingMessage || isTogglingReaction
    const [ConfirmDialog, confirm] = useConfirm("Suppression de message", "La suppression de ce message est inrrévesible")
    const { onCLose, parentMessageId, onOpenMessage, onOpenProfile } = usePanel()
    const handleUpdate = async ({ body }: { body: string }) => {
        await updateMessage({ id, body }, {
            onSuccess: () => {
                toast.success("Message modifié avec succès");
                setEditingId?.(null);
            },
            onError: (error) => {
                toast.error("Une erreur est survenue lors de la modification du message");
            },
        });
    }

    const handleDeleteMessage = async () => {
        const ok = await confirm()
        if (ok) {
            await deleteMessage({ id }, {
                onSuccess: () => {
                    toast.success("Message supprimé avec succès");
                    setEditingId?.(null);
                    if (parentMessageId === id) {
                        onCLose()
                    }
                },

                onError: (error) => {
                    toast.error("Une erreur est survenue lors de la suppression du message");
                },
            });
        }
    }
    if (isCompact) {
        return (
            <>
                <ConfirmDialog />
                <div className={cn("flex flex-col  gap-2 p-1.5  px-5  hover:bg-gray-100 group relative",
                    isEditing && 'bg-[#ead48f33] hover:bg-[#ead48f33]',
                    isDeletingMessage && 'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-1000 '
                )}>
                    <div className="flex items-start gap-2" >
                        <Hint label={formatFullTime(new Date(createdAt))}>
                            <button className="text-xm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity w-[40px] leading-[22px] text-center hover:text-sky-600" > {format(createdAt, "HH:mm")}</button>
                        </Hint>
                        {
                            isEditing ? (
                                <div className="w-full h-full" >
                                    <Editor
                                        onSubmit={handleUpdate}
                                        diseable={isPending}
                                        variant="update"
                                        defaultValue={JSON.parse(body)}
                                        onCancel={() => setEditingId?.(null)}
                                    />
                                </div>
                            ) :
                                (
                                    <div className="felx flex-col w-full">
                                        <Renderer value={body} />
                                        <Thumbnail url={file} />
                                        {
                                            updatedAt ?
                                                (
                                                    <Hint label={`Modifier ${formatFullTime(new Date(updatedAt))}`} >
                                                        <span className="text-xs text-muted-foreground ">Modifier  </span>
                                                    </Hint>
                                                ) :
                                                null
                                        }
                                        <Reactions data={reactions} onChange={handleReaction} />
                                        <ThreadBar image={threadImage} name={threadName} timestamp={threadTimestamp} handleThread={() => onOpenMessage(id)} threadCount={threadCount} />

                                    </div>
                                )
                        }
                    </div>
                    {
                        !isEditing && (
                            <MessageToolbar
                                isAuthor={isAuthor}
                                isPending={isPending}
                                handleEdit={() => setEditingId?.(id)}
                                handleThread={() => onOpenMessage(id)}
                                handleDelete={handleDeleteMessage}
                                handleReaction={handleReaction}
                                hideThreadButton={hideThreadButton}
                            />
                        )
                    }
                </div>
            </>
        )
    }
    return (
        <>
            <ConfirmDialog />
            <div className={cn("flex flex-col  gap-2 p-1.5  px-5  hover:bg-gray-100 group relative",
                isEditing && 'bg-[#ead48f33] hover:bg-[#ead48f33]',
                isDeletingMessage && 'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-1000 '
            )}>
                <div className={cn("flex items-start gap-2", "")} >
                    <button onClick={() => onOpenProfile(memberId)}>
                        <Avatar>
                            <AvatarImage src={authorImages} />
                            <AvatarFallback >
                                {avataFallback}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                    {
                        isEditing ? (
                            <div className="w-full h-full" >
                                <Editor
                                    onSubmit={handleUpdate}
                                    diseable={isPending}
                                    variant="update"
                                    defaultValue={JSON.parse(body)}
                                    onCancel={() => setEditingId?.(null)}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col w-full overflow-hidden">
                                <div className="text-sm">
                                    <button onClick={() => onOpenProfile(memberId)} className="font-bold text-primary hover:text-sky-600">
                                        {isAuthor ? "Vous" : authorName}
                                    </button>
                                    <span>&nbsp; &nbsp; &nbsp;</span>
                                    <Hint label={formatFullTime(new Date(createdAt))}>
                                        <button className="text-xm text-muted-foreground hover:text-sky-600" >
                                            {format(createdAt, "HH:mm")}
                                        </button>
                                    </Hint>
                                </div>
                                <Renderer value={body} />
                                <Thumbnail url={file} />
                                {
                                    updatedAt ?
                                        (
                                            <Hint align="start" label={`Modifier ${formatFullTime(new Date(updatedAt))}`} >
                                                <span className="text-xs text-muted-foreground ">Modifier</span>
                                            </Hint>
                                        ) :
                                        null
                                }
                                <Reactions data={reactions} onChange={handleReaction} />
                                <ThreadBar image={threadImage} name={threadName} timestamp={threadTimestamp} handleThread={() => onOpenMessage(id)} threadCount={threadCount} />
                            </div>
                        )
                    }

                </div>
                {
                    !isEditing && (
                        <MessageToolbar
                            isAuthor={isAuthor}
                            isPending={isPending}
                            handleEdit={() => setEditingId?.(id)}
                            handleThread={() => onOpenMessage(id)}
                            handleDelete={handleDeleteMessage}
                            handleReaction={handleReaction}
                            hideThreadButton={hideThreadButton}
                        />
                    )
                }
            </div >
        </>
    )
}
