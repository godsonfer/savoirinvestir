import { useGetMessage } from "@/features/messages/api/use-get-message"
import { useCurrentMember } from "@/features/members/api/use-get-current-member"
import { useCreateMessage } from "@/features/messages/api/use-create-message"
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url"
import { useGetMessages } from "@/features/messages/api/use-get-messages"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useChannelId } from "@/hooks/use-channel-id"
import { Id } from "../../convex/_generated/dataModel"

import dynamic from "next/dynamic"
import { Message } from "./message"
const Editor = dynamic(() => import("@/components/editor"), { ssr: false })

import { differenceInMinutes, format, isToday, isYesterday } from "date-fns"

import { useRef, useState } from "react"
import Quill from "quill"

import { SpinLoader } from "./spin-loader"
import { AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "./ui/button"


interface ThreadProps {
    messageId: Id<"messages">
    onClose: () => void
}

type createMessageValues = {
    channelId: Id<"channels">;
    workspaceId: Id<"workspaces">;
    parentMessageId: Id<"messages">;
    body: string;
    file: Id<"_storage"> | undefined
}

const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isToday(date)) return 'Ajourd\'hui'
    if (isYesterday(date)) return 'Hier'
    return format(date, 'dd-MM-yyyy')
}
const TIME_THRESHOLD = 5
export const Thread = ({ messageId, onClose }: ThreadProps) => {
    const workspaceId = useWorkspaceId()
    const channelId = useChannelId()

    const { data: message, isLoading: messageLoading } = useGetMessage({ messageId })
    const { data: currentMember } = useCurrentMember({ workspaceId: workspaceId })

    const { mutate: createMessage } = useCreateMessage()
    const { mutate: generateUploadUrl } = useGenerateUploadUrl()
    const { results, loadMore, status } = useGetMessages({ channelId, parentMessageId: messageId })
    const canLoadMore = status === 'CanLoadMore';
    const isLoadingMore = status === 'LoadingMore';

    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null)
    const [editorKey, setEditorKey] = useState(0)
    const [isPending, setIsPending] = useState(false)
    const editorRef = useRef<Quill | null>(null)

    const handleSubmit = async ({ body, image }: { body: string, image: File | null }) => {
        try {
            setIsPending(true)
            editorRef.current?.enable(false);
            const values: createMessageValues = { channelId, workspaceId, parentMessageId: messageId, body, file: undefined }

            if (image) {
                const url = await generateUploadUrl({}, { throwError: true })

                if (!url) throw new Error("Url not found")
                const results = await fetch(url, {
                    method: "POST",
                    body: image,
                    headers: {
                        "Content-Type": image.type
                    }
                })
                if (!results.ok) {
                    throw new Error("Failed to upload image")
                }
                const { storageId } = await results.json()
                values.file = storageId as Id<"_storage">
            }
            await createMessage(values, { throwError: true })
            setEditorKey(prevKey => prevKey + 1)
        } catch (error) {
            toast.error(" Une erreur est survenue!")
        } finally {
            setIsPending(false)
            editorRef.current?.enable(true);
            toast.success("Réponse envoyée !")
        }
    }

    const groupedMessage = results?.reduce((groups, message) => {
        const date = new Date(message._creationTime);
        const dateKey = format(date, 'yyy-MM-dd')
        if (!groups[dateKey]) {
            groups[dateKey] = []
        }
        groups[dateKey].unshift(message)
        return groups
    }, {} as Record<string, typeof results>);

    if (messageLoading || status === 'LoadingFirstPage') {
        return (
            <div className="h-full flex flex-col">
                <div className="flex  h-[49px] justify-between items-center px-4  border-b" >
                    <p className="text-l font-bod">Fil de discussion </p>
                    <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>Fermer</Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full  justify-center items-center">
                    <SpinLoader size="size-5" />
                </div>
            </div >)
    }
    if (!message) {
        return (<div className="h-full flex flex-col">
            <div className="flex  h-[49px] justify-between items-center px-4  border-b" >
                <p className="text-l font-bod">Fil de discussion </p>
                <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>Fermer</Button>
            </div>
            <div className="flex flex-col gap-y-2 h-full  justify-center items-center">
                <AlertTriangle className="text-red-400 size-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Message introuvable</p>
            </div>
        </div>)
    }
    return (<div className="h-full flex flex-col">
        <div className="flex  h-[49px] justify-between items-center px-4 " >
            <p className="text-xl font-bold">Fil de discussion </p>
            <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>Fermer</Button>
        </div>
        <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
            {
                Object.entries(groupedMessage || {}).map(([dateKey, messages]) => (
                    <div key={dateKey}>
                        <div className=" my-2 relative flex">
                            <hr className="absolute top-1/2 left-0 right-0 border-top border-gray-200" />
                            <span className="relative inline-block bg-sky-100  px-4 py-1  text-xs  ">
                                {results.length} Réponses
                            </span>
                            <div className="text-center justify-center items-center inline-block ml-4">
                                <span className=" relative inline-block  bg-white  px-4 py-1 rounded-full text-xs border border-gray-300 shadow-md"> {formatDateLabel(dateKey)}</span>
                            </div>
                        </div>

                        {
                            messages.map((message, index,) => {
                                const previewMessage = messages[index - 1];
                                const isCompact =
                                    previewMessage &&
                                    previewMessage.user?._id === message.user?._id &&
                                    differenceInMinutes(
                                        new Date(message._creationTime),
                                        new Date(previewMessage._creationTime)) < TIME_THRESHOLD;
                                return (
                                    <Message
                                        key={message._id}
                                        id={message._id}
                                        memberId={message.memberId}
                                        authorImages={message.user.image}
                                        authorName={message.user.name}
                                        isAuthor={message.memberId === currentMember?._id}
                                        isEditing={editingId === message._id}
                                        setEditingId={setEditingId}
                                        isCompact={isCompact}
                                        reactions={message.reactions}
                                        body={message.body}
                                        file={message.file}
                                        updatedAt={message.updatedAt}
                                        createdAt={message._creationTime}
                                        hideThreadButton={true}
                                        threadCount={message.threadCount}
                                        threadImage={message.threadImage}
                                        threadName={message.threadName}
                                        threadTimestamp={message.threadTimestamp}
                                    />
                                )
                            })
                        }

                    </div>
                ))
            }

            <div className="h-1" ref={(el) => {
                if (el) {
                    const observer = new IntersectionObserver(([entry]) => {
                        if (entry.isIntersecting && canLoadMore) {
                            loadMore()
                        }
                    }, { threshold: 1.0 });
                    observer.observe(el)
                    return () => observer.disconnect()
                }
            }} />

            {isLoadingMore && (
                <div className="text-center my-2 relative">
                    <hr className="absolute top-1/2 left-0 right-0 border-top border-gray-200" />
                    <span className="relative inline-block bg-white  px-4 py-1 rounded-full text-xs border border-gray-300 shadow-md">
                        <SpinLoader size="size-4" />
                    </span>
                </div>
            )}

            <Message
                key={message._id}
                id={message._id}
                memberId={message.memberId}
                authorImages={message.user.image}
                authorName={message.user.name}
                isAuthor={message.memberId === currentMember?._id}
                isEditing={editingId === message._id}
                setEditingId={setEditingId}
                hideThreadButton={true}
                // isCompact={false}
                reactions={message.reactions}
                body={message.body}
                file={message.file}
                updatedAt={message.updatedAt}
                createdAt={message._creationTime}
            />


        </div>
        <div className="px-4">
            <Editor diseable={isPending} innerRef={editorRef} onSubmit={handleSubmit} key={editorKey} placeholder="Répondre ..." />
        </div>
    </div>)
}
