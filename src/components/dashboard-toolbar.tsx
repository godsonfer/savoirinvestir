/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button'
import { Info, Search, Moon, Sun } from 'lucide-react'
import React from 'react'
import { useGetCourses } from "@/features/courses/api/use-get-courses";
import { useRouter } from 'next/navigation'
import { useTheme } from "next-themes"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { Id } from '../../convex/_generated/dataModel';
import { useCurrentUser } from '@/features/auth/api/user-current-user';

export const DahboardToolbar = () => {
    const [open, setOpen] = React.useState(false)
    const { setTheme, theme } = useTheme()
    const router = useRouter()
    const { data: user } = useCurrentUser()
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const { results: courses, } = useGetCourses()
    const onCoruseClick = (courseId: Id<"courses">) => {
        setOpen(false)
        if (user?.role === "admin" || user?.role === "teacher") {
            router.push(`/dashboard/courses/${courseId}`)
        } else {
            router.push(`/courses/${courseId}`)
        }
    }
    return (
        <nav className='bg-gradient-to-r from-[#178F65]  to-[#085867]/80 dark:bg-gradient-to-r dark:from-[#178F65]   dark:to-[#085567]/80 flex items-center  justify-between h-10 p-1.5'>
            <div className='flex-1' />
            <div className="min-w-280px max-[642px] grow-[2] shrink"  >
                <Button onClick={() => setOpen(true)} size='sm' className=' bg-accent-100/25 hover:bg-accent-25  rounded-sm w-full justify-start h-7 px-2 '>
                    <Search className='size-4  text-white mr-2' />
                    <span className='text-white text-xs'>Rechercher un cours  ou un séance workshorp
                        <kbd className="pointer-events-none justify-end items-end inline-flex flex-1 h-5 select-none gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </span>
                </Button>

                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput placeholder="Entrez votre recherche..." />
                    <CommandList>
                        <CommandEmpty>Aucun résultat.</CommandEmpty>
                        <CommandGroup heading="Cours">
                            {
                                courses?.map(coruse => (
                                    <CommandItem key={coruse._id} onSelect={() => onCoruseClick(coruse._id)} >
                                        {coruse.title}
                                    </CommandItem>
                                ))
                            }
                        </CommandGroup>
                        <CommandSeparator />
                    </CommandList>
                </CommandDialog>
            </div>
            <div className="ml-auto flex flex-1 items-center justify-end gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="transparent" size="iconSm">
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-white" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-white" />
                            <span className="sr-only">Changer le thème</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Clair
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Sombre
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            Système
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button variant='transparent' size="iconSm">
                    <Info className="size-5 text-white"></Info>
                </Button>
            </div>
        </nav>
    )
}
