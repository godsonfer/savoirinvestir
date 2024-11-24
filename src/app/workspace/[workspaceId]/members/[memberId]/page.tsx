"use client"
import { SpinLoader } from '@/components/spin-loader'
import { Alert } from '@/components/alert'
import { toast } from 'sonner'
import { Conversation } from '@/app/workspace/[workspaceId]/members/[memberId]/conversation'

import { useCreateOrGetConversation } from '@/features/coversations/api/use-create-or-get-conversation'
import { useMmeberId } from '@/hooks/use-member-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { Id } from '../../../../../../convex/_generated/dataModel'

import React, { useEffect, useState } from 'react'

const MemberIdPage = () => {
    const workspaceId = useWorkspaceId()
    const memberId = useMmeberId()
    const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null)
    const { mutate, isPending } = useCreateOrGetConversation()

    useEffect(() => {
        mutate({ workspaceId, memberId },
            {
                onSuccess(data) {
                    setConversationId(data)
                },
                onError() {
                    toast.error("Impossible de créer une conversation pour le membre. Veuillez réessayer plus tard. ")
                }
            })
    }, [mutate, workspaceId, memberId,])

    if (isPending) {
        return (
            <div className="h-full flex   items-center justify-center">
                <SpinLoader />
            </div>
        )
    }
    if (!conversationId) {
        return (
            <Alert label='Conversation introuvable' variant='success' />
        )
    }
    return <Conversation id={conversationId} />
}

export default MemberIdPage
