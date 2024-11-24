/* eslint-disable @typescript-eslint/no-unused-vars */
import { format } from "date-fns"
import React from 'react'
interface ChannelHeroProps {
    name: string;
    creationTime: number;
    members?: number;
    description?: string;
}
export const ChannelHero = ({ name, creationTime, members, description }: ChannelHeroProps) => {
    return (
        <div className='mt-[88px]  mx-5 mb-4'>Salon
            <p className="text-2xl font-bold flex items-center mb-2 ">
                #{name}
            </p>
            <p className="font-normal text-slate-800 mb-4 ">
                Ce salon a été cree le {format(new Date(creationTime), 'dd-MM-yyyy')} à {format(new Date(creationTime), 'HH:mm:ss')}.
                C&apos;est le début d&apos;une bonne avanture avec <strong> {members} membre(s)</strong> de la communauté.
                Vous discuter de vos idées, vos points de vue, vos questions et votre <strong>bon courage</strong>.
            </p>
        </div>
    )
}
