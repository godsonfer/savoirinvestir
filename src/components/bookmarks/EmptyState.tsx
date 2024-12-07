import { Search } from "lucide-react"

export const EmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
            <Search className="w-12 h-12 md:w-16 md:h-16 text-gray-500/20 mb-4" />
            <h2 className="text-lg md:text-xl font-semibold text-gray-300 mb-2">
                Aucun résultat trouvé
            </h2>
            <p className="text-sm md:text-base text-gray-400">
                Essayez avec d&apos;autres termes de recherche
            </p>
        </div>
    )
} 
