"use client"
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface SearchBarProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
    className?: string;
}

export const SearchBar = ({ 
    placeholder = "Rechercher...", 
    onSearch,
    className = ""
}: SearchBarProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(searchQuery);
    };

    return (
        <form 
            onSubmit={handleSearch}
            className={`relative max-w-xl w-full ${className}`}
        >
            <div className={`
                relative flex items-center transition-all duration-300
                ${isFocused ? 'transform scale-[1.02]' : ''}
            `}>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0097A7]/5 to-[#D6620F]/5 
                dark:from-[#0097A7]/10 dark:to-[#D6620F]/10 rounded-lg blur-sm -z-10" />
                
                <div className="relative flex items-center w-full bg-white dark:bg-gray-800 
                rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="flex items-center px-4 border-r border-gray-200 dark:border-gray-700">
                        <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        className="flex-1 px-4 py-2 bg-transparent text-gray-900 dark:text-gray-100 
                        placeholder-gray-500 dark:placeholder-gray-400 outline-none w-full text-sm"
                    />
                    
                    {searchQuery && (
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 bg-gradient-to-r from-[#0097A7] to-[#D6620F] text-white 
                            font-medium text-sm hover:opacity-90 transition-opacity duration-300"
                        >
                            Rechercher
                        </motion.button>
                    )}
                </div>
            </div>
        </form>
    );
}; 
