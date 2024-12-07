import { Search } from "lucide-react"

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
    return (
        <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <input
                type="text"
                placeholder="Rechercher un cours..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm md:text-base rounded-lg 
                    bg-white/5 border border-white/10
                    focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/25
                    text-gray-100 placeholder-gray-400 outline-none transition-all"
            />
        </div>
    )
} 
