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

interface WorkspaceLayoutProps {
    children: React.ReactNode
}
const WorkspaceIdLayout = ({ children }: WorkspaceLayoutProps) => {
    const { parentMessageId, onCLose, profileMemberId } = usePanel()
    const showPanel = !!parentMessageId || !!profileMemberId

    return (
        <div className="h-full">
            <ToolBar />
            <div className="flex h-[calc(100vh-40px)] bg-gradient-to-b from-[#178F65] to-[#085867]">
                <Sidebar />
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

                        {/* <ResizablePanel defaultSize={20} minSize={20} className="bg-[##0284c7]">
                        <div>
                            Vidéo player
                        </div>
                    </ResizablePanel> */}
                        {/* < ResizableHandle withHandle /> */}
                    </ResizablePanelGroup>
                </div>

            </div>
        </div>
    );
}

export default WorkspaceIdLayout;
