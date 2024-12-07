/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"


import { DahboardToolbar } from "@/components/dashboard-toolbar";
import { Sidebar } from "../workspace/[workspaceId]/sidebar";


interface WorkspaceLayoutProps {
    children: React.ReactNode
}
const WorkspaceIdLayout = ({ children }: WorkspaceLayoutProps) => {

    return (
        <div className="h-full">
            <DahboardToolbar />
            <div className="flex h-[calc(100vh-40px)] bg-gradient-to-b from-[#178F65] to-[#085867]">
                <Sidebar />
                <div className=" rounded-md flex h-[calc(100vh-45px)] w-[calc(100vw-85px)] bg-gradient-to-b from-white to-teal-50">
                    {children}
                </div>

            </div>
        </div>
    );
}

export default WorkspaceIdLayout;
