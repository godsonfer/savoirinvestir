/* eslint-disable @typescript-eslint/no-unused-vars */
import { AvatarFallback, Avatar, AvatarImage } from '@/components/ui/avatar'

import React from 'react'
interface ConversationHeroProps {
    name?: string;
    memberImage?: string;
}
export const ConversationHero = ({ name = "Vous", memberImage }: ConversationHeroProps) => {
    const avatarFallback = name?.charAt(0).toUpperCase()

    return (
        <div className='mt-[88px]  mx-5 mb-4'>
            <div className="flex items-center gap-x-1 mb-2">
                <Avatar className='size-9 rounded-md mr-2'>
                    <AvatarImage src={memberImage} alt={name} />
                    <AvatarFallback className='size-9 bg-slate-600 justify-center items-center font-extrabold text-2xl'>
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
                <p className="text-2xl font-bold mr-2">
                    {name}
                </p>
            </div>

            <p className="font-normal text-slate-800 mb-4 ">
                Conversation privée entre <strong> Vous </strong > et <strong> {name}</strong>
            </p>

        </div >
    )
}
