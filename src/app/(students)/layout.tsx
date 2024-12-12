/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

import { DahboardToolbar } from "@/components/dashboard-toolbar";
import { Sidebar } from "../workspace/[workspaceId]/sidebar";
import CourseSidebar from "./courses/components/students-sidebar";
import { useEffect, useState } from "react";
import { MobileNavigation } from "@/components/course-learning/MobileNavigation";

interface WorkspaceLayoutProps {
    children: React.ReactNode
}

const WorkspaceIdLayout = ({ children }: WorkspaceLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
                setIsRightSidebarOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className=" h-[calc(100vh-40px)]  w-full ">
            {isMobile ? (
                <>
                    {children}
                    <MobileNavigation
                        onOpenSidebar={() => setIsSidebarOpen(true)}
                        onOpenResources={() => setIsRightSidebarOpen(true)}
                    />
                    <div className="">{children}</div>
                </>
            ) : (
                <>
                    <div>
                        <DahboardToolbar />
                        <div className="flex h-[calc(100vh-40px)] bg-gradient-to-b from-[#178F65] to-[#085867]">
                            <Sidebar />
                            <div className="rounded-md flex h-[calc(100vh-45px)] w-[calc(100vw-85px)] bg-gradient-to-b from-white to-teal-50">
                                <ResizablePanelGroup direction="horizontal" autoSaveId='immlab-workspace-layout'>
                                    <ResizablePanel defaultSize={20} minSize={11} className="bg-[##0284c7] shadow-2xl">
                                        <CourseSidebar />
                                    </ResizablePanel>
                                    <ResizableHandle withHandle />
                                    <ResizablePanel minSize={30} defaultSize={80}>
                                        {children}
                                    </ResizablePanel>
                                </ResizablePanelGroup>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <style jsx global>{`
        @media (max-width: 1024px) {
          body {
            padding-bottom: 4rem;
            overflow-x: hidden;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
        </div>
    );
}

export default WorkspaceIdLayout;

