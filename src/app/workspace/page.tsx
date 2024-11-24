"use client"

import { useCreateWorkspaceAtom } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SpinLoader } from "@/components/spin-loader";


export default function Home() {
    const router = useRouter()
    const [open, setOpen] = useCreateWorkspaceAtom()
    const { data, isLoading } = useGetWorkspaces()
    const workspaceId = useMemo(() => data?.[0]?._id, [data])

    useEffect(() => {
        if (isLoading) { return }
        if (workspaceId) {
            router.replace(`/workspace/${workspaceId}`)
            setOpen(false)
        } else if (!open) {
            setOpen(true)
        }

    }, [workspaceId, isLoading, open, setOpen, router])

    return (
        <div className="h-full flex items-center justify-center">
            <SpinLoader />
        </div>
    );
}
