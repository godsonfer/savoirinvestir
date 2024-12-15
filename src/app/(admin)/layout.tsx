/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"


import { DahboardToolbar } from "@/components/dashboard-toolbar";
import { Sidebar } from "../workspace/[workspaceId]/sidebar";
import CourseSidebar from "../(students)/courses/components/students-sidebar";
import { useCurrentUser } from "@/features/auth/api/user-current-user";
import { redirect } from "next/navigation";

interface WorkspaceLayoutProps {
    children: React.ReactNode
}
const WorkspaceIdLayout = ({ children }: WorkspaceLayoutProps) => {
    const {data: connectedUser, isLoading} = useCurrentUser ()
    if( !isLoading && connectedUser?.role !== "admin") {
        return redirect("/courses")
    }

    return (
        <div className="h-full">
            <DahboardToolbar />
            <div className="flex h-[calc(100vh-40px)] bg-gradient-to-b from-[#178F65] to-[#085867]">
                <Sidebar />
                <div className=" rounded-md flex h-[calc(100vh-45px)] w-[calc(100vw-85px)] bg-gradient-to-b from-white to-teal-50">
                    <ResizablePanelGroup direction="horizontal" autoSaveId='immlab-workspace-layout'>
                        <ResizablePanel defaultSize={20} minSize={11} className="bg-[##0284c7] shadow-2xl">
                            <CourseSidebar />
                        </ResizablePanel>
                        < ResizableHandle withHandle />
                        <ResizablePanel minSize={30} defaultSize={80}>
                            {children}
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>

            </div>
        </div>
    );
}

export default WorkspaceIdLayout;
