/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

import { Sidebar } from "./sidebar";
import { ToolBar } from "./toolbar";
import WorkspaceSidebar from "./workspace-sidebar";
import { usePanel } from "@/hooks/use-panel";
import { SpinLoader } from "@/components/spin-loader";
import { Id } from "../../../../convex/_generated/dataModel";
import { Thread } from "@/components/thread";
import { Profile } from "@/features/members/components/profile";
import { useEffect, useState } from "react";
import { MobileNavigation } from "@/components/course-learning/MobileNavigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface WorkspaceLayoutProps {
    children: React.ReactNode
}
const WorkspaceIdLayout = ({ children }: WorkspaceLayoutProps) => {
    const { parentMessageId, onCLose, profileMemberId } = usePanel()
    const showPanel = !!parentMessageId || !!profileMemberId

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
        <div className="h-full">
            {
                isMobile ? (
                    <div className=" h-[calc(100vh-40px)] ">
                        {children}
                        <div className="fixed bottom-0 left-0 right-0 z-50">
                            <MobileNavigation 
                                isWorkspace = {true}
                                courseTitle="IMMLAB"
                                onOpenSidebar={() => setIsSidebarOpen(true)}
                                onOpenResources={() => setIsRightSidebarOpen(true)}
                            />
                        </div>
                    </div>
                )  : (
                    <> 
                    <ToolBar />
                        <div className="flex h-[calc(100vh-40px)] bg-gradient-to-b from-[#178F65] to-[#085867]">
                            {showPanel && isMobile && (
                                <Dialog open={showPanel} onOpenChange={setIsSidebarOpen}>
                                    <DialogContent className="h-full">
                                        {parentMessageId ? (
                                            <Thread messageId={parentMessageId as Id<"messages">} onClose={onCLose} />
                                        ) : profileMemberId ? (
                                            <Profile memberId={profileMemberId as Id<"members">} onClose={onCLose} />
                                        ) : (
                                            <div className="h-full flex items-center justify-center">
                                                <SpinLoader />
                                            </div>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            )}
                        {!isMobile && <Sidebar />}
                            <div className=" rounded-md flex h-[calc(100vh-45px)] w-[calc(100vw-85px)] bg-gradient-to-b from-white to-teal-50">
                                <ResizablePanelGroup direction="horizontal" autoSaveId='immlab-workspace-layout'>
                                    <ResizablePanel defaultSize={20} minSize={11} className="bg-[##0284c7] shadow-2xl">
                                        <WorkspaceSidebar />
                                    </ResizablePanel>
                                    < ResizableHandle withHandle />
                                    <ResizablePanel minSize={30} defaultSize={40}>
                                        {children}
                                    </ResizablePanel>
                                    {showPanel &&
                                        (<>
                                            < ResizableHandle withHandle />
                                            <ResizablePanel defaultSize={29} minSize={20} className="shadow-2xl" >
                                                {parentMessageId
                                                    ?
                                                    <Thread messageId={parentMessageId as Id<"messages">} onClose={onCLose} />
                                                    :
                                                    profileMemberId
                                                        ? (
                                                            <Profile
                                                                memberId={profileMemberId as Id<"members">}
                                                                onClose={onCLose} />
                                                        )
                                                        :
                                                        <div className="h-full flex   items-center justify-center">
                                                            <SpinLoader />
                                                        </div>
                                                }
                                            </ResizablePanel>
                                        </>)
                                    }
                                </ResizablePanelGroup>
                            </div>
                        </div>
                    </>
                )
            }
           
        </div>
    );
}

export default WorkspaceIdLayout;
