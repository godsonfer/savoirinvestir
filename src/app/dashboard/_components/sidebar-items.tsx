import React from 'react'
// import { Id } from '../../../../convex/_generated/dataModel'
import Link from 'next/link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

import { IconType } from 'react-icons/lib'
import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

const sidebarItemVariant = cva(
    "flex items-center gap-1.5 justify-start font-normal h-8 px-[18px] mt-4 mb-3 text-md overflow-hidden",
    {
        variants: {
            variant: {
                default: "text-[#085867] hover:text-white font-bold   hover:bg-[#085867] ",
                active: "text-[#085867] bg-[#1897] hover:bg-[#085867] hover:text-white hover:font-bold ",
            },
        },
        defaultVariants: {
            variant: 'default'
        }
    }
)
interface SidebarItemProps {
    label: string
    icon: LucideIcon | IconType
    variant?: VariantProps<typeof sidebarItemVariant>["variant"]
    link?: string
}
export const SidebarItem = ({ label, icon: Icon, variant, link = '/' }: SidebarItemProps) => {
    return (
        <Button
            variant={'transparent'} size={"sm"}
            asChild
            className={cn(sidebarItemVariant({ variant }))}
        >
            <Link href={link}>
                <Icon className='size-3.5 mr-1 shrink-0 transform scale-110 hover:translate-x-10' />
                <span className='text-sm truncate'>{label}</span>
            </Link>
        </Button>
    )
}

