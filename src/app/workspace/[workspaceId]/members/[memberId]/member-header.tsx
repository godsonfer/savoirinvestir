import { AvatarFallback, Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import React from 'react'

interface MemberHeaderProps {
    memberName?: string | undefined
    memberImage?: string
    onClick?: () => void
}
export const MemberHeader = ({ memberName, memberImage, onClick }: MemberHeaderProps) => {
    const avatarFallback = memberName?.charAt(0).toUpperCase()
    return (
        <div className='bg-white h-[49px] border-b rounded-t  flex items-center px-2 overflow-hidden'>
            <Button onClick={onClick} variant={"ghost"} className='text-lg font-semibold  overflow-hidden w-auto' size={"sm"}>
                <Avatar >
                    <AvatarImage src={memberImage} alt={memberName} />
                    <AvatarFallback className='bg-orange-500'>
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
                <span className='truncate'> {memberName} </span>
                <ChevronDown className='size-2.5 ml-2 shrink-0' />
            </Button>
        </div>
    )
}

