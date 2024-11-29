import { Button } from '@/components/ui/button'

import { Info, Search } from 'lucide-react'
import React from 'react'
import { useGetCourses } from "@/features/courses/api/use-get-courses";
import { useRouter } from 'next/navigation'

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { Id } from '../../convex/_generated/dataModel';

export const DahboardToolbar = () => {
    const [open, setOpen] = React.useState(false)

    const router = useRouter()

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
        router.push(`/dashboard/courses/${courseId}`)
    }
    return (
        <nav className='bg-gradient-to-r from-[#178F65]  to-[#085867]/80 flex items-center  justify-between h-10 p-1.5'>
            <div className='flex-1' />
            <div className="min-w-280px max-[642px] grow-[2] shrink"  >
                <Button onClick={() => setOpen(true)} size='sm' className='bg-accent/25 hover:bg-accent-25 rounded-sm w-full justify-start h-7 px-2 '>
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
                        {/* <CommandGroup heading="Leçons">

                            <CommandItem  >
                                Leçons
                            </CommandItem>
                        </CommandGroup> */}
                    </CommandList>
                </CommandDialog>
            </div>
            <div className="ml-auto flex flex-1 items-center   justify-end">
                <Button variant='transparent' size="iconSm">
                    <Info className="size-5 text-white"></Info>
                </Button>
            </div>
        </nav >
    )
}
