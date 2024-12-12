/* eslint-disable @typescript-eslint/no-unused-vars */
import { SidebarItem } from '@/app/(admin)/dashboard/_components/sidebar-items'
import { useCurrentUser } from '@/features/auth/api/user-current-user'

import {
    LibraryBig, GraduationCap, SearchCheck, FileTerminal, Users, Shapes,
} from 'lucide-react'
import { usePathname } from 'next/navigation'

import React from 'react'
import { FaChartBar } from 'react-icons/fa'


const CourseSidebar = () => {
    const pathname = usePathname()
    const { data: connectedUser } = useCurrentUser()

    return (
        <div className='hidden  md:flex flex-col rounded-l-md  h-full '>
            <div className="flex flex-col px-2 mt-4">
                {connectedUser?.role === "admin" && (
                    <SidebarItem
                        label="Statistiques"
                        icon={FaChartBar}
                        link="/dashboard/courses"
                        variant={pathname.includes('/dashboard') ? "active" : "default"}
                    />
                )}
                <SidebarItem
                    label="Explorer"
                    icon={SearchCheck}
                    link="/courses"
                    variant={pathname === '/courses' ? "active" : "default"}
                />
                <SidebarItem
                    label="Mes cours"
                    icon={LibraryBig}
                    variant={pathname.includes('/bookmarks') ? "active" : "default"}
                    link="/bookmarks"
                />

                {/* <SidebarItem
                    label="Mes Analyses"
                    icon={ChartCandlestick}
                    link="/courses"
                /> */}
                {/* <SidebarItem
                    label="Mon Journal"
                    icon={Notebook}
                    link="/certificates"
                /> */}
                {/* <SidebarItem
                    label="Mes Messages"
                    icon={MessageSquareWarning}
                    link="/dashboard/certificates"
                /> */}
                <SidebarItem
                    label="Mes Exercices"
                    icon={FileTerminal}
                    link="/exercices"
                    variant={pathname.includes('/exercices') ? "active" : "default"}
                />
                <SidebarItem
                    label="Mes Certificats"
                    icon={GraduationCap}
                    link="/certificates"
                    variant={pathname.includes('/certificates') ? "active" : "default"}
                />
                {connectedUser?.role === "admin" && (
                    <>
                        <SidebarItem
                            label="Marketing"
                            icon={Shapes}
                            link="/marketing"
                            variant={pathname.includes('/marketing') ? "active" : "default"}
                        />
                        <SidebarItem
                            label="Utilisateurs"
                            icon={Users}
                            link="/users"
                            variant={pathname.includes('/users') ? "active" : "default"}
                        />
                    </>
                )}

            </div>

        </div >
    )
}

export default CourseSidebar
