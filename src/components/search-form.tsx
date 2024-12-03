"use client"

import { useEffect, useState } from "react"

import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"

  
import { Search, X, Command as CommandIcon, Loader2 } from "lucide-react"
import { Dialog } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Doc } from "../../convex/_generated/dataModel"

interface SearchResult extends Doc<"courses"> {
    category?: string;
    studentsCount?: number;
    rating?: string;
    chaptersCount?: number;
    canDelete?: boolean;
    chapters?: any[];
    bookmark?: boolean;
    enrollments?: any[];
}

interface SearchFormProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    isLoading?: boolean
    results?: SearchResult[]
}

export const SearchForm = ({ 
    value, 
    onChange,
    isLoading,
    results = [],
    placeholder = "Rechercher des formations...",
    className 
}: SearchFormProps) => {
    const [open, setOpen] = useState(false)
    const [isMac, setIsMac] = useState(false)

    useEffect(() => {
        setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
    }, [])

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "r" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const hasResults = Array.isArray(results) && results.length > 0
    const showNoResults = value && !isLoading && (!results || results.length === 0)

    const handleClose = () => {
        setOpen(false)
        onChange("")
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className={cn(
                    "group w-full relative",
                    "px-4 py-3 rounded-lg",
                    "bg-muted/50 hover:bg-muted/80",
                    "text-muted-foreground text-sm text-left",
                    "transition-all duration-300",
                    "border border-border/50",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20",
                    className
                )}
            >
                <div className="flex items-center gap-3">
                    <Search className="h-4 w-4" />
                    <span>{placeholder}</span>
                </div>
                <kbd className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center gap-1 text-xs text-muted-foreground/50">
                    <CommandIcon className="h-3 w-3" />
                    <span>{isMac ? 'R' : 'Ctrl R'}</span>
                </kbd>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <Command className="relative z-50">
                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
                                onClick={handleClose}
                            >
                                <div 
                                    className="fixed inset-0 z-50 flex items-start justify-center pt-20"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="relative w-full max-w-2xl overflow-hidden rounded-lg border bg-background shadow-xl"
                                    >
                                        <button
                                            onClick={handleClose}
                                            className={cn(
                                                "absolute right-4 top-4 z-50",
                                                "p-2 rounded-full",
                                                "hover:bg-muted/80",
                                                "text-muted-foreground hover:text-foreground",
                                                "transition-colors duration-200"
                                            )}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>

                                        <div className="absolute right-14 top-[1.15rem] z-50">
                                            <kbd className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                                                Fermer
                                            </kbd>
                                        </div>

                                        <div className="relative flex items-center border-b">
                                            <CommandInput
                                                value={value}
                                                onValueChange={onChange}
                                                placeholder="Rechercher des formations..."
                                                className={cn(
                                                    "w-full border-0 px-12 py-6",
                                                    "bg-transparent placeholder:text-muted-foreground",
                                                    "focus:outline-none focus:ring-0",
                                                    "text-base"
                                                )}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Escape") {
                                                        handleClose()
                                                    }
                                                }}
                                            />
                                            {isLoading ? (
                                                <Loader2 className="absolute right-14 h-4 w-4 animate-spin text-muted-foreground" />
                                            ) : value && (
                                                <button
                                                    onClick={() => onChange("")}
                                                    className="absolute right-14 hover:text-foreground text-muted-foreground"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>

                                        <CommandList className="max-h-[60vh] overflow-y-auto p-4">
                                            {value && (
                                                <AnimatePresence mode="wait">
                                                    {isLoading ? (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="flex justify-center py-8"
                                                        >
                                                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                                        </motion.div>
                                                    ) : showNoResults ? (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="text-center py-8 text-muted-foreground"
                                                        >
                                                              <CommandEmpty>Aucun résultat trouvé</CommandEmpty>
                                                        </motion.div>
                                                    ) : hasResults && (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="space-y-2"
                                                        >
                                                            {results.map((result) => (
                                                                <CommandItem
                                                                    key={result._id}
                                                                    value={result.title}
                                                                    className="px-2 py-1 rounded-md cursor-pointer hover:bg-muted"
                                                                    onSelect={() => {
                                                                        window.location.href = `/courses/${result._id}`
                                                                    }}
                                                                >
                                                                    {result.title}
                                                                </CommandItem>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            )}
                                        </CommandList>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Command>
            </Dialog>
        </>
    )
} 
