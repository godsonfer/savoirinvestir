import { useState } from "react";
import { Search } from "lucide-react";
import { X } from "lucide-react";

export const SearchForm = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <div className="flex p-2">
            <div className="w-[420px] relative flex">
                <button
                    className={`flex items-center justify-center mr-2 ml-2 w-8 h-8 rounded-full bg-background text-muted-foreground hover:bg-muted hover:text-muted-foreground-inverse transition-transform duration-300 ${isSearchOpen ? "rotate-45" : "rotate-0"}`}
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                    {isSearchOpen ? <X className="size-6" /> : <Search className="size-6" />}
                </button>
                <div className={`transition-all duration-500 ease-in-out ${isSearchOpen ? "w-full opacity-100" : "max-w-0 opacity-0 overflow-hidden"}`}>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-md bg-transparent text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus:ring-sky-400 focus-visible:ring-ring transition-all duration-500 ease-in-out"
                        placeholder="Rechercher un cours"
                        onFocus={() => setIsSearchOpen(true)}
                        onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                    />
                </div>
            </div>
        </div>
    );
};

