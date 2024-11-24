// "use client"
// import { AvatarFallback, Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader, Plus } from 'lucide-react'

import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces'
import { useCreateWorkspaceAtom } from '@/features/workspaces/store/use-create-workspace-modal'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useRouter } from 'next/navigation'
import React from 'react'

export const WorspaceSwitcher = () => {
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_open, setOpen] = useCreateWorkspaceAtom()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: workspaces } = useGetWorkspaces()
    const { data: workspace, isLoading: worspaceLoading } = useGetWorkspace({ id: workspaceId })

    const filterWorspaces = workspaces?.filter(
        (workspace) => workspace?._id !== workspaceId)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className='group-hover:scale-110 transition-all  size-9 relave overflow-hidden bg-[#59598a] hover:g-[#ababad]/80 text-white font-bold text-xl'>
                    {worspaceLoading ? (
                        <Loader className='size-5 animate-spin shrink-0' />
                    ) : (workspace?.name.charAt(0).toUpperCase())}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' side='bottom' className='w-64'>
                {filterWorspaces?.map((workspace) => (
                    <DropdownMenuItem key={workspace._id} onClick={() => router.push(`/workspace/${workspace._id}`)} className='cursor-pointer  flex-col justify-start items-start capitalize'>
                        {workspace.name}
                        <span className="text-xm text-muted-foreground text-slate-400">
                            Salon Actif
                        </span>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuItem className="cursor-pointer" onClick={() => setOpen(true)}>
                    <div className='size-9 relative overflow-hidden bg-[#ababad] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center  mr-2'>
                        <Plus />
                    </div>
                    Ajouter un espace de travail
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

