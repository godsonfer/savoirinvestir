/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';

import React, { useState } from "react"
interface EmojiPopoverProps {
    children: React.ReactNode;
    hint?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onEmojiSelect: (value: string) => void
}


export const EmojiPopover = ({ children, hint = "Emoji", onEmojiSelect }: EmojiPopoverProps) => {
    const [popoverOpen, setPopoverOpen] = useState(false)
    const [tooltipOpen, setTooltipOpen] = useState(false)

    const onSelect = (value: EmojiClickData) => {
        onEmojiSelect(value.emoji)
        setPopoverOpen(false)
        setTimeout(() => {
            setTooltipOpen(false)
        }, 500)
    }
    return (
        <TooltipProvider>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen} delayDuration={50}>
                    <PopoverTrigger asChild>
                        <TooltipTrigger asChild>
                            {children}
                        </TooltipTrigger>
                    </PopoverTrigger>
                    <TooltipContent className="bg-black text-white  border  border-white/50">
                        <p className="font-medium text-xs">
                            {hint}
                        </p>
                    </TooltipContent>
                </Tooltip>
                <PopoverContent className="p-0 border-none  shadow-none">
                    <EmojiPicker onEmojiClick={onSelect} />
                </PopoverContent>
            </Popover>
        </TooltipProvider>
    )
}
