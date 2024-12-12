import { AlertTriangle, Book, BookMarked, HashIcon, Loader, MessageCircle, SendHorizontal, VideoIcon, Text, Nfc, Mic } from 'lucide-react'

import { WorkspaceHeader } from './workspace-header'
import { WorkspaceSection } from './workspace-section'
import { SidebarItem } from './sidebar-item'
import { UserItem } from './user-item'
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal'
import { useCurrentUser } from "@/features/auth/api/user-current-user";


import { useCurrentMember } from '@/features/members/api/use-get-current-member'
import { useGetMembers } from '@/features/members/api/use-get-members'

import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useGetChannels } from '@/features/channels/api/use-get-channels'

import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useChannelId } from '@/hooks/use-channel-id'
import { useMmeberId } from '@/hooks/use-member-id'

import React from 'react'
import { FaPoll } from 'react-icons/fa'


const WorkspaceSidebar = () => {
    const {data: connectedUser} = useCurrentUser ()

    const workspaceId = useWorkspaceId()
    const channelId = useChannelId()
    const memberId = useMmeberId()
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId })
    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId })
    // creation d'un salon 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_open, setOpen] = useCreateChannelModal()
    const icon = (type: string) => {
        switch (type) {
            case "audio": return Mic
            case "video": return VideoIcon
            case "live": return Nfc
            case 'poll': return FaPoll
            case 'post': return Book
            case 'board': return BookMarked
            case 'course': return VideoIcon
            default: return HashIcon
        }
    }
    if (workspaceLoading || memberLoading) {
        return (
            <div className='flex flex-col  items-center justify-center gradient bg-[#fafafa] h-full'>
                <Loader className='size-5 animate-spintext-[#1a1b1a]' />
            </div>
        )
    }
    if (!workspace || !member) {
        return (
            <div className='flex flex-col items-center gap-y-2 justify-center bg-[#fafafa] h-full'>
                <AlertTriangle className='size-5 text-[#1a1b1a]' />
                <p className='text-[#1a1b1a] text-sm'>
                    Workspace introuvable
                </p>
            </div>
        )
    }
    return (
        <div className='flex flex-col rounded-l-md  h-full'>
            <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"} />
            <div className="flex flex-col px-2 mt-3">
                <SidebarItem
                    label="Non Lus"
                    icon={MessageCircle}
                    id="thread"
                />
                <SidebarItem
                    label="Fil de Discussion"
                    icon={Text}
                    id="drafts"
                />
                <SidebarItem
                    label="Brouillons et Envoyés"
                    icon={SendHorizontal}
                    id="drafts"
                />
            </div>
            <WorkspaceSection label="Salons" hint="Nouveaux Salons" onNew={member.role === "admin" && connectedUser?.role === "admin" ? () => setOpen(true) : undefined}>
                {
                    channels?.map(((item) => (
                        <SidebarItem
                            key={item._id}
                            label={item.name}
                            icon={icon(item.type as string)}
                            id={item._id}
                            variant={channelId === item._id ? "active" : "default"}
                        />
                    )))
                }
            </WorkspaceSection>

            <WorkspaceSection label="Message Directs" hint="Nouveau Message" onNew={() => { }}>
                {
                    members?.map(((item) => (
                        <div key={item._id}>
                            <UserItem
                                label={item.user.name}
                                id={item._id}
                                image={item.user.image}
                                variant={item._id === memberId ? "active" : "default"}
                            />
                        </div>
                    )))
                }
            </WorkspaceSection>
        </div >
    )
}

export default WorkspaceSidebar
