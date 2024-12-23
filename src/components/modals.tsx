'use client'

import { CreateChannelModal } from "@/features/channels/componets/create-channel-modal"
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal"
import { useEffect, useState } from "react"

export const Modals = () => {
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted) return null
    return (
        <div>

            <CreateChannelModal />
            <CreateWorkspaceModal />
        </div>
    )
}
