/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Id } from "../../convex/_generated/dataModel"
import React from "react"
import { CalendarIcon, FolderOpen, Heart, TextIcon } from "lucide-react"
import { formatDate } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "./ui/button"

interface CourseDetailsCardProps {

    title: string,
    description: string,
    duration?: number,
    price?: number,
    creationDate: number,
    id: Id<"courses">

    // author?: {
    //     name: string
    //     role: string
    // },

}

export const CourseDetailsCard = ({
    children,
    title,
    description,
    duration,
    price,
    creationDate,
    id,
}: Readonly<{
    children: React.ReactNode;
    title: string;
    description: string;
    duration?: number;
    price?: number;
    coverImage?: string;
    creationDate: number;
    id: Id<"courses">;
}>) => {

    return (
        <HoverCard closeDelay={200} >
            <HoverCardTrigger asChild>
                {children}
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-fuchsia-50 rounded-sm">
                <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                        <div className="flex">
                            <TextIcon className="mr-2 h-4 w-4 opacity-70" />
                            <h4 className="text-sm font-semibold">{title}</h4>
                        </div>
                        <div className="flex">
                            <FolderOpen className="mr-2 h-4 w-4 opacity-70" />
                            <p className="text-xs text-muted-foreground">
                                {description}
                            </p>
                        </div>
                        <div className="flex items-center pt-2">
                            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                            <span className="text-xs text-muted-foreground">
                                Ajouté le <span className="font-semibold"> {formatDate(creationDate, "dd MMMM yyyy", { locale: fr })}</span>
                            </span>
                        </div>
                        {/* TODO  */}
                        <div className="flex">
                            <Button variant={"orange"} className="" onClick={() => { }}>
                                Pourboie ${price}
                            </Button>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>

    )
}
