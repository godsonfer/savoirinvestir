/* eslint-disable @typescript-eslint/no-unused-vars */
import UserButton from '@/features/auth/components/user-button'
import { Bell, Headphones, Home, MessagesSquare, MoreHorizontal, MonitorPlay, BookOpenCheck, HomeIcon, CameraIcon, Radio, BellDot } from 'lucide-react'

import { WorspaceSwitcher } from './workspace-switcher'
import { SidebarButton } from './sidebar-button'

import React from 'react'
import { usePathname } from 'next/navigation'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useCurrentMember } from '@/features/members/api/use-get-current-member'
import { useCurrentUser } from '@/features/auth/api/user-current-user'

export const Sidebar = () => {
    const pathname = usePathname()
    const workspaceId = useWorkspaceId()
    const { data: connectedUser } = useCurrentUser()
    // const { data: currentMember } = useCurrentMember({ workspaceId })
    // TODO:: Il faut que ce soit les admin qui peuvent changer de workspace
    return (
        <aside className=' hidden md:flex w-[80px] h-full    flex-col gap-y-4 items-center pt-[8px] pb-4 '>
            {workspaceId && <WorspaceSwitcher />}
            {
                connectedUser?.role === 'admin'
                && <SidebarButton href='/dashboard/courses' icon={Home} isActive={pathname.includes('/dashboard')} label='Dashboard' />
            }

            <SidebarButton href='/courses' icon={MonitorPlay} label='Cours' isActive={pathname.includes('/courses')} />
            <SidebarButton href='/workspace' icon={MessagesSquare} isActive={pathname.includes('/workspace')} label='Discussions' />
            <SidebarButton icon={Radio} label='Live' href='/live' isActive={false} />
            <SidebarButton icon={BellDot} label='Infos' href='/infos' isActive={false} />
            <SidebarButton icon={MoreHorizontal} label='Plus' isActive={false} />
            {/* <SidebarButton icon={Headphones} label='Coaching' isActive={false} /> */}
            {/* bas de la barre */}
            <div className='flex flex-col items-center  justify-center gap-y-1 mt-auto'>
                <div className='mb-8'>
                    <SidebarButton href='/' icon={HomeIcon} label='Accueil' isActive={false} />
                </div>
                <UserButton />
            </div>
        </aside>
    )
}

