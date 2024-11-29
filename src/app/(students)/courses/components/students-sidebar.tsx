import { SidebarItem } from '@/app/(admin)/dashboard/_components/sidebar-items'
import {
    ChartCandlestick, LibraryBig, GraduationCap, SearchCheck,  FileTerminal,
    Notebook, 
    Users,
    Shapes,
    ChartBar
} from 'lucide-react'
import { usePathname } from 'next/navigation'

import React from 'react'


const CourseSidebar = () => {
    const pathname = usePathname()
    return (
        <div className='flex flex-col rounded-l-md  h-full'>

            <div className="flex flex-col px-2 mt-4">
                <SidebarItem
                    label="Statistiques"
                    icon={ChartBar}
                    link="/dashboard/courses"
                    variant={pathname.includes('/dashboard') ? "active" : "default"}
                />
                <SidebarItem
                    label="Explorer"
                    icon={SearchCheck}
                    link="/courses"
                    variant={pathname ==='/courses' ? "active" : "default"}
                />
                <SidebarItem
                    label="Mes cours"
                    icon={LibraryBig}
                    variant={pathname.includes('/my_courses') ? "active" : "default"}
                    link="/bookmarks"
                />
              
                <SidebarItem
                    label="Mes Analyses"
                    icon={ChartCandlestick}
                    link="/courses"
                />
                <SidebarItem
                    label="Mon Journal"
                    icon={Notebook}
                    link="/certificates"
                />
                {/* <SidebarItem
                    label="Mes Messages"
                    icon={MessageSquareWarning}
                    link="/dashboard/certificates"
                /> */}
                <SidebarItem
                    label="Mes Exercices"
                    icon={FileTerminal}
                    link="/exercices"
                />
                <SidebarItem
                    label="Mes Certificats"
                    icon={GraduationCap}
                    link="/certificates"
                />
                <SidebarItem
                    label="Marketing"
                    icon={Shapes}
                    link="/marketing"
                />
                <SidebarItem
                    label="Utilisateurs"
                    icon={Users}
                    link="/users"
                />

            </div>

        </div >
    )
}

export default CourseSidebar
