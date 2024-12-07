"use client"

import { useEffect, useState, useRef } from "react"

import {
    Command,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"

  
import { Search, X, Command as CommandIcon, Loader2 } from "lucide-react"
import { Dialog } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Doc } from "../../convex/_generated/dataModel"

interface Chapter {
    _id: string;
    title: string;
    position: number;
    isPublished?: boolean;
}

interface Enrollment {
    _id: string;
    userId: string;
    courseId: string;
    createdAt: string;
}

interface SearchResult extends Doc<"courses"> {
    category?: string;
    studentsCount?: number;
    rating?: {
        _id: string;
        value: number;
        _creationTime: number;
    }[];
    chaptersCount?: number;
    canDelete?: boolean;
    chapters?: Chapter[];
    bookmark?: boolean;
    enrollments?: Enrollment[];
}

interface SearchFormProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    isLoading?: boolean
    results?: SearchResult[]
}

type Filter = 'all' | 'popular' | 'recent' | 'bookmarked'

const Badge = ({ children, variant = "default" }: { children: React.ReactNode, variant?: "default" | "success" | "warning" }) => (
    <span className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium",
        variant === "success" && "bg-green-100 text-green-800",
        variant === "warning" && "bg-yellow-100 text-yellow-800",
        variant === "default" && "bg-muted text-muted-foreground"
    )}>
        {children}
    </span>
)

const filterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.2
        }
    })
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
    const inputRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState<string | null>(null)
    const [searchHistory, setSearchHistory] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            return JSON.parse(localStorage.getItem('searchHistory') || '[]')
        }
        return []
    })
    const [activeFilter, setActiveFilter] = useState<Filter>('all')

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

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 100)
        }
    }, [open])

    const hasResults = Array.isArray(results) && results.length > 0
    const showNoResults = value && !isLoading && (!results || results.length === 0)

    console.log(results, "results", showNoResults)
    const handleClose = () => {
        setOpen(false)
        onChange("")
    }

    const searchAnimation = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { duration: 0.2 }
    };

    const resultsAnimation = {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 },
        transition: { duration: 0.15 }
    };

    const handleSelect = (courseId: string) => {
        try {
            addToHistory(value)
            window.location.href = `/courses/${courseId}`
        } catch (err) {
            setError("Une erreur est survenue lors de la redirection")
            setTimeout(() => setError(null), 3000)
        }
    }

    const addToHistory = (query: string) => {
        if (query.trim()) {
            const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 5)
            setSearchHistory(newHistory)
            localStorage.setItem('searchHistory', JSON.stringify(newHistory))
        }
    }

    const useKeyboardShortcuts = () => {
        useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (open) {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault()
                    }
                    
                    if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
                        e.preventDefault()
                        inputRef.current?.focus()
                    }
                }
            }

            window.addEventListener('keydown', handleKeyDown)
            return () => window.removeEventListener('keydown', handleKeyDown)
        }, )
    }

    useKeyboardShortcuts()

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setOpen(true)}
                aria-label="Ouvrir la recherche"
                aria-expanded={open}
                className={cn(
                    "group w-full relative",
                    "px-4 py-3 rounded-lg",
                    "bg-gradient-to-r from-muted/50 to-muted/30",
                    "hover:from-muted/70 hover:to-muted/50",
                    "text-muted-foreground text-sm text-left",
                    "transition-all duration-300",
                    "border border-border/50",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20",
                    "shadow-sm hover:shadow-md",
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
            </motion.button>

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
                                                ref={inputRef}
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
                                          
                                        </div>

                                        <div className="flex gap-2 p-2 border-b">
                                            {[
                                                { id: 'all', label: 'Tout' },
                                                { id: 'popular', label: 'Populaire' },
                                                { id: 'recent', label: 'Récent' },
                                                { id: 'bookmarked', label: 'Favoris' },
                                            ].map((filter, index) => (
                                                <motion.button
                                                    key={filter.id}
                                                    onClick={() => setActiveFilter(filter.id as Filter)}
                                                    className={cn(
                                                        "px-3 py-1 text-sm rounded-full transition-colors",
                                                        activeFilter === filter.id
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                                    )}
                                                    variants={filterVariants}
                                                    custom={index}
                                                    initial="hidden"
                                                    animate="visible"
                                                >
                                                    {filter.label}
                                                </motion.button>
                                            ))}
                                        </div>

                                        <CommandList className="max-h-[60vh] overflow-y-auto p-4">
                                            {!value && searchHistory.length > 0 && (
                                                <div className="p-2">
                                                    <p className="px-2 text-xs text-muted-foreground mb-2">Recherches récentes</p>
                                                    {searchHistory.map((query, index) => (
                                                        <CommandItem
                                                            key={index}
                                                            value={query}
                                                            className="flex items-center gap-2 px-2 py-1.5 text-sm"
                                                            onSelect={() => onChange(query)}
                                                        >
                                                            <Search className="h-4 w-4 text-muted-foreground" />
                                                            {query}
                                                        </CommandItem>
                                                    ))}
                                                </div>
                                            )}
                                            {value && (
                                                <AnimatePresence mode="wait">
                                                    {isLoading ? (
                                                        <motion.div
                                                            {...searchAnimation}
                                                            className="flex flex-col items-center justify-center py-12 space-y-4"
                                                        >
                                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                            <p className="text-sm text-muted-foreground">Recherche en cours...</p>
                                                        </motion.div>
                                                    ) : showNoResults ? (
                                                        <motion.div
                                                            {...searchAnimation}
                                                            className="flex flex-col items-center justify-center py-12 space-y-4"
                                                        >
                                                            <div className="p-4 rounded-full bg-muted">
                                                                <Search className="h-6 w-6 text-muted-foreground" />
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                Aucun résultat trouvé pour &ldquo;{value}&rdquo;
                                                            </p>
                                                        </motion.div>
                                                    ) : hasResults && (
                                                        <motion.div
                                                            {...resultsAnimation}
                                                            className="space-y-2"
                                                        >
                                                            {results.map((result) => (
                                                                <CommandItem
                                                                    key={result._id}
                                                                    value={result.title}
                                                                    className={cn(
                                                                        "px-4 py-3 rounded-lg",
                                                                        "cursor-pointer",
                                                                        "hover:bg-muted/80",
                                                                        "transition-all duration-200",
                                                                        "flex items-center justify-between"
                                                                    )}
                                                                    onSelect={() => {
                                                                        handleSelect(result._id)
                                                                    }}
                                                                >
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="font-medium">{result.title}</span>
                                                                        <div className="flex items-center gap-2">
                                                                            {result.category && (
                                                                                <Badge>{result.category}</Badge>
                                                                            )}
                                                                            {result.studentsCount && (
                                                                                <Badge variant="success">
                                                                                    {result.studentsCount} étudiants
                                                                                </Badge>
                                                                            )}
                                                                            {result.chaptersCount && (
                                                                                <Badge variant="warning">
                                                                                    {result.chaptersCount} chapitres
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                        {result.rating && result.rating.length > 0 && (
                                                                            <span className="flex items-center gap-1">
                                                                                <span className="text-yellow-500">★</span>
                                                                                {(result.rating.reduce((acc, r) => acc + r.value, 0) / result.rating.length).toFixed(1)}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            )}
                                            {error && (
                                                <div className="p-4 text-sm text-red-500 text-center">
                                                    {error}
                                                </div>
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
