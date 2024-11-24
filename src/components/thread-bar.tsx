import { formatDistanceToNow } from "date-fns";
import { fr } from 'date-fns/locale'

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ChevronRight } from "lucide-react";

interface ThreadCountProps {
    threadCount?: number;
    image?: string;
    timestamp?: number;
    name?: string;
    handleThread: () => void;
}

export const ThreadBar = ({ threadCount, handleThread, image, timestamp, name = "Member" }: ThreadCountProps) => {
    const avataFallback = name.charAt(0).toUpperCase()

    if (!threadCount || !timestamp) return null
    if (threadCount) return (<div className="justify-start items-start relative left-0">
        <button onClick={handleThread} className="rounded-md  hover:bg-white hover:border-gray-900 border-transparent hover:border-border group/thread-bar flex items-center justify-start transition w-[600px] p-1">
            <div className="flex items-center gap-2 overflow-hidden">
                <Avatar className='size-6 shrink-0'>
                    <AvatarImage src={image} />
                    <AvatarFallback >
                        {avataFallback}
                    </AvatarFallback>
                </Avatar>
                <span className="text-xm text-sky-70 hover:underline font-bold truncate">
                    {threadCount} {threadCount > 1 ? "réponses" : "réponse"}
                </span>
                <span className="text-xm text-muted-foreground truncate group-hover/thread-bar:hidden block">
                    Dernière réponse:  {formatDistanceToNow(timestamp, { addSuffix: true, locale: fr })}
                </span>
                <span className="tex-xm text-muted-foreground text-sky-600  truncate group-hover/thread-bar:block hidden">
                    Affiche le fil de disccussion
                </span>
            </div>
            <ChevronRight className="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0" />
        </button>
    </div>)
}
