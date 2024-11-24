import { useCreateMessage } from "@/features/messages/api/use-create-message";

import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";

import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import dynamic from "next/dynamic"
import Quill from "quill"
import { useRef, useState } from "react"
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

interface ChatInputProps {
    placeholder: string;
}

type createMessageValues = {
    channelId: Id<"channels">;
    workspaceId: Id<"workspaces">;
    body: string;
    file: Id<"_storage"> | undefined
}
export const ChatInput = ({ placeholder }: ChatInputProps) => {
    const [editorKey, setEditorKey] = useState(0)
    const [isPending, setIsPending] = useState(false)

    const editorRef = useRef<Quill | null>(null)

    const workspaceId = useWorkspaceId()
    const channelId = useChannelId()
    const { mutate: createMessage } = useCreateMessage()
    const { mutate: generateUploadUrl } = useGenerateUploadUrl()

    const handleSubmit = async ({ body, image }: { body: string, image: File | null }) => {
        try {
            setIsPending(true)
            editorRef.current?.enable(false);
            const values: createMessageValues = { channelId, workspaceId, body, file: undefined }

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
            toast.success("Message envoyé avec succès !")
        }
    }
    return (
        <div className="px-5 w-full">
            <Editor
                variant="create"
                key={editorKey}
                onSubmit={handleSubmit}
                placeholder={placeholder}
                diseable={isPending}
                innerRef={editorRef}
            />
        </div>
    )
}
