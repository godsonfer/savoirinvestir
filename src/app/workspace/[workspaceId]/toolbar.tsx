import { Button } from '@/components/ui/button'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'

import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { Info, Search } from 'lucide-react'
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"


import React from 'react'
import { useGetChannels } from '@/features/channels/api/use-get-channels'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { Id } from '../../../../convex/_generated/dataModel'
import { useRouter } from 'next/navigation'
import { DialogTitle } from '@radix-ui/react-dialog'

export const ToolBar = () => {
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const onChannelClick = (channel: Id<"channels">) => {
        setOpen(false)
        router.push(`/workspace/${workspaceId}/channel/${channel}`)
    }
    const onMemberClick = (memberId: Id<"members">) => {
        setOpen(false)
        router.push(`/workspace/${workspaceId}/members/${memberId}`)
    }
    const workspaceId = useWorkspaceId()
    const { data } = useGetWorkspace({ id: workspaceId })
    const { data: channels } = useGetChannels({ workspaceId })
    const { data: members } = useGetMembers({ workspaceId })

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])
    return (
        <nav className='bg-gradient-to-r from-[#178F65]  to-[#085867]/80 flex items-center  justify-between h-10 p-1.5'>
            <div className='flex-1' />
            <div className="min-w-280px max-[642px] grow-[2] shrink"  >
                <Button onClick={() => setOpen(true)} size='sm' className='bg-accent/25 hover:bg-accent-25 rounded-sm w-full justify-start h-7 px-2 '>
                    <Search className='size-4  text-white mr-2' />
                    <span className='text-white text-xs'>Recherche dans {data?.name} {' '}
                        <kbd className="pointer-events-none justify-end items-end inline-flex flex-1 h-5 select-none gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </span>
                </Button>


                <CommandDialog open={open} onOpenChange={setOpen}>
                    <DialogTitle>{ }</DialogTitle>

                    <CommandInput placeholder="Entrez votre recherche..." />
                    <CommandList>
                        <CommandEmpty>Aucun résultat.</CommandEmpty>
                        <CommandGroup heading="Salons">
                            {
                                channels?.map(channel => (
                                    <CommandItem key={channel._id} onSelect={() => onChannelClick(channel._id)} >
                                        {channel.name}
                                    </CommandItem>
                                ))
                            }
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading="Membres">
                            {
                                members?.map(member => (
                                    <CommandItem key={member._id} onSelect={() => onMemberClick(member._id)} >
                                        {member.user.name}
                                    </CommandItem>
                                ))
                            }
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>
            </div>
            <div className="ml-auto flex flex-1 items-center   justify-end">
                <Button variant='transparent' size="iconSm">
                    <Info className="size-5 text-white"></Info>
                </Button>
            </div>
        </nav >
    )
}
