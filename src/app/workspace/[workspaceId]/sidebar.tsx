/* eslint-disable @typescript-eslint/no-unused-vars */
import UserButton from '@/features/auth/components/user-button'
import { Bell, Headphones, Home, MessagesSquare, MoreHorizontal, MonitorPlay, BookOpenCheck } from 'lucide-react'

import { WorspaceSwitcher } from './workspace-switcher'
import { SidebarButton } from './sidebar-button'

import React from 'react'
import { usePathname } from 'next/navigation'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useCurrentMember } from '@/features/members/api/use-get-current-member'

export const Sidebar = () => {
    const pathname = usePathname()
    const workspaceId = useWorkspaceId()
    // const { data: currentMember } = useCurrentMember({ workspaceId })
    // TODO:: Il faut que ce soit les admin qui peuvent changer de workspace
    return (
        <aside className='w-[80px] h-full  flex  flex-col gap-y-4 items-center pt-[8px] pb-4 '>
            {workspaceId && <WorspaceSwitcher />}
            <SidebarButton href='/dashboard/courses' icon={Home} isActive={pathname.includes('/dashboard')} label='Dashboard' />
            <SidebarButton href='/workspace' icon={MessagesSquare} isActive={pathname.includes('/workspace')} label='Discussions' />
            <SidebarButton href='/courses' icon={MonitorPlay} label='Cours' isActive={pathname.includes('/courses')} />
            <SidebarButton icon={BookOpenCheck} label='Exercices' isActive={false} />
            <SidebarButton icon={Headphones} label='Coaching' isActive={false} />
            <SidebarButton icon={Bell} label='Notitications' isActive={false} />
            <SidebarButton icon={MoreHorizontal} label='Plus' isActive={false} />
            <div className='flex flex-col items-center  justify-center gap-y-1 mt-auto'>
                <UserButton />
            </div>
        </aside>
    )
}

