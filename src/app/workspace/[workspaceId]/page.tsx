'use client'
import { Loader, ShieldAlert, AlertTriangle as TriangleAlert } from "lucide-react";

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-get-current-member";
import { useNavigation } from "@/hooks/use-navigation";

import { useEffect, useMemo } from "react";

const WorkspaceIdPage = () => {
    const workspaceId = useWorkspaceId()
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId })
    const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId })
    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId })
    const { navigate } = useNavigation();

    const [open, setOpen] = useCreateChannelModal()

    const channelId = useMemo(() => channels?.[0]?._id, [channels])
    const isAdmin = useMemo(() => member?.role === 'admin', [member?.role])

    useEffect(() => {
        if (workspaceLoading || channelsLoading || !workspace || !isAdmin || memberLoading) return
        if (channelId) navigate(`/workspace/${workspaceId}/channel/${channelId}`)
        else if (!open && isAdmin) setOpen(true)
    }, [channelId, workspaceLoading, workspace, channelsLoading, navigate, workspaceId, open, setOpen, member, isAdmin, memberLoading])

    if (workspaceLoading || memberLoading || channelsLoading) {
        return (
            <div className='flex flex-col items-center justify-center h-full'>
                <Loader className='size-8 animate-spin text-white' />
            </div>
        )
    }
    
    if (!workspace || !member) return (
        <div className='h-full flex flex-col gap-2 items-center justify-center'>
            <TriangleAlert className='size-10 text-muted-foreground text-orange-400' />
            <span className="text-sm text-muted-foreground">
                Communauté introuvable ou non accessible
            </span>
        </div>
    )

    return (
        <div className='h-full flex flex-col gap-2 items-center justify-center'>
            <ShieldAlert className='size-12 text-muted-foreground text-orange-400' />
            <span className="text-sm text-muted-foreground">
                Aucun salon pour le moment
            </span>
        </div>
    )
}

export default WorkspaceIdPage;
