import {
    ChartCandlestick, ChartGantt, LibraryBig, GraduationCap, SearchCheck, HeartIcon, FileTerminal,
    Notebook, MessageSquareWarning,

    Users,
    Shapes
} from 'lucide-react'


import React from 'react'
import { SidebarItem } from './sidebar-items'


const DashboardSidebar = () => {

    return (
        <div className='flex flex-col rounded-l-md  h-full'>

            <div className="flex flex-col px-2 mt-4">
                <SidebarItem
                    label="Statistiques"
                    icon={ChartGantt}
                    link='/dashboard'
                    variant={"active"}
                />
                <SidebarItem
                    label="Mes cours"
                    icon={LibraryBig}
                    link="/courses"
                />
                <SidebarItem
                    label="Mes Favoris"
                    icon={HeartIcon}
                    link="/courses"
                />
                <SidebarItem
                    label="Mes Analyses"
                    icon={ChartCandlestick}
                    link="/courses"
                />
                <SidebarItem
                    label="Mon Journal"
                    icon={Notebook}
                    link="/dashboard/certificates"
                />
                <SidebarItem
                    label="Mes Messages"
                    icon={MessageSquareWarning}
                    link="/dashboard/certificates"
                />
                <SidebarItem
                    label="Mes Exercices"
                    icon={FileTerminal}
                    link="/dashboard/certificates"
                />
                <SidebarItem
                    label="Mes Certificats"
                    icon={GraduationCap}
                    link="/dashboard/certificates"
                />

                <SidebarItem
                    label="Explorer"
                    icon={SearchCheck}
                    link="/courses"
                />

                <SidebarItem
                    label="Marketing"
                    icon={Shapes}
                    link="/courses"
                />
                <SidebarItem
                    label="Etudiants"
                    icon={Users}
                    link="/courses"
                />

            </div>

        </div >
    )
}

export default DashboardSidebar