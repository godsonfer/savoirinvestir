import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ChevronDown, ListFilter, SquarePen } from 'lucide-react'
import { PreferencesModal } from './preferences-modal'

import { Hint } from '@/components/ui/hint'
import React, { useState } from 'react'
import { Doc } from '../../../../convex/_generated/dataModel'
import { InviteModal } from './invite-modal'

interface WorkspaceHeaderProps {
    workspace: Doc<'workspaces'>
    isAdmin: boolean
}
export const WorkspaceHeader = ({ workspace, isAdmin }: WorkspaceHeaderProps) => {
    const [preferenceOpen, setPreferenceOpne] = useState(false)
    const [inviteeOpen, setInviteOpen] = useState(false)

    return (
        <>
            <InviteModal
                open={inviteeOpen}
                setOpen={setInviteOpen}
                name={workspace.name}
                joinCode={workspace.joinCode}
            />
            <PreferencesModal
                open={preferenceOpen}
                setOpen={setPreferenceOpne}
                initialValue={workspace.name} />

            <div className='flex items-center justify-between px-4 h-[49px] gap-0.5'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant='transparent'
                            className='font-semibold text-lg w-auto p-1.5 overflow-hidden hover:bg-[#085867]/80'
                            size='sm'
                        >
                            <span className='truncate'> {workspace.name} </span>
                            <ChevronDown className='size-4 ml-1 shrink-0' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='bottom' align='start' className='w-64'>
                        <DropdownMenuItem className='cursor-pointer capitalize'>
                            <div className="size-9 relative overflow-hidden bg-[#59598a]  font-semibold text-[#085867] text-xl rounded-md flex items-center justify-center mr-2">
                                {workspace.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col items-start">
                                <p className='font-bold'>
                                    {workspace.name}
                                </p>
                                <p className='text-sx text-muted-foreground'>
                                    Espace active
                                </p>
                            </div>
                        </DropdownMenuItem>
                        {isAdmin && (
                            <>
                                <DropdownMenuItem className='cursor-pointer py-2' onClick={() => { setInviteOpen(true) }}>
                                    Inviter des étudiants à  {workspace.name}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className='cursor-pointer py-2' onClick={() => setPreferenceOpne(true)}>
                                    Préférences
                                </DropdownMenuItem>
                            </>
                        )}
                        <DropdownMenuSeparator />
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center justify-center gap-0.5">
                    <Hint label="Filter les conversations" side='bottom' align='start'>
                        <Button variant="transparent" size="iconSm">
                            <ListFilter className='size-4' />
                        </Button>
                    </Hint>

                    <Hint label="Nouveau Message" side='bottom' align='start'>
                        <Button variant="transparent" size="iconSm">
                            <SquarePen className='size-4' />
                        </Button>
                    </Hint>
                </div>
            </div>
        </>
    )
}
