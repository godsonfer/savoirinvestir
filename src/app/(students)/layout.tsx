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
    const [_isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [_isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className=" w-full ">
            {isMobile ? (
                <div className=" h-[calc(100vh-40px)] ">
                    {children}
                    <div className="fixed bottom-0 left-0 right-0 z-50">
                        <MobileNavigation
                            onOpenSidebar={() => setIsSidebarOpen(true)}
                            onOpenResources={() => setIsRightSidebarOpen(true)}
                        />
                    </div>
                </div>
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
