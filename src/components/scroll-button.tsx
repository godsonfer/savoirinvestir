"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronUp } from "lucide-react"
import { RefObject } from "react"

interface ScrollButtonProps {
    sections: {
        id: string
        ref: RefObject<HTMLDivElement>
        label: string
    }[]
}

export const ScrollButton = ({ sections }: ScrollButtonProps) => {
    const scrollToSection = (ref: RefObject<HTMLDivElement>) => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg"
                    size="icon"
                >
                    <ChevronUp className="h-6 w-6" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {sections.map((section) => (
                    <DropdownMenuItem
                        key={section.id}
                        onClick={() => scrollToSection(section.ref)}
                        className={section.id === "top" ? "font-medium" : ""}
                    >
                        {section.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 
