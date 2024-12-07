'use client'
import { useJoin } from '@/features/workspaces/api/use-join'
import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspace-info'
import { Id } from '../../../../convex/_generated/dataModel'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import React, { useEffect, useMemo } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import VerificationInput from "react-verification-input"

import { Button } from '@/components/ui/button'

import { Loader, SendToBack, } from 'lucide-react'
import { cn } from '@/lib/utils'

interface JoinPageProps {
    params: { workspaceId: Id<"workspaces"> }
}
const JoinPage = ({ params }: JoinPageProps) => {
    const router = useRouter()

    const { data, isLoading } = useGetWorkspaceInfo({ workspaceId: params.workspaceId })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { mutate, isPending } = useJoin()
    const isMember = useMemo((() => data?.isMember), [data?.isMember])
    useEffect(() => {
        if (isMember) router.replace(`/workspace/${params.workspaceId}`)
    }, [isMember, router, params.workspaceId])
    const handleComplete = (values: string) => {
        mutate({ workspaceId: params.workspaceId, joinCode: values }, {
            onSuccess: (id) => {
                toast.success("Bienvenu dans la communauté")
                router.replace(`/workspace/${id}`)
            },
            onError: () => {
                toast.error("Erreur d'accès à la communauté")
            },
        })
    }

    if (isLoading) return (<div className='h-full flex flex-col  gap-y-8  items-center justify-center bordder  shadow-md'>
        <Loader className='size-8 animate-spin text-gray-700' />
    </div>)

    return (
        <div className='h-full flex flex-col  gap-y-8  items-center justify-center bg-white p-8 rounded-lg shadow-md'>
            <Image src="/logo.svg" alt='Logo' height={60} width={60} />
            <div className="flex flex-col justify-center items-center gap-y-4 max-w-md">
                <div className="flex flex-col gap-y-2 justify-center items-center">
                    <h1 className='text-xl font-bold'>Rejoindre la communauté   {data?.name?.toUpperCase()}</h1>
                    <p className='text-md text-muted-foreground'> Entrez le code d&apos;accès pour rejoindre</p>
                </div>
            </div>
            <VerificationInput
                classNames={{
                    container: cn("flex gap-y-2", isPending && ('opacity-50 cursor-not-allowed')),
                    character: 'uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500',
                    characterInactive: 'bg-muted',
                    characterSelected: 'bg-accent-500 text-black',
                    characterFilled: 'bg-accent-500 text-black',
                }}
                length={6}
                autoFocus
                onComplete={e => handleComplete(e)}
            />
            <div className="flex gap-x-4">
                <Button size='lg' asChild variant={"outline"}>
                    <Link href="/">
                        <SendToBack className="size-4 mr-2" />
                        Retourn à l&apos;accueil
                    </Link>

                </Button>
            </div>
        </div>
    )
}

export default JoinPage
