"use client"

import { useCreateWorkspaceAtom } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCurrentUser } from '@/features/auth/api/user-current-user'

const LoadingScreen = () => (
    <div className="h-full flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-6">
            <div className="relative w-[120px] h-[120px] mb-4">
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-pulse-slow" />
                <div className="absolute inset-0 bg-blue-300/30 rounded-full blur-md animate-pulse" />
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-400 rounded-full animate-sparkle"
                        style={{
                            top: `${50 - 40 * Math.sin(i * Math.PI / 3)}%`,
                            left: `${50 - 40 * Math.cos(i * Math.PI / 3)}%`,
                            animationDelay: `${i * 0.5}s`
                        }}
                    />
                ))}
                <Image
                    src="/logo.svg"
                    alt="Logo"
                    fill
                    className="object-contain relative z-10"
                    priority
                />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Communauté
            </h1>
            <div className="flex flex-col items-center gap-3">
                <div className="w-[250px] h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded-md" />
                <div className="w-[350px] h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded-md delay-75" />
                <div className="w-[300px] h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded-md delay-150" />
            </div>
        </div>
        <div className="flex flex-col items-center gap-4 mt-4">
            <div className="flex gap-4">
                {[...Array(3)].map((_, i) => (
                    <div 
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"
                        style={{ animationDelay: `${i * 150}ms` }}
                    />
                ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Chargement de votre espace, assurez vous d&apos;avoir un accès a la communauté...
            </p>
        </div>
    </div>
);

export default function Home() {
    const {data : user} = useCurrentUser()
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
            if (user?.role === "admin") {
                setOpen(true)
            }
        }
    }, [workspaceId, isLoading, open, setOpen, router, user])

    if (isLoading) {
        return <LoadingScreen />
    }

    return <LoadingScreen />
}
