import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react'
import { IconType } from "react-icons/lib"

import React from 'react'
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface SidebarButtonProps {
    icon: LucideIcon | IconType;
    label: string;
    href?: string;
    isActive: boolean
}
export const SidebarButton = ({ label, icon: Icon, isActive, href = "/dashboard" }: SidebarButtonProps) => {
    const router = useRouter();
    const changeLink = () => {
        router.push(href)
    }
    return (
        <div className='flex flex-col items-center justify-center gap-y-0.5  cursor-pointer group'>
            <Button onClick={changeLink}
                variant='transparent'
                className={cn(
                    "size-9 p-2 group-hover:bg-accent/20 ",
                    isActive && ("bg-accent/30 text-sky-500  ")
                )}
            >
                <Icon className='size-5 text-white group-hover:scale-110 transition-all ' />
            </Button>
            <span className='text-[12px] text-white font-bold  justify-center group-hover:text-accent '>
                {label}
            </span>
        </div>
    )
}

